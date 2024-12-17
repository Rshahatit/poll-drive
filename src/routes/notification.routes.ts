import express from "express"
import { NotificationController } from "../controllers/notification.controller"

const router = express.Router()

// Get user notifications
router.get("/", NotificationController.getNotifications)

// Mark notification as read
router.put("/:notificationId/read", NotificationController.markAsRead)

// Mark all notifications as read
router.put("/read-all", NotificationController.markAllAsRead)

// Update notification preferences
router.put("/preferences", NotificationController.updatePreferences)

export default router
