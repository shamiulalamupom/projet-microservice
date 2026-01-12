const express = require("express");
const { User } = require("../models/user.model");
const { AppError } = require("../utils/errors");
const { internalOnly } = require("../middlewares/internalOnly");

const router = express.Router();

router.get("/internal/users/by-email", internalOnly, async (req, res, next) => {
  try {
    const email = req.query.email;
    if (!email) return next(new AppError(400, "VALIDATION_ERROR", "email is required"));
    const u = await User.findOne({ email }).lean();
    if (!u) return next(new AppError(404, "NOT_FOUND", "User not found"));
    res.json({
      id: u._id.toString(),
      email: u.email,
      passwordHash: u.passwordHash,
      role: u.role
    });
  } catch (e) {
    next(e);
  }
});

module.exports = { internalRouter: router };
