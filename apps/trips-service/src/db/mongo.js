const mongoose = require("mongoose");

async function connectMongo() {
  const url = process.env.MONGO_URL;
  if (!url) throw new Error("MONGO_URL is missing");
  await mongoose.connect(url);
  console.log("[trips] mongo connected");
}

module.exports = { connectMongo };
