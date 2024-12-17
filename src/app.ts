// src/app.ts
import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { clerkMiddleware } from "@clerk/express"
import { errorHandler } from "./middleware/error"
import { logger, requestLogger } from "./config/logger"

// Route imports
import authRoutes from "./routes/auth.routes"
import driverRoutes from "./routes/driver.routes"
import locationRoutes from "./routes/location.routes"
import rideRoutes from "./routes/ride.routes"
import notificationRoutes from "./routes/notification.routes"
import riderRoutes from "./routes/rider.routes"
import { devAuthMiddleware } from "./middleware/dev-auth"

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
)

// Add request logging middleware early in the middleware chain
app.use(requestLogger)

// Add error handler as the last middleware
app.use(errorHandler)

if (
  process.env.NODE_ENV === "development" &&
  process.env.BYPASS_AUTH === "true"
) {
  app.use(devAuthMiddleware)
} else {
  // Clerk Authentication Middleware
  app.use(clerkMiddleware())
}

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/rider", riderRoutes)
app.use("/api/drivers", driverRoutes)
app.use("/api/locations", locationRoutes)
app.use("/api/rides", rideRoutes)
app.use("/api/notifications", notificationRoutes)

// Error handling
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`)
})

export default app
