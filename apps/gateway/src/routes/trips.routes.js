const express = require("express");
const { z } = require("zod");
const { parse } = require("../utils/validate");
const { listTrips, getTrip } = require("../clients/trips.client");

const router = express.Router();

const listSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  date: z.string().optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional()
});

router.get("/trips", async (req, res, next) => {
  try {
    const query = parse(listSchema, req.query);
    const data = await listTrips(query);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/trips/:id", async (req, res, next) => {
  try {
    const data = await getTrip(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

module.exports = { tripsRouter: router };
