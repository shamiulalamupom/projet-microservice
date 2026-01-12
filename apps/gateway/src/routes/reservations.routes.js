const express = require("express");
const { z } = require("zod");
const { parse } = require("../utils/validate");
const { authJwt } = require("../middlewares/authJwt");
const { AppError } = require("../utils/errors");
const { createReservation, listReservationsByUser, cancelReservation } = require("../clients/reservations.client");
const { holdSeats, releaseSeats } = require("../clients/trips.client");

const router = express.Router();

const createSchema = z.object({
  tripId: z.string().min(1),
  seats: z.number().int().min(1)
});

router.use(authJwt);

router.post("/reservations", async (req, res, next) => {
  let holdDone = false;
  const releaseCtx = {};
  try {
    const data = parse(createSchema, req.body);
    await holdSeats(data.tripId, data.seats);
    holdDone = true;
    releaseCtx.tripId = data.tripId;
    releaseCtx.seats = data.seats;

    const reservation = await createReservation({
      userId: req.user.id,
      tripId: data.tripId,
      seats: data.seats,
      status: "confirmed"
    });

    res.status(201).json(reservation);
  } catch (e) {
    if (holdDone && releaseCtx.tripId) {
      releaseSeats(releaseCtx.tripId, releaseCtx.seats).catch((err) => {
        console.error("[gateway] compensation release failed", err);
      });
    }
    next(e);
  }
});

router.get("/reservations/me", async (req, res, next) => {
  try {
    const data = await listReservationsByUser(req.user.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post("/reservations/:id/cancel", async (req, res, next) => {
  try {
    if (req.user.role !== "manager") {
      const mine = await listReservationsByUser(req.user.id);
      const found = mine.items?.find((r) => r.id === req.params.id);
      if (!found) return next(new AppError(404, "NOT_FOUND", "Reservation not found"));
    }

    const canceled = await cancelReservation(req.params.id);
    await releaseSeats(canceled.tripId, canceled.seats);
    res.json(canceled);
  } catch (e) {
    next(e);
  }
});

module.exports = { reservationsRouter: router };
