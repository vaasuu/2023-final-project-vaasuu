const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ],
  })
);

app.get("/", (req, res) => {
  res.send("ok");
});

module.exports = app;
