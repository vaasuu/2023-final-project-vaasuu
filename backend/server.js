const app = require("./app");
const logger = require("./utils/log");

require("dotenv").config(); // loads .env file into process.env

// Environment variables that are required for the app to run
const requiredEnvVars = [
  "MYSQL_HOST",
  "MYSQL_USERNAME",
  "MYSQL_PASSWORD",
  "MYSQL_DATABASE",
  "MYSQL_PORT",
  "JWT_SECRET",
  "JWT_PASSWORD_RESET_SECRET",
  "FRONTEND_URL",
  "EMAIL_SMTP_HOST",
  "EMAIL_SMTP_PORT",
  "EMAIL_SMTP_SECURE",
  "EMAIL_SMTP_USERNAME",
  "EMAIL_SMTP_PASSWORD",
  "EMAIL_FROM_NAME",
  "EMAIL_FROM_ADDRESS",
];

// Check that all required environment variables are set
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is required`);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
