const winston = require('winston')
const path = require('path')

const logDir = process.env.LOG_DIR ?? path.join(__dirname, '..', 'logs')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: winston.format.json(),
  defaultMeta: { application: 'app' },
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'app.log') }),
    new winston.transports.Console({ format: winston.format.simple() })
  ],
})

module.exports = logger