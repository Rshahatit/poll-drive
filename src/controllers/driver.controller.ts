// src/controllers/driver.controller.ts
import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"
import { getAuth } from "@clerk/express"

const prisma = new PrismaClient()

// Validation schemas
const driverDetailsSchema = z.object({
  carModel: z.string().min(2),
  licensePlate: z.string().min(2),
  insuranceNumber: z.string().min(2),
  totalSeats: z.number().min(1).max(8),
})

const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  availableSeats: z.number().min(0),
})

const availabilitySchema = z.object({
  available: z.boolean(),
  availableSeats: z.number().min(0).optional(),
  pickupLocation: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    address: z.string(),
  }).optional(),
})

export class DriverController {
  static async uploadVerificationDocs(req: Request, res: Response): Promise<void> {
    try {
      const auth = getAuth(req)
      const clerkId = auth.userId ?? ""

      if (!clerkId) {
        res.status(401).json({
          error: "Unauthorized",
        })
        return
      }

      // In a real application, you'd handle file uploads here
      // This is a placeholder for where you'd process files
      const idImageUrl = "placeholder_id_url"
      const driverLicenseUrl = "placeholder_license_url"

      const user = await prisma.user.findUnique({
        where: { clerkId },
        include: { driverDetails: true },
      })

      if (!user || user.type !== "DRIVER") {
        res.status(403).json({
          error: "User is not a driver",
        })
        return
      }

      if (!user.driverDetails) {
        res.status(404).json({
          error: "Driver details not found",
        })
        return
      }

      // Create or update driver verification
      const verification = await prisma.driverVerification.upsert({
        where: {
          driverDetailsId: user.driverDetails.id,
        },
        update: {
          status: "PENDING",
          idImageUrl,
          driverLicenseUrl,
        },
        create: {
          driverDetailsId: user.driverDetails.id,
          status: "PENDING",
          idImageUrl,
          driverLicenseUrl,
        },
      })

      res.status(200).json({
        message: "Documents uploaded successfully",
        verification,
      })
    } catch (error) {
      console.error("Document upload error:", error)
      res.status(500).json({
        error: "Error uploading verification documents",
      })
    }
  }

  static async getVerificationStatus(req: Request, res: Response): Promise<void> {
    try {
      const auth = getAuth(req)
      const clerkId = auth.userId ?? ""

      if (!clerkId) {
        res.status(401).json({
          error: "Unauthorized",
        })
        return
      }

      const user = await prisma.user.findUnique({
        where: { clerkId },
        include: {
          driverDetails: {
            include: {
              verification: true,
            },
          },
        },
      })

      if (!user || user.type !== "DRIVER") {
        res.status(403).json({
          error: "User is not a driver",
        })
        return
      }

      if (!user.driverDetails?.verification) {
        res.status(404).json({
          error: "No verification record found",
        })
        return
      }

      res.json({
        verificationStatus: user.driverDetails.verification.status,
        verifiedAt: user.driverDetails.verifiedAt,
      })
    } catch (error) {
      console.error("Get verification status error:", error)
      res.status(500).json({
        error: "Error fetching verification status",
      })
    }
  }

  static async updateDriverDetails(req: Request, res: Response): Promise<void> {
    try {
      const validation = driverDetailsSchema.safeParse(req.body)

      if (!validation.success) {
        res.status(400).json({
          error: "Invalid input",
          details: validation.error.errors,
        })
        return
      }

      const auth = getAuth(req)
      const clerkId = auth.userId ?? ""

      if (!clerkId) {
        res.status(401).json({
          error: "Unauthorized",
        })
        return
      }

      const user = await prisma.user.findUnique({
        where: { clerkId },
        include: { driverDetails: true },
      })

      if (!user || user.type !== "DRIVER") {
        res.status(403).json({
          error: "User is not a driver",
        })
        return
      }

      const updatedDetails = await prisma.driverDetails.update({
        where: { userId: user.id },
        data: validation.data,
      })

      res.json({
        message: "Driver details updated successfully",
        details: updatedDetails,
      })
    } catch (error) {
      console.error("Update driver details error:", error)
      res.status(500).json({
        error: "Error updating driver details",
      })
    }
  }

  static async updateLocation(req: Request, res: Response): Promise<void> {
    try {
      const validation = locationSchema.safeParse(req.body)

      if (!validation.success) {
        res.status(400).json({
          error: "Invalid input",
          details: validation.error.errors,
        })
        return
      }

      const auth = getAuth(req)
      const clerkId = auth.userId ?? ""

      if (!clerkId) {
        res.status(401).json({
          error: "Unauthorized",
        })
        return
      }

      const { lat, lng, availableSeats } = validation.data

      const user = await prisma.user.findUnique({
        where: { clerkId },
        include: { driverDetails: true },
      })

      if (!user || user.type !== "DRIVER") {
        res.status(403).json({
          error: "User is not a driver",
        })
        return
      }

      const updatedLocation = await prisma.driverDetails.update({
        where: { userId: user.id },
        data: {
          currentLat: lat,
          currentLng: lng,
          availableSeats,
        },
      })

      res.json({
        message: "Location updated successfully",
        location: {
          lat: updatedLocation.currentLat,
          lng: updatedLocation.currentLng,
          availableSeats: updatedLocation.availableSeats,
        },
      })
    } catch (error) {
      console.error("Update location error:", error)
      res.status(500).json({
        error: "Error updating location",
      })
    }
  }

  static async updateAvailability(req: Request, res: Response): Promise<void> {
    try {
      const validation = availabilitySchema.safeParse(req.body)

      if (!validation.success) {
        res.status(400).json({
          error: "Invalid input",
          details: validation.error.errors,
        })
        return
      }

      const auth = getAuth(req)
      const clerkId = auth.userId ?? ""

      if (!clerkId) {
        res.status(401).json({
          error: "Unauthorized",
        })
        return
      }

      const { available, availableSeats, pickupLocation } = validation.data

      const user = await prisma.user.findUnique({
        where: { clerkId },
        include: { driverDetails: true },
      })

      if (!user || user.type !== "DRIVER") {
        res.status(403).json({
          error: "User is not a driver",
        })
        return
      }

      const updatedAvailability = await prisma.driverDetails.update({
        where: { userId: user.id },
        data: {
          available,
          availableSeats,
          ...(pickupLocation && {
            currentLat: pickupLocation.lat,
            currentLng: pickupLocation.lng,
          }),
        },
      })

      res.json({
        message: "Availability updated successfully",
        availability: {
          available: updatedAvailability.available,
          availableSeats: updatedAvailability.availableSeats,
          currentLocation: pickupLocation ? {
            lat: updatedAvailability.currentLat,
            lng: updatedAvailability.currentLng,
          } : null,
        },
      })
    } catch (error) {
      console.error("Update availability error:", error)
      res.status(500).json({
        error: "Error updating availability",
      })
    }
  }
}