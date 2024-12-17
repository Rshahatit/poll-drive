import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"
import { getAuth } from "@clerk/express"

const prisma = new PrismaClient()

const updateRiderProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  emergencyContact: z.string().optional(),
})

const rideHistoryQuerySchema = z.object({
  status: z
    .enum(["SCHEDULED", "PICKED_UP", "COMPLETED", "CANCELLED", "NO_SHOW"])
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
  offset: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
})

const rateDriverSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export class RiderController {
  static async getRiderProfile(req: Request, res: Response): Promise<void> {
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
          preferences: true,
        },
      })

      if (!user) {
        res.status(404).json({
          error: "User not found",
        })
        return
      }

      if (user.type !== "RIDER") {
        res.status(403).json({
          error: "Access denied. Riders only.",
        })
        return
      }

      res.json({
        message: "Rider profile retrieved successfully",
        profile: user,
      })
    } catch (error) {
      console.error("Get rider profile error:", error)
      res.status(500).json({
        error: "Error fetching rider profile",
      })
    }
  }

  static async updateRiderProfile(req: Request, res: Response): Promise<void> {
    try {
      const validation = updateRiderProfileSchema.safeParse(req.body)

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
      })

      if (!user) {
        res.status(404).json({
          error: "User not found",
        })
        return
      }

      if (user.type !== "RIDER") {
        res.status(403).json({
          error: "Access denied. Riders only.",
        })
        return
      }

      const updatedProfile = await prisma.user.update({
        where: { clerkId },
        data: validation.data,
        include: {
          preferences: true,
        },
      })

      res.json({
        message: "Profile updated successfully",
        profile: updatedProfile,
      })
    } catch (error) {
      console.error("Update rider profile error:", error)
      res.status(500).json({
        error: "Error updating rider profile",
      })
    }
  }

  static async getRideHistory(req: Request, res: Response): Promise<void> {
    try {
      const validation = rideHistoryQuerySchema.safeParse(req.query)

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
      })

      if (!user) {
        res.status(404).json({
          error: "User not found",
        })
        return
      }

      if (user.type !== "RIDER") {
        res.status(403).json({
          error: "Access denied. Riders only.",
        })
        return
      }

      const { status, limit = 10, offset = 0 } = validation.data

      const rides = await prisma.ride.findMany({
        where: {
          riderId: user.id,
          ...(status && { status }),
        },
        include: {
          driver: {
            select: {
              id: true,
              name: true,
              phone: true,
              driverDetails: {
                select: {
                  carModel: true,
                  licensePlate: true,
                },
              },
            },
          },
        },
        orderBy: {
          pickupTime: "desc",
        },
        take: limit,
        skip: offset,
      })

      const total = await prisma.ride.count({
        where: {
          riderId: user.id,
          ...(status && { status }),
        },
      })

      res.json({
        message: "Ride history retrieved successfully",
        rides,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + rides.length < total,
        },
      })
    } catch (error) {
      console.error("Get ride history error:", error)
      res.status(500).json({
        error: "Error fetching ride history",
      })
    }
  }

  static async getRideStats(req: Request, res: Response): Promise<void> {
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
      })

      if (!user) {
        res.status(404).json({
          error: "User not found",
        })
        return
      }

      if (user.type !== "RIDER") {
        res.status(403).json({
          error: "Access denied. Riders only.",
        })
        return
      }

      const stats = await prisma.ride.groupBy({
        by: ["status"],
        where: {
          riderId: user.id,
        },
        _count: {
          status: true,
        },
      })

      const totalTips = await prisma.ride.aggregate({
        where: {
          riderId: user.id,
          status: "COMPLETED",
        },
        _sum: {
          tipAmount: true,
        },
      })

      res.json({
        message: "Ride statistics retrieved successfully",
        stats: {
          ridesByStatus: stats,
          totalTipsGiven: totalTips._sum.tipAmount || 0,
        },
      })
    } catch (error) {
      console.error("Get ride stats error:", error)
      res.status(500).json({
        error: "Error fetching ride statistics",
      })
    }
  }

  static async rateDriver(req: Request, res: Response): Promise<void> {
    try {
      const validation = rateDriverSchema.safeParse(req.body)

      if (!validation.success) {
        res.status(400).json({
          error: "Invalid input",
          details: validation.error.errors,
        })
        return
      }

      const auth = getAuth(req)
      const clerkId = auth.userId ?? ""
      const { rideId } = req.params

      if (!clerkId) {
        res.status(401).json({
          error: "Unauthorized",
        })
        return
      }

      const user = await prisma.user.findUnique({
        where: { clerkId },
      })

      if (!user) {
        res.status(404).json({
          error: "User not found",
        })
        return
      }

      if (user.type !== "RIDER") {
        res.status(403).json({
          error: "Access denied. Riders only.",
        })
        return
      }

      const ride = await prisma.ride.findUnique({
        where: { id: rideId },
      })

      if (!ride) {
        res.status(404).json({
          error: "Ride not found",
        })
        return
      }

      if (ride.riderId !== user.id) {
        res.status(403).json({
          error: "Not authorized to rate this ride",
        })
        return
      }

      if (ride.status !== "COMPLETED") {
        res.status(400).json({
          error: "Can only rate completed rides",
        })
        return
      }

      const { rating, comment } = validation.data

      // Create rating in a transaction
      await prisma.$transaction(async (tx) => {
        // Update the ride with rating information
        await tx.ride.update({
          where: { id: rideId },
          data: {
            driverRating: rating,
            driverRatingComment: comment,
          },
        })

        // Update driver's average rating
        const driverRides = await tx.ride.findMany({
          where: {
            driverId: ride.driverId,
            driverRating: { not: null },
          },
          select: {
            driverRating: true,
          },
        })

        const averageRating =
          driverRides.reduce((acc, curr) => acc + (curr.driverRating || 0), 0) /
          driverRides.length

        await tx.driverDetails.update({
          where: { userId: ride.driverId },
          data: {
            averageRating: averageRating,
          },
        })
      })

      res.json({
        message: "Driver rated successfully",
      })
    } catch (error) {
      console.error("Rate driver error:", error)
      res.status(500).json({
        error: "Error rating driver",
      })
    }
  }
}
