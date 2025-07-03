const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      index: true // ✅ faster queries for client side
    },
    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // ✅ not strictly required when client views note
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// ✅ Optional: Ensure only one note per appointment-counselor pair
noteSchema.index({ appointmentId: 1, counselorId: 1 }, { unique: true });

module.exports = mongoose.model('Note', noteSchema);
