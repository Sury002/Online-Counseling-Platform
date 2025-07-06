const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      index: true,
    },
    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

noteSchema.index({ appointmentId: 1, counselorId: 1 }, { unique: true });

module.exports = mongoose.model("Note", noteSchema);
