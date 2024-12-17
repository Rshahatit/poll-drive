// src/middleware/dev-auth.ts
import { Request, Response, NextFunction } from "express"

// Mock user for development
const DEV_USER = {
  userId: "dev_user_123",
  email: "dev@test.com",
}

export const devAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Inject mock auth data into the request
  req.auth = {
    userId: DEV_USER.userId,
    sessionId: "dev_session_123",
    claims: {
      email: DEV_USER.email,
    },
  }
  next()
}
