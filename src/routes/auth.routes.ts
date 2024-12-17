// src/routes/auth.routes.ts
import express from "express"
import { AuthController } from "../controllers/auth.controller"
import { clerkMiddleware } from "@clerk/express"

const router = express.Router()

router.use(clerkMiddleware())

// Register endpoint - requires Clerk authentication
router.post("/register", AuthController.register)

// Get profile endpoint - requires both Clerk auth and our user data
router.get("/profile", AuthController.getProfile)

export default router
