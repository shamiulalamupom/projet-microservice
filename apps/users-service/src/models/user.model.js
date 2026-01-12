const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ["client", "manager"] }
  },
  { timestamps: true }
);

module.exports = { User: mongoose.model("User", UserSchema) };
