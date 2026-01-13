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

function mapAxiosError(e) {
  if (e.response) {
    const status = e.response.status || 500;
    const bodyErr = e.response.data?.error;
    if (bodyErr) {
      return new AppError(status, bodyErr.code || "INTERNAL_ERROR", bodyErr.message || "Error", bodyErr.details);
    }
    return new AppError(status, "INTERNAL_ERROR", "Service error", e.response.data);
  }
  if (e.code === "ECONNABORTED") {
    return new AppError(503, "SERVICE_UNAVAILABLE", "Service timeout");
  }
  if (e.request) {
    return new AppError(503, "SERVICE_UNAVAILABLE", "Service unavailable");
  }
  return new AppError(500, "INTERNAL_ERROR", e.message || "Server error");
}

module.exports = { AppError, toErrorPayload, mapAxiosError };
