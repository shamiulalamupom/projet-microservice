const { toErrorPayload, AppError } = require("../utils/errors");
const { ZodError } = require("zod");

function errorHandler(err, _req, res, _next) {
  let normalized = err;
  if (err instanceof ZodError) {
    normalized = new AppError(400, "VALIDATION_ERROR", "Invalid request", err.issues);
  }
  const { status, body } = toErrorPayload(normalized);
  res.status(status).json(body);
}

module.exports = { errorHandler };
