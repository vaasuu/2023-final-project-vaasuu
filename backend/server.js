const app = require("./app");

require("dotenv").config(); // loads .env file into process.env

// Environment variables that are required for the app to run
const requiredEnvVars = [
  "JWT_SECRET",
  "MYSQL_HOST",
  "MYSQL_USERNAME",
  "MYSQL_PASSWORD",
  "MYSQL_DATABASE",
  "MYSQL_PORT",
];

// Check that all required environment variables are set
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is required`);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
