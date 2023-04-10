const express = require("express");
const cors = require("cors");
require("dotenv").config();

if (process.env.NODE_ENV === "test") {
  process.env.MYSQL_DATABASE = "test"; // Use a separate test database for unit tests and integration tests
  process.env.JWT_SECRET = "secret"; // for automated tests only. Some tests are hardcoded to use this secret, so don't change it.
}

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
