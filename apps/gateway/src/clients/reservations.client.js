const { createServiceClient } = require("./httpClient");
const { env } = require("../config/env");

const client = createServiceClient(env.RESERVATIONS_SERVICE_URL, env.INTERNAL_TOKEN, env.HTTP_TIMEOUT_MS);

async function createReservation(body) {
  const res = await client.post("/reservations", body);
  return res.data;
}

async function listReservationsByUser(userId) {
  const res = await client.get("/reservations", { params: { userId } });
  return res.data;
}

async function listReservationsByTrip(tripId) {
  const res = await client.get("/reservations", { params: { tripId } });
  return res.data;
}

async function cancelReservation(id) {
  const res = await client.post(`/reservations/${id}/cancel`);
  return res.data;
}

module.exports = { createReservation, listReservationsByUser, listReservationsByTrip, cancelReservation };
