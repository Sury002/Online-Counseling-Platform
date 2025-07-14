const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionType: { type: String, required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
