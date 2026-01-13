const express = require("express");
const { z } = require("zod");
const { authJwt } = require("../middlewares/authJwt");
const { requireRole } = require("../middlewares/requireRole");
const { parse } = require("../utils/validate");
const { createTrip, updateTrip } = require("../clients/trips.client");
const { listReservationsByTrip } = require("../clients/reservations.client");

const router = express.Router();

const createTripSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  dateTime: z.string().datetime(),
  totalSeats: z.number().int().min(1)
});

const updateTripSchema = z.object({
  from: z.string().min(1).optional(),
  to: z.string().min(1).optional(),
  dateTime: z.string().datetime().optional(),
  totalSeats: z.number().int().min(1).optional()
});

router.use(authJwt);
router.use(requireRole("manager"));

router.post("/manager/trips", async (req, res, next) => {
  try {
    const data = parse(createTripSchema, req.body);
    const created = await createTrip(data);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

router.put("/manager/trips/:id", async (req, res, next) => {
  try {
    const data = parse(updateTripSchema, req.body);
    const updated = await updateTrip(req.params.id, data);
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

router.get("/manager/trips/:id/reservations", async (req, res, next) => {
  try {
    const data = await listReservationsByTrip(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

module.exports = { managerRouter: router };
