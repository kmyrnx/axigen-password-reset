const winston = require('winston');

const logFormat = winston.format.printf(
  (info) => `${
    new Date()
      .toLocaleString({ timeZone: process.env.TZ })
  } - ${info.level}: ${JSON.stringify(info.message, null, 4)}\n`,
);

module.exports = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
  ],
});
