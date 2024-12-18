// src/middleware/test-auth.ts
import { Request, Response, NextFunction } from "express"

// Extend the Request interface to include the auth property
declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      userId: string
    }
  }
}

// Test users for development
export const TEST_USERS = {
  RIDER: {
    userId: "test_rider_123",
    email: "rider@test.com",
    type: "RIDER",
  },
  DRIVER: {
    userId: "test_driver_123",
    email: "driver@test.com",
    type: "DRIVER",
  },
}

// Simple middleware to inject test auth
export const testAuthMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    req.auth = { userId: TEST_USERS.RIDER.userId }
  } else if (authHeader.includes("driver")) {
    req.auth = { userId: TEST_USERS.DRIVER.userId }
  } else {
    req.auth = { userId: TEST_USERS.RIDER.userId }
  }

  next()
}
