const express = require("express");
const { z } = require("zod");
const { User } = require("../models/user.model");
const { AppError } = require("../utils/errors");
const { internalOnly } = require("../middlewares/internalOnly");

const router = express.Router();

const createUserSchema = z.object({
  email: z.email(),
  passwordHash: z.string().min(10),
  role: z.enum(["client", "manager"])
});

// Internal create (gateway will call later)
router.post("/users", internalOnly, async (req, res, next) => {
  try {
    const data = createUserSchema.parse(req.body);
    const created = await User.create(data);
    res.status(201).json({ id: created.id, email: created.email, role: created.role });
  } catch (e) {
    if (e.code === 11000) return next(new AppError(409, "CONFLICT", "Email already used"));
    next(e);
  }
});

// Read user (internal)
router.get("/users/:id", internalOnly, async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id).lean();
    if (!u) return next(new AppError(404, "NOT_FOUND", "User not found"));
    res.json({ id: u._id.toString(), email: u.email, role: u.role });
  } catch (e) {
    next(e);
  }
});

module.exports = { usersRouter: router };
