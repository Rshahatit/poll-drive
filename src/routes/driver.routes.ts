import express from "express"
import { DriverController } from "../controllers/driver.controller"

const router = express.Router()

// Driver verification routes
router.post("/verify", DriverController.uploadVerificationDocs)
router.get("/verification-status", DriverController.getVerificationStatus)

// Driver details routes
router.put("/details", DriverController.updateDriverDetails)

// Location and availability routes
router.put("/location", DriverController.updateLocation)
router.put("/availability", DriverController.updateAvailability)

export default router
