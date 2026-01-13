const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    dateTime: { type: Date, required: true },
    totalSeats: { type: Number, required: true, min: 1 },
    availableSeats: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

module.exports = { Trip: mongoose.model("Trip", TripSchema) };
