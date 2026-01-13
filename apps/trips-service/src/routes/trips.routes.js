const express = require("express");
const { z } = require("zod");
const { Trip } = require("../models/trip.model");
const { AppError } = require("../utils/errors");
const { internalOnly } = require("../middlewares/internalOnly");

const router = express.Router();

const listQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10)
});

const createTripSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  dateTime: z.string().datetime(),
  totalSeats: z.number().int().min(1)
});

const updateTripSchema = z
  .object({
    from: z.string().min(1).optional(),
    to: z.string().min(1).optional(),
    dateTime: z.string().datetime().optional(),
    totalSeats: z.number().int().min(1).optional()
  })
  .refine((v) => Object.keys(v).length > 0, { message: "No fields provided" });

const seatsSchema = z.object({
  seats: z.coerce.number().int().min(1)
});

function parse(schema, payload) {
  const res = schema.safeParse(payload);
  if (!res.success) {
    throw new AppError(400, "VALIDATION_ERROR", "Invalid request", res.error.issues);
  }
  return res.data;
}

function mapTrip(doc) {
  return {
    id: doc._id?.toString() || doc.id,
    from: doc.from,
    to: doc.to,
    dateTime: doc.dateTime,
    totalSeats: doc.totalSeats,
    availableSeats: doc.availableSeats,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

router.get("/health", (_req, res) => res.json({ ok: true }));

router.use(internalOnly);

router.get("/trips", async (req, res, next) => {
  try {
    const query = parse(listQuerySchema, req.query);
    const filter = {};
    if (query.from) filter.from = new RegExp(`^${query.from}$`, "i");
    if (query.to) filter.to = new RegExp(`^${query.to}$`, "i");
    if (query.date) {
      const start = new Date(`${query.date}T00:00:00.000Z`);
      const end = new Date(`${query.date}T23:59:59.999Z`);
      filter.dateTime = { $gte: start, $lte: end };
    }

    const skip = (query.page - 1) * query.pageSize;
    const [items, total] = await Promise.all([
      Trip.find(filter).sort({ dateTime: 1 }).skip(skip).limit(query.pageSize).lean(),
      Trip.countDocuments(filter)
    ]);

    res.json({
      items: items.map(mapTrip),
      page: query.page,
      pageSize: query.pageSize,
      total
    });
  } catch (e) {
    next(e);
  }
});

router.get("/trips/:id", async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).lean();
    if (!trip) return next(new AppError(404, "NOT_FOUND", "Trip not found"));
    res.json(mapTrip(trip));
  } catch (e) {
    next(e);
  }
});

router.post("/trips", async (req, res, next) => {
  try {
    const data = parse(createTripSchema, req.body);
    const trip = await Trip.create({
      from: data.from,
      to: data.to,
      dateTime: new Date(data.dateTime),
      totalSeats: data.totalSeats,
      availableSeats: data.totalSeats
    });
    res.status(201).json(mapTrip(trip));
  } catch (e) {
    next(e);
  }
});

router.put("/trips/:id", async (req, res, next) => {
  try {
    const data = parse(updateTripSchema, req.body);
    const trip = await Trip.findById(req.params.id);
    if (!trip) return next(new AppError(404, "NOT_FOUND", "Trip not found"));

    const reservedSeats = trip.totalSeats - trip.availableSeats;
    if (data.totalSeats !== undefined) {
      if (data.totalSeats < reservedSeats) {
        return next(new AppError(409, "CONFLICT", "Cannot reduce seats below reserved"));
      }
      trip.totalSeats = data.totalSeats;
      trip.availableSeats = data.totalSeats - reservedSeats;
    }

    if (data.from !== undefined) trip.from = data.from;
    if (data.to !== undefined) trip.to = data.to;
    if (data.dateTime !== undefined) trip.dateTime = new Date(data.dateTime);

    await trip.save();
    res.json(mapTrip(trip));
  } catch (e) {
    next(e);
  }
});

router.post("/internal/trips/:id/hold-seats", async (req, res, next) => {
  try {
    const data = parse(seatsSchema, req.body);
    const updated = await Trip.findOneAndUpdate(
      { _id: req.params.id, availableSeats: { $gte: data.seats } },
      { $inc: { availableSeats: -data.seats } },
      { new: true }
    );

    if (!updated) {
      const exists = await Trip.exists({ _id: req.params.id });
      if (!exists) return next(new AppError(404, "NOT_FOUND", "Trip not found"));
      return next(new AppError(409, "NO_SEATS", "Not enough seats"));
    }

    res.json({ ok: true, trip: { id: updated.id, availableSeats: updated.availableSeats } });
  } catch (e) {
    next(e);
  }
});

router.post("/internal/trips/:id/release-seats", async (req, res, next) => {
  try {
    const data = parse(seatsSchema, req.body);
    const trip = await Trip.findById(req.params.id);
    if (!trip) return next(new AppError(404, "NOT_FOUND", "Trip not found"));

    const newAvailable = Math.min(trip.totalSeats, trip.availableSeats + data.seats);
    trip.availableSeats = newAvailable;
    await trip.save();

    res.json({
      ok: true,
      trip: { id: trip.id, availableSeats: trip.availableSeats, totalSeats: trip.totalSeats }
    });
  } catch (e) {
    next(e);
  }
});

module.exports = { tripsRouter: router };
