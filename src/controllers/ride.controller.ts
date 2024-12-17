import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"
import { getAuth } from "@clerk/express"

const prisma = new PrismaClient()

const bookRideSchema = z.object({
  pickupLocation: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    address: z.string(),
  }),
  pollingLocationId: z.string(),
  driverId: z.string(),
  pickupTime: z.string().transform((val) => new Date(val)),
  tipAmount: z.number().min(0),
})

const updateRideStatusSchema = z.object({
  status: z.enum(["PICKED_UP", "COMPLETED", "NO_SHOW"]),
})

const getRidesQuerySchema = z.object({
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

export class RideController {
  static async bookRide(req: Request, res: Response): Promise<void> {
    try {
      const validation = bookRideSchema.safeParse(req.body)

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
          error: "Only riders can book rides",
        })
        return
      }

      const {
        pickupLocation,
        pollingLocationId,
        driverId,
        pickupTime,
        tipAmount,
      } = validation.data

      // Verify driver exists and is available
      const driver = await prisma.user.findFirst({
        where: {
          id: driverId,
          type: "DRIVER",
          driverDetails: {
            available: true,
            availableSeats: { gt: 0 },
          },
        },
        include: {
          driverDetails: true,
        },
      })

      if (!driver || !driver.driverDetails) {
        res.status(400).json({
          error: "Driver not available",
        })
        return
      }

      // Create the ride
      const ride = await prisma.ride.create({
        data: {
          riderId: user.id,
          driverId: driver.id,
          status: "SCHEDULED",
          pickupLat: pickupLocation.lat,
          pickupLng: pickupLocation.lng,
          pickupAddress: pickupLocation.address,
          pollingLocationId,
          pickupTime,
          tipAmount,
        },
        include: {
          rider: {
            select: {
              name: true,
              phone: true,
            },
          },
          driver: {
            select: {
              name: true,
              phone: true,
            },
          },
        },
      })

      // Update driver's available seats
      await prisma.driverDetails.update({
        where: { userId: driver.id },
        data: {
          availableSeats: {
            decrement: 1,
          },
        },
      })

      res.status(201).json({
        message: "Ride booked successfully",
        ride,
      })
    } catch (error) {
      console.error("Book ride error:", error)
      res.status(500).json({
        error: "Error booking ride",
      })
    }
  }

  static async cancelRide(req: Request, res: Response): Promise<void> {
    try {
      const auth = getAuth(req)
      const clerkId = auth.userId ?? ""

      if (!clerkId) {
        res.status(401).json({
          error: "Unauthorized",
        })
        return
      }

      const { rideId } = req.params
      const { reason } = req.body

      const user = await prisma.user.findUnique({
        where: { clerkId },
      })

      if (!user) {
        res.status(404).json({
          error: "User not found",
        })
        return
      }

      // Get the ride
      const ride = await prisma.ride.findUnique({
        where: { id: rideId },
      })

      if (!ride) {
        res.status(404).json({
          error: "Ride not found",
        })
        return
      }

      // Verify user is either the rider or driver
      if (ride.riderId !== user.id && ride.driverId !== user.id) {
        res.status(403).json({
          error: "Not authorized to cancel this ride",
        })
        return
      }

      // Can only cancel scheduled rides
      if (ride.status !== "SCHEDULED") {
        res.status(400).json({
          error: "Can only cancel scheduled rides",
        })
        return
      }

      // Update the ride
      const updatedRide = await prisma.ride.update({
        where: { id: rideId },
        data: {
          status: "CANCELLED",
          cancellationReason: reason,
        },
        include: {
          rider: {
            select: {
              name: true,
              phone: true,
            },
          },
          driver: {
            select: {
              name: true,
              phone: true,
            },
          },
        },
      })

      // Increment driver's available seats
      await prisma.driverDetails.update({
        where: { userId: ride.driverId },
        data: {
          availableSeats: {
            increment: 1,
          },
        },
      })

      res.json({
        message: "Ride cancelled successfully",
        ride: updatedRide,
      })
    } catch (error) {
      console.error("Cancel ride error:", error)
      res.status(500).json({
        error: "Error cancelling ride",
      })
    }
  }

  static async updateRideStatus(req: Request, res: Response): Promise<void> {
    try {
      const validation = updateRideStatusSchema.safeParse(req.body)

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

      const { rideId } = req.params
      const { status } = validation.data

      const user = await prisma.user.findUnique({
        where: { clerkId },
      })

      if (!user || user.type !== "DRIVER") {
        res.status(403).json({
          error: "Only drivers can update ride status",
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

      if (ride.driverId !== user.id) {
        res.status(403).json({
          error: "Not authorized to update this ride",
        })
        return
      }

      const updatedRide = await prisma.ride.update({
        where: { id: rideId },
        data: {
          status,
          ...(status === "COMPLETED" && { completedTime: new Date() }),
        },
        include: {
          rider: {
            select: {
              name: true,
              phone: true,
            },
          },
          driver: {
            select: {
              name: true,
              phone: true,
            },
          },
        },
      })

      // If ride is completed or no-show, increment driver's available seats
      if (status === "COMPLETED" || status === "NO_SHOW") {
        await prisma.driverDetails.update({
          where: { userId: user.id },
          data: {
            availableSeats: {
              increment: 1,
            },
          },
        })
      }

      res.json({
        message: "Ride status updated successfully",
        ride: updatedRide,
      })
    } catch (error) {
      console.error("Update ride status error:", error)
      res.status(500).json({
        error: "Error updating ride status",
      })
    }
  }

  static async getRides(req: Request, res: Response): Promise<void> {
    try {
      const validation = getRidesQuerySchema.safeParse(req.query)

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

      const { status, limit = 10, offset = 0 } = validation.data

      const rides = await prisma.ride.findMany({
        where: {
          ...(user.type === "RIDER"
            ? { riderId: user.id }
            : { driverId: user.id }),
          ...(status && { status }),
        },
        include: {
          rider: {
            select: {
              name: true,
              phone: true,
            },
          },
          driver: {
            select: {
              name: true,
              phone: true,
            },
          },
        },
        orderBy: {
          pickupTime: "desc",
        },
        take: limit,
        skip: offset,
      })

      res.json({
        message: "Rides retrieved successfully",
        rides,
      })
    } catch (error) {
      console.error("Get rides error:", error)
      res.status(500).json({
        error: "Error fetching rides",
      })
    }
  }

  static async getRideDetails(req: Request, res: Response): Promise<void> {
    try {
      const auth = getAuth(req)
      const clerkId = auth.userId ?? ""

      if (!clerkId) {
        res.status(401).json({
          error: "Unauthorized",
        })
        return
      }

      const { rideId } = req.params

      const user = await prisma.user.findUnique({
        where: { clerkId },
      })

      if (!user) {
        res.status(404).json({
          error: "User not found",
        })
        return
      }

      const ride = await prisma.ride.findUnique({
        where: { id: rideId },
        include: {
          rider: {
            select: {
              name: true,
              phone: true,
            },
          },
          driver: {
            select: {
              name: true,
              phone: true,
            },
          },
        },
      })

      if (!ride) {
        res.status(404).json({
          error: "Ride not found",
        })
        return
      }

      // Verify user is either the rider or driver
      if (ride.riderId !== user.id && ride.driverId !== user.id) {
        res.status(403).json({
          error: "Not authorized to view this ride",
        })
        return
      }

      res.json({
        message: "Ride details retrieved successfully",
        ride,
      })
    } catch (error) {
      console.error("Get ride details error:", error)
      res.status(500).json({
        error: "Error fetching ride details",
      })
    }
  }
}
