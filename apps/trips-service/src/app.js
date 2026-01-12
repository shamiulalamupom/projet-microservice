const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { toErrorPayload } = require("./utils/errors");
const { tripsRouter } = require("./routes/trips.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(tripsRouter);

// service-level error handler
app.use((err, _req, res, _next) => {
  const { status, body } = toErrorPayload(err);
  res.status(status).json(body);
});

module.exports = app;
