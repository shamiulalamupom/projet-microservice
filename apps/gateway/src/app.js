const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { authRouter } = require("./routes/auth.routes");
const { tripsRouter } = require("./routes/trips.routes");
const { reservationsRouter } = require("./routes/reservations.routes");
const { managerRouter } = require("./routes/manager.routes");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(authRouter);
app.use(tripsRouter);
app.use(reservationsRouter);
app.use(managerRouter);

app.use(errorHandler);

module.exports = app;
