const { AppError } = require("./errors");

function parse(schema, payload) {
  const res = schema.safeParse(payload);
  if (!res.success) {
    throw new AppError(400, "VALIDATION_ERROR", "Invalid request", res.error.issues);
  }
  return res.data;
}

module.exports = { parse };
