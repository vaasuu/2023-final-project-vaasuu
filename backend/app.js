const express = require("express");
const cors = require("cors");
require("dotenv").config();

const users = require("./routes/users");
const roles = require("./routes/roles");

const app = express();

// for parsing application/json
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ],
  })
);

// take API routes into use
app.use("/api/v1/users", users);
app.use("/api/v1/roles", roles);

app.get("/health", (req, res) => {
  res.send("ok");
});

module.exports = app;
