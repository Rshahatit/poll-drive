// src/middleware/error.ts
import { Request, Response, NextFunction } from "express"
import { logger } from "../config/logger"
import { ZodError } from "zod"
import { Prisma } from "@prisma/client"

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message)
    this.name = "APIError"
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error("Error:", {
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
    request: {
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
      query: req.query,
    },
  })

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation error",
      details: err.errors,
    })
    return
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": // Unique constraint violation
        res.status(409).json({
          error: "Resource already exists",
          details: err.meta,
        })
        return
      case "P2025": // Record not found
        res.status(404).json({
          error: "Resource not found",
          details: err.meta,
        })
        return
      default:
        res.status(500).json({
          error: "Database error",
          details:
            process.env.NODE_ENV === "development" ? err.message : undefined,
        })
        return
    }
  }

  // Handle custom API errors
  if (err instanceof APIError) {
    res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    })
    return
  }

  // Handle all other errors
  res.status(500).json({
    error: "Internal server error",
    details:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  })
}
