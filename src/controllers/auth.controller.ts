// src/controllers/auth.controller.ts
import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"
import { TEST_USERS } from "../middleware/test-auth"

const prisma = new PrismaClient()

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["DRIVER", "RIDER"]),
  phone: z.string().optional(),
  email: z.string().email(),
})

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  emergencyContact: z.string().optional(),
})

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const validation = registerSchema.safeParse(req.body)

      if (!validation.success) {
        res.status(400).json({
          error: "Invalid input",
          details: validation.error.errors,
        })
        return
      }

      const { name, type, phone, email } = validation.data
      const clerkId = TEST_USERS.RIDER.userId

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { clerkId },
      })

      if (existingUser) {
        res.status(400).json({
          error: "User already registered",
        })
        return
      }

      // Create new user in our database
      const user = await prisma.user.create({
        data: {
          clerkId,
          name,
          type,
          phone,
          email,
          preferences: {
            create: {
              emailEnabled: true,
              pushEnabled: true,
              smsEnabled: true,
            },
          },
        },
        include: {
          preferences: true,
        },
      })

      // If user is a driver, create driver details
      if (type === "DRIVER") {
        await prisma.driverDetails.create({
          data: {
            userId: user.id,
            available: false,
          },
        })
      }

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          type: user.type,
          phone: user.phone,
          email: user.email,
        },
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({
        error: "Error registering user",
      })
    }
  }

  static async getProfile(_req: Request, res: Response): Promise<void> {
    try {
      const clerkId = TEST_USERS.RIDER.userId

      const user = await prisma.user.findUnique({
        where: { clerkId },
        include: {
          preferences: true,
          driverDetails: true,
        },
      })

      if (!user) {
        res.status(404).json({
          error: "User not found",
        })
        return
      }

      res.json({ user })
    } catch (error) {
      console.error("Get profile error:", error)
      res.status(500).json({
        error: "Error fetching user profile",
      })
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const validation = updateProfileSchema.safeParse(req.body)

      if (!validation.success) {
        res.status(400).json({
          error: "Invalid input",
          details: validation.error.errors,
        })
        return
      }

      const clerkId = TEST_USERS.RIDER.userId
      const { name, phone, emergencyContact } = validation.data

      const updatedUser = await prisma.user.update({
        where: { clerkId },
        data: {
          name,
          phone,
          emergencyContact,
        },
        include: {
          preferences: true,
          driverDetails: true,
        },
      })

      res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      })
    } catch (error) {
      console.error("Update profile error:", error)
      res.status(500).json({
        error: "Error updating user profile",
      })
    }
  }
}
