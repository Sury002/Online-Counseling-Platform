const express = require("express");
const ChatMessage = require("../models/ChatMessage");

const router = express.Router();

router.post("/", async (req, res) => {
  const { sender, receiver, appointmentId, message } = req.body;

  if (!sender || !receiver || !appointmentId || !message) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const newMsg = await ChatMessage.create({
      sender,
      receiver,
      appointmentId,
      message,
      read: false,
    });

    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ msg: "Failed to save message", error: err.message });
  }
});

router.get("/appointment/:appointmentId", async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      appointmentId: req.params.appointmentId,
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch messages", error: err.message });
  }
});

router.patch("/read/:appointmentId/:userId", async (req, res) => {
  const { appointmentId, userId } = req.params;

  try {
    const updated = await ChatMessage.updateMany(
      {
        appointmentId,
        receiver: userId,
        read: false,
      },
      { $set: { read: true } }
    );

    res.json({ success: true, updatedCount: updated.modifiedCount });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to mark messages as read", error: err.message });
  }
});

module.exports = router;
