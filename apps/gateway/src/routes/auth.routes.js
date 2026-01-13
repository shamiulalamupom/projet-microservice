const express = require("express");
const { z } = require("zod");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { parse } = require("../utils/validate");
const { AppError } = require("../utils/errors");
const { createUser, getUserByEmail } = require("../clients/users.client");
const { env } = require("../config/env");
const { authJwt } = require("../middlewares/authJwt");

const router = express.Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["client", "manager"])
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/auth/register", async (req, res, next) => {
  try {
    const data = parse(registerSchema, req.body);
    const passwordHash = await bcrypt.hash(data.password, 10);
    const created = await createUser({ email: data.email, passwordHash, role: data.role });
    const token = signToken({ id: created.id, email: created.email, role: created.role });
    res.status(201).json({ token, user: { id: created.id, email: created.email, role: created.role } });
  } catch (e) {
    next(e);
  }
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const data = parse(loginSchema, req.body);
    const user = await getUserByEmail(data.email);
    const match = await bcrypt.compare(data.password, user.passwordHash);
    if (!match) {
      return next(new AppError(401, "UNAUTHORIZED", "Invalid credentials"));
    }
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (e) {
    next(e);
  }
});

router.get("/auth/me", authJwt, (req, res) => {
  res.json({ user: req.user });
});

module.exports = { authRouter: router };
