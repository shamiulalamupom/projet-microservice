require("dotenv").config();

const { connectMongo } = require("./db/mongo");
const app = require("./app");

const port = process.env.PORT || 3003;

(async () => {
  await connectMongo();
  app.listen(port, () => console.log(`[reservations] listening on ${port}`));
})();
