const { createServiceClient } = require("./httpClient");
const { env } = require("../config/env");

const client = createServiceClient(env.USERS_SERVICE_URL, env.INTERNAL_TOKEN, env.HTTP_TIMEOUT_MS);

async function createUser({ email, passwordHash, role }) {
  const res = await client.post("/users", { email, passwordHash, role });
  return res.data;
}

async function getUserByEmail(email) {
  const res = await client.get("/internal/users/by-email", { params: { email } });
  return res.data;
}

module.exports = { createUser, getUserByEmail };
