const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { toErrorPayload } = require("./utils/errors");
const { usersRouter } = require("./routes/users.routes");
const { internalRouter } = require("./routes/internal.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(usersRouter);
app.use(internalRouter);

// error handler (service-side; gateway will normalize later)
app.use((err, _req, res, _next) => {
  const { status, body } = toErrorPayload(err);
  res.status(status).json(body);
});

module.exports = app;
