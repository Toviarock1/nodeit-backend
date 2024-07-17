const winston = require("winston");

module.exports = function (err, req, res, next) {
  const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "user-service" },
    transports: [
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "combined.log" }),
    ],
  });

  logger.log({
    level: "info",
    message: err.message,
    err,
  });

  res.status(500).json({ message: "Something failed", error: true, data: {} });
};
