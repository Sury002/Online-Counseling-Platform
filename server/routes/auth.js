const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user});
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ msg: 'Email is required' });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(200).json({ msg: 'If user exists, reset email will be sent' }); // don't reveal user existence

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = Date.now() + 60 * 60 * 1000;

  user.resetPasswordToken = token;
  user.resetPasswordExpires = expiry;
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const html = `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`;

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Link',
    html
  });

  res.json({ msg: 'Reset link sent to your email' });
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ msg: 'Password reset successful. You can now login.' });
});
