const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// ✅ Save or update a note by counselor for a given appointment
router.put('/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { content, counselorId } = req.body;

    if (!content) return res.status(400).json({ msg: 'Content is required' });
    if (!counselorId) return res.status(400).json({ msg: 'counselorId is required' });

    const note = await Note.findOneAndUpdate(
      { appointmentId, counselorId },
      { content },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.json(note);
  } catch (err) {
    console.error("❌ Full error:", err);
    res.status(500).json({ msg: 'Server error saving note', error: err.message });
  }
});

// ✅ Get a specific note by appointmentId + counselorId (for editing)
router.get('/counselor/:appointmentId/:counselorId', async (req, res) => {
  try {
    const note = await Note.findOne({
      appointmentId: req.params.appointmentId,
      counselorId: req.params.counselorId
    });

    if (!note) return res.status(404).json({ msg: "Note not found" });

    res.json(note);
  } catch (err) {
    console.error("❌ Error fetching counselor note:", err.message);
    res.status(500).json({ msg: 'Error fetching counselor note' });
  }
});

// ✅ Get note by appointmentId (for client to view their completed sessions)
router.get('/:appointmentId', async (req, res) => {
  try {
    const note = await Note.findOne({ appointmentId: req.params.appointmentId });

    if (!note) return res.status(404).json({ msg: "Note not found" });

    res.json(note);
  } catch (err) {
    console.error("❌ Error fetching note by appointmentId:", err.message);
    res.status(500).json({ msg: 'Error fetching note' });
  }
});

module.exports = router;
