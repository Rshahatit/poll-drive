import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"
import { getAuth } from "@clerk/express"
import axios from "axios"

const prisma = new PrismaClient()

const locationQuerySchema = z.object({
  lat: z.string().transform((val) => parseFloat(val)),
  lng: z.string().transform((val) => parseFloat(val)),
  radius: z
    .string()
    .transform((val) => parseFloat(val))
    .optional(),
})

const GOOGLE_CIVIC_API_KEY = process.env.GOOGLE_CIVIC_API_KEY

export class LocationController {
  static async getPollingLocations(req: Request, res: Response): Promise<void> {
    try {
      const validation = locationQuerySchema.safeParse(req.query)

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

      const { lat, lng, radius = 5 } = validation.data

      try {
        // Call Google Civic Information API
        const response = await axios.get(
          `https://www.googleapis.com/civicinfo/v2/voterinfo`,
          {
            params: {
              key: GOOGLE_CIVIC_API_KEY,
              address: `${lat},${lng}`, // Using coordinates as address
              electionId: -1, // -1 returns next election
              returnAllAvailableData: true,
            },
          }
        )

        const pollingLocations = response.data.pollingLocations?.map(
          (location: any) => ({
            locationName: location.address.locationName,
            address: `${location.address.line1}, ${location.address.city}, ${location.address.state} ${location.address.zip}`,
            lat: location.latitude,
            lng: location.longitude,
            pollingHours: location.pollingHours,
            startDate: location.startDate,
            endDate: location.endDate,
            notes: location.notes,
          })
        )

        res.json({
          message: "Polling locations retrieved successfully",
          pollingLocations,
        })
      } catch (error: any) {
        if (error.response?.status === 404) {
          res.status(404).json({
            error: "No polling locations found for this address",
          })
          return
        }
        throw error
      }
    } catch (error) {
      console.error("Get polling locations error:", error)
      res.status(500).json({
        error: "Error fetching polling locations",
      })
    }
  }

  static async getAvailableDrivers(req: Request, res: Response): Promise<void> {
    try {
      const validation = locationQuerySchema.safeParse(req.query)

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

      const { lat, lng, radius = 5 } = validation.data

      // Convert radius from miles to degrees (approximate)
      const radiusInDegrees = radius / 69 // 1 degree is approximately 69 miles

      // Find available drivers within radius
      const availableDrivers = await prisma.driverDetails.findMany({
        where: {
          available: true,
          availableSeats: {
            gt: 0,
          },
          // Check if driver is within radius using Pythagorean theorem
          AND: [
            {
              currentLat: {
                gte: lat - radiusInDegrees,
                lte: lat + radiusInDegrees,
              },
            },
            {
              currentLng: {
                gte: lng - radiusInDegrees,
                lte: lng + radiusInDegrees,
              },
            },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
        orderBy: [
          {
            currentLat: "asc",
          },
          {
            currentLng: "asc",
          },
        ],
      })

      // Calculate exact distances and filter
      const driversWithDistance = availableDrivers
        .map((driver) => {
          const distance = calculateDistance(
            lat,
            lng,
            driver.currentLat!,
            driver.currentLng!
          )
          return {
            ...driver,
            distance,
          }
        })
        .filter((driver) => driver.distance <= radius)
        .sort((a, b) => a.distance - b.distance)

      res.json({
        message: "Available drivers retrieved successfully",
        drivers: driversWithDistance,
      })
    } catch (error) {
      console.error("Get available drivers error:", error)
      res.status(500).json({
        error: "Error fetching available drivers",
      })
    }
  }
}

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Radius of the Earth in miles

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return Number(distance.toFixed(2))
}

function toRad(value: number): number {
  return (value * Math.PI) / 180
}
