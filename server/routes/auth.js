const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const crypto = require("crypto");
const generateEmailTemplate = require("../utils/emailTemplate");

const router = express.Router();

const VERIFICATION_EXPIRATION = 24 * 60 * 60 * 1000;


// Register with Email Verification
router.post("/register", async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const { name, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = new User({
      name,
      email,
      password,
      role,
      verified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + VERIFICATION_EXPIRATION,
    });

    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    const emailTemplate = generateEmailTemplate(user, verifyUrl, "verify", 24);

    await sendEmail({
      to: user.email,
      subject: "Verify Your WellMind Account",
      html: emailTemplate,
    });

    res.status(201).json({
      msg: "Registered successfully. Please check your email to verify.",
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ msg: "Registration failed. Please try again." });
  }
});

// Email Verification Endpoint
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid or expired verification link. Please request a new one.",
      });
    }

    user.verified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({
      msg: "Email verified successfully! You can now login.",
    });
  } catch (err) {
    console.error("Email Verification Error:", err);
    res.status(500).json({ msg: "Email verification failed" });
  }
});

// Resend Verification Email
router.post("/resend-verification", async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });
    if (user.verified)
      return res.status(400).json({ msg: "Email already verified" });

    const newToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = newToken;
    user.emailVerificationExpires = Date.now() + VERIFICATION_EXPIRATION;
    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${newToken}`;
    const emailTemplate = generateEmailTemplate(user, verifyUrl, "verify", 24);

    await sendEmail({
      to: user.email,
      subject: "Verify Your WellMind Account",
      html: emailTemplate,
    });

    res.json({ msg: "New verification email sent" });
  } catch (err) {
    console.error("Resend Verification Error:", err);
    res.status(500).json({ msg: "Failed to resend verification email" });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ msg: "If user exists, reset email will be sent" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 7200000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    const emailTemplate = generateEmailTemplate(user, resetUrl, "reset", 2);

    await sendEmail({
      to: user.email,
      subject: "Reset Your WellMind Account Password",
      html: emailTemplate,
    });

    res.json({ msg: "If user exists, reset email will be sent" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ msg: "Failed to process password reset request" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    // Set the new password (let pre-save hook handle hashing)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const emailTemplate = generateEmailTemplate(
      user,
      `${process.env.CLIENT_URL}/login`,
      "confirmation",
      0
    );

    await sendEmail({
      to: user.email,
      subject: "Your WellMind Account Password Was Changed",
      html: emailTemplate,
    });

    res.json({ msg: "Password reset successful. You can now login." });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ msg: "Failed to reset password" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const { password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user.verified) {
      return res
        .status(403)
        .json({ msg: "Email not verified. Please check your inbox." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
