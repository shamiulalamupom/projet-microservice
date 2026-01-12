class AppError extends Error {
  constructor(status, code, message, details = undefined) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function toErrorPayload(err) {
  const status = err.status || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.message || "Server error";
  const details = err.details;
  return { status, body: { error: { code, message, details } } };
}

module.exports = { AppError, toErrorPayload };
