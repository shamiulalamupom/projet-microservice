const express = require("express");
const { z } = require("zod");
const { Reservation } = require("../models/reservation.model");
const { AppError } = require("../utils/errors");
const { internalOnly } = require("../middlewares/internalOnly");

const router = express.Router();

const createReservationSchema = z.object({
  userId: z.string().min(1),
  tripId: z.string().min(1),
  seats: z.number().int().min(1),
  status: z.enum(["pending", "confirmed", "canceled", "expired"])
});

const listQuerySchema = z
  .object({
    userId: z.string().optional(),
    tripId: z.string().optional()
  })
  .refine((v) => v.userId || v.tripId, { message: "userId or tripId is required" });

function parse(schema, payload) {
  const res = schema.safeParse(payload);
  if (!res.success) {
    throw new AppError(400, "VALIDATION_ERROR", "Invalid request", res.error.issues);
  }
  return res.data;
}

function mapReservation(doc) {
  return {
    id: doc._id?.toString() || doc.id,
    userId: doc.userId,
    tripId: doc.tripId,
    seats: doc.seats,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

router.get("/health", (_req, res) => res.json({ ok: true }));

router.use(internalOnly);

router.post("/reservations", async (req, res, next) => {
  try {
    const data = parse(createReservationSchema, req.body);
    const created = await Reservation.create(data);
    res.status(201).json(mapReservation(created));
  } catch (e) {
    next(e);
  }
});

router.get("/reservations", async (req, res, next) => {
  try {
    const query = parse(listQuerySchema, req.query);
    const filter = {};
    if (query.userId) filter.userId = query.userId;
    if (query.tripId) filter.tripId = query.tripId;

    const items = await Reservation.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ items: items.map(mapReservation) });
  } catch (e) {
    next(e);
  }
});

router.post("/reservations/:id/cancel", async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return next(new AppError(404, "NOT_FOUND", "Reservation not found"));

    if (reservation.status !== "canceled") {
      reservation.status = "canceled";
      await reservation.save();
    }

    res.json(mapReservation(reservation));
  } catch (e) {
    next(e);
  }
});

module.exports = { reservationsRouter: router };
