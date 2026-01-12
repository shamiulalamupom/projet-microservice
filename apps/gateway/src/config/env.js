const { z } = require("zod");

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().min(1),
  INTERNAL_TOKEN: z.string().min(1),
  USERS_SERVICE_URL: z.url(),
  TRIPS_SERVICE_URL: z.url(),
  RESERVATIONS_SERVICE_URL: z.url(),
  HTTP_TIMEOUT_MS: z.coerce.number().int().positive().default(5000)
});

const env = schema.parse(process.env);

module.exports = { env };
