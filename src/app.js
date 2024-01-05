require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/index");
require("./utilities/db");

const port = process.env.API_PORT || 8085;
const ip_adress = process.env.API_IP || "0.0.0.0";

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api", router);

app.listen(port, ip_adress, () => {
  console.log(`Notes App listening on the port ${port}`);
});

module.exports = app;
