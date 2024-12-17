import express from "express"
import { RideController } from "../controllers/ride.controller"

const router = express.Router()

// Book a new ride
router.post("/", RideController.bookRide)

// Cancel a ride
router.put("/:rideId/cancel", RideController.cancelRide)

// Update ride status (driver only)
router.put("/:rideId/status", RideController.updateRideStatus)

// Get user's rides
router.get("/", RideController.getRides)

// Get specific ride details
router.get("/:rideId", RideController.getRideDetails)

export default router
