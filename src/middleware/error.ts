// src/middleware/error.ts
import { Request, Response, NextFunction } from "express"
import { logger } from "../config/logger"
import { ZodError } from "zod"
import { Prisma } from "@prisma/client"

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
) => {
  // Remove `: void` return type
  try {
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
      return res.status(400).json({
        error: "Validation error",
        details: err.errors,
      })
    }

    // Handle Prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2002":
          return res.status(409).json({
            error: "Resource already exists",
            details: err.meta,
          })
        case "P2025":
          return res.status(404).json({
            error: "Resource not found",
            details: err.meta,
          })
        default:
          return res.status(500).json({
            error: "Database error",
            details:
              process.env.NODE_ENV === "development" ? err.message : undefined,
          })
      }
    }

    // Handle custom API errors
    if (err instanceof APIError) {
      return res.status(err.statusCode).json({
        error: err.message,
        details: err.details,
      })
    }

    // Handle all other errors
    return res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    })
  } catch (handlerError) {
    logger.error("Error in error handler:", handlerError)
    return res.status(500).json({
      error: "Internal server error",
    })
  }
}
