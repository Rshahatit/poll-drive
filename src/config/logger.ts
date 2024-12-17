import winston from "winston"
import path from "path"

const logLevel = process.env.LOG_LEVEL || "info"
const environment = process.env.NODE_ENV || "development"

// Custom format for development logging
const developmentFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    return `${timestamp} ${level}: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
    }`
  })
)

// Custom format for production logging
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
)

// Create the logger instance
export const logger = winston.createLogger({
  level: logLevel,
  format: environment === "production" ? productionFormat : developmentFormat,
  transports: [
    // Console transport
    new winston.transports.Console(),

    // File transport for errors
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // File transport for all logs
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
})

// Add request logging middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now()

  res.on("finish", () => {
    const duration = Date.now() - start
    logger.info("Request processed", {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get("user-agent"),
      ip: req.ip,
    })
  })

  next()
}

// Development logging middleware
if (environment !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  )
}

// Handle uncaught exceptions and unhandled rejections
process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception:", error)
  process.exit(1)
})

process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Rejection:", reason)
})
