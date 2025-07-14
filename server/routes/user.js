const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateEmailTemplate = require("../utils/emailTemplate");
const sendEmail = require("../utils/sendEmail");

//  Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
});

// Update profile 
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true, select: "-password" }
    );
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
});

// Change password
router.put("/change-password/:id", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.params.id).select('+password');
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    user.password = newPassword;
    await user.save();

    // Send confirmation email
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

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ 
      message: "Error changing password", 
      error: err.message 
    });
  }
});

module.exports = router;
