// src/middleware/error.ts
import { ErrorRequestHandler } from "express"

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
): void => {
  console.error("Error:", err)

  res.status(500).json({
    error: err.message || "Internal server error",
  })
}
