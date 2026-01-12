const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    tripId: { type: String, required: true },
    seats: { type: Number, required: true, min: 1 },
    status: { type: String, required: true, enum: ["pending", "confirmed", "canceled", "expired"] }
  },
  { timestamps: true }
);

module.exports = { Reservation: mongoose.model("Reservation", ReservationSchema) };
