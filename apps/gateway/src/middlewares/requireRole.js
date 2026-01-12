const { AppError } = require("../utils/errors");

function requireRole(role) {
  return (req, _res, next) => {
    if (!req.user || req.user.role !== role) {
      return next(new AppError(403, "FORBIDDEN", "Insufficient role"));
    }
    next();
  };
}

module.exports = { requireRole };
