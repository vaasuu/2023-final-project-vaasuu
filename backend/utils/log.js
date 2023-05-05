const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.errors({ stack: true })
  ),
  transports: [new winston.transports.File({ filename: "app.log" })],
});

if (!process.env.NODE_ENV?.match(/(production))/)) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.prettyPrint()),
    })
  );
}

module.exports = logger;
