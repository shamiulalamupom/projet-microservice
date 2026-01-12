const { createServiceClient } = require("./httpClient");
const { env } = require("../config/env");

const client = createServiceClient(env.TRIPS_SERVICE_URL, env.INTERNAL_TOKEN, env.HTTP_TIMEOUT_MS);

async function listTrips(params) {
  const res = await client.get("/trips", { params });
  return res.data;
}

async function getTrip(id) {
  const res = await client.get(`/trips/${id}`);
  return res.data;
}

async function createTrip(body) {
  const res = await client.post("/trips", body);
  return res.data;
}

async function updateTrip(id, body) {
  const res = await client.put(`/trips/${id}`, body);
  return res.data;
}

async function holdSeats(tripId, seats) {
  const res = await client.post(`/internal/trips/${tripId}/hold-seats`, { seats });
  return res.data;
}

async function releaseSeats(tripId, seats) {
  const res = await client.post(`/internal/trips/${tripId}/release-seats`, { seats });
  return res.data;
}

module.exports = { listTrips, getTrip, createTrip, updateTrip, holdSeats, releaseSeats };
