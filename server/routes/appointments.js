const express = require("express");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

const router = express.Router();

// Book an appointment
router.post("/book", async (req, res) => {
  const { clientId, counselorId, sessionType, date } = req.body;

  if (!clientId || !counselorId || !sessionType || !date) {
    return res.status(400).json({
      msg: "Missing fields in appointment booking",
      received: { clientId, counselorId, sessionType, date },
    });
  }

  try {
    const appointment = await Appointment.create({
      clientId,
      counselorId,
      sessionType,
      date,
    });
    res.status(201).json(appointment);
  } catch (err) {
    console.error("❌ DB Error:", err);
    res.status(500).json({ msg: "Error booking appointment" });
  }
});

// Get all counselors
router.get("/counselors", async (req, res) => {
  try {
    const counselors = await User.find({ role: "counselor" }, "name email");
    res.json(counselors);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching counselors" });
  }
});

// Get appointments for a client or counselor
router.get("/my/:userId", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [
        { clientId: req.params.userId },
        { counselorId: req.params.userId },
      ],
    })
      .sort({ date: -1 })
      .populate("clientId", "name email")
      .populate("counselorId", "name email");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching appointments" });
  }
});

// Get appointment by ID
router.get("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("clientId", "name email")
      .populate("counselorId", "name email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching appointment", error: err.message });
  }
});

router.get("/client/:clientId", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      clientId: req.params.clientId,
    })
      .sort({ date: -1 })
      .populate("counselorId", "name email");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching client appointments" });
  }
});

// Cancel appointment
router.patch("/:id/cancel", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment cancelled successfully", appointment });
  } catch (err) {
    console.error("❌ Cancel Error:", err);
    res.status(500).json({ message: "Error cancelling appointment" });
  }
});

// Reschedule appointment
router.patch("/:id/reschedule", async (req, res) => {
  const { id } = req.params;
  const { date } = req.body;

  if (!date) {
    return res.status(400).json({ message: "New date is required" });
  }

  try {
      const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status !== "pending") {
      return res.status(400).json({ 
        message: "Only pending appointments can be rescheduled" 
      });
    }

    const newDate = new Date(date);
    if (newDate <= new Date()) {
      return res.status(400).json({ 
        message: "New date must be in the future" 
      });
    }

   
    appointment.date = newDate;
    const updatedAppointment = await appointment.save();

    res.json(updatedAppointment);
  } catch (err) {
    console.error("❌ Reschedule Error:", err);
    res.status(500).json({ 
      message: "Error rescheduling appointment",
      error: err.message 
    });
  }
});

// Manually mark appointment as paid
router.patch("/:id/pay", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { isPaid: true },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment marked as paid", appointment });
  } catch (err) {
    res.status(500).json({ message: "Error updating payment status" });
  }
});

router.patch("/mark-completed/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: "Error marking appointment as completed" });
  }
});

module.exports = router;