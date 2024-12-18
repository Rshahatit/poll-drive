// src/controllers/location.controller.ts
import { Request, Response } from "express"
import { z } from "zod"
import { getAuth } from "@clerk/express"
import axios from "axios"

// Add address schema
const locationQuerySchema = z.object({
  lat: z
    .string()
    .transform((val) => parseFloat(val))
    .optional(),
  lng: z
    .string()
    .transform((val) => parseFloat(val))
    .optional(),
  address: z.string().optional(),
  radius: z
    .string()
    .transform((val) => parseFloat(val))
    .optional(),
})

// Geocoding helper function
async function geocodeAddress(address: string) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    )

    if (response.data.results.length === 0) {
      throw new Error("Address not found")
    }

    const location = response.data.results[0].geometry.location
    return {
      lat: location.lat,
      lng: location.lng,
      formattedAddress: response.data.results[0].formatted_address,
    }
  } catch (error) {
    console.error("Geocoding error:", error)
    throw new Error("Failed to geocode address")
  }
}

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

      let lat: number, lng: number

      // Handle address if provided
      if (validation.data.address) {
        const geoResult = await geocodeAddress(validation.data.address)
        lat = geoResult.lat
        lng = geoResult.lng
      } else if (validation.data.lat && validation.data.lng) {
        lat = validation.data.lat
        lng = validation.data.lng
      } else {
        res.status(400).json({
          error: "Either address or coordinates (lat/lng) must be provided",
        })
        return
      }

      // const radius = validation.data.radius || 5 // Default 5 miles radius

      try {
        // Call Google Civic Information API
        const response = await axios.get(
          `https://www.googleapis.com/civicinfo/v2/voterinfo`,
          {
            params: {
              key: process.env.GOOGLE_CIVIC_API_KEY,
              address: `${lat},${lng}`,
              electionId: -1, // -1 returns next election
              returnAllAvailableData: true,
            },
          }
        )
        console.log(response.data)
        // Process and sort polling locations by distance
        const pollingLocations = response.data.pollingLocations
          ?.map((location: any) => ({
            locationName: location.address.locationName,
            address: `${location.address.line1}, ${location.address.city}, ${location.address.state} ${location.address.zip}`,
            lat: location.latitude,
            lng: location.longitude,
            pollingHours: location.pollingHours,
            startDate: location.startDate,
            endDate: location.endDate,
            notes: location.notes,
            distance: calculateDistance(
              lat,
              lng,
              location.latitude,
              location.longitude
            ),
          }))
          .sort((a: any, b: any) => a.distance - b.distance)

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
}

// Helper function to calculate distance between two points
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
  return Number((R * c).toFixed(2))
}

function toRad(value: number): number {
  return (value * Math.PI) / 180
}
