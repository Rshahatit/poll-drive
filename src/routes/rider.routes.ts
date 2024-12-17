import express from "express"
import { RiderController } from "../controllers/rider.controller"

const router = express.Router()

// Profile routes
router.get("/profile", RiderController.getRiderProfile)
router.put("/profile", RiderController.updateRiderProfile)

// Ride history and stats
router.get("/rides", RiderController.getRideHistory)
router.get("/stats", RiderController.getRideStats)

// Rating routes
router.post("/rides/:rideId/rate", RiderController.rateDriver)

export default router
