// const winston = require("winston");
// const { combine, timestamp, json,printf } = winston.format;

// const myFormat = printf(({ level, message, timestamp }) => {
//   return `[${timestamp}] [${level}] [${message}]`;
// });

// const logger = winston.createLogger({
//   level: process.env.LOG_LEVEL || 'info',
//   format: combine(
//       winston.format.colorize(),
//       timestamp({ format: "YYYY-MM-DDTHH:mm:ss.SSSZ" }), // ISO 8601 format
//       myFormat
//   ),
//   transports: [
//       new winston.transports.Console(),
//       new winston.transports.File({ filename: 'logs/server.log' })
//   ],
// });

// module.exports = logger;

const winston = require('winston');

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.simple()
);


const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/server.log' })
  ]
});

module.exports = logger;
