const { AppError } = require("../utils/errors");

function internalOnly(req, _res, next) {
  const token = req.header("X-Internal-Token");
  if (!token || token !== process.env.INTERNAL_TOKEN) {
    return next(new AppError(403, "FORBIDDEN", "Internal only"));
  }
  next();
}

module.exports = { internalOnly };
