const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/errors");
const { env } = require("../config/env");

function authJwt(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError(401, "UNAUTHORIZED", "Missing Authorization header"));
  }
  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch (_e) {
    return next(new AppError(401, "UNAUTHORIZED", "Invalid token"));
  }
}

module.exports = { authJwt };
