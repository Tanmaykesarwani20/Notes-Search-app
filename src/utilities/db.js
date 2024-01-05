const mongoose = require("mongoose");
const url = process.env.MONGO_URL;

// Connect to MongoDB using createConnection method
const db = mongoose.createConnection(url);

// Check for connection errors
db.on("error", console.error.bind(console, "connection error:"));

// Once connected, log a success message
db.once("open", async function () {
  console.log("Connected to Search app database");
});

module.exports = db;
