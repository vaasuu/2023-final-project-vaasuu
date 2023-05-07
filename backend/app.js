const express = require("express");
const cors = require("cors");

if (process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: ".env.test" });
} else if (process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: ".env.production" });
} else {
  require("dotenv").config({ path: ".env" });
}

const users = require("./routes/users");
const roles = require("./routes/roles");
const passwordReset = require("./routes/password-reset");
const listings = require("./routes/listings");

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
app.use("/api/v1/password-reset", passwordReset);
app.use("/api/v1/listings", listings);

app.get("/health", (req, res) => {
  res.send("ok");
});

module.exports = app;
