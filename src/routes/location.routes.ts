import express from "express"
import { LocationController } from "../controllers/location.controller"

const router = express.Router()

// Get polling locations near coordinates
router.get("/polling", LocationController.getPollingLocations)

// Get available drivers near coordinates
router.get("/drivers/available", LocationController.getAvailableDrivers)

export default router
