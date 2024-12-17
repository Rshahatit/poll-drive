import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"
import { getAuth } from "@clerk/express"

const prisma = new PrismaClient()

const notificationQuerySchema = z.object({
  unreadOnly: z
    .string()
    .transform((val) => val === "true")
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

const updatePreferencesSchema = z.object({
  emailEnabled: z.boolean(),
  pushEnabled: z.boolean(),
  smsEnabled: z.boolean(),
})

export class NotificationController {
  static async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const validation = notificationQuerySchema.safeParse(req.query)

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

      const { unreadOnly = false, limit = 10, offset = 0 } = validation.data

      const notifications = await prisma.notification.findMany({
        where: {
          userId: user.id,
          ...(unreadOnly && { read: false }),
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      })

      const total = await prisma.notification.count({
        where: {
          userId: user.id,
          ...(unreadOnly && { read: false }),
        },
      })

      res.json({
        message: "Notifications retrieved successfully",
        notifications,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + notifications.length < total,
        },
      })
    } catch (error) {
      console.error("Get notifications error:", error)
      res.status(500).json({
        error: "Error fetching notifications",
      })
    }
  }

  static async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const auth = getAuth(req)
      const clerkId = auth.userId ?? ""

      if (!clerkId) {
        res.status(401).json({
          error: "Unauthorized",
        })
        return
      }

      const { notificationId } = req.params

      const user = await prisma.user.findUnique({
        where: { clerkId },
      })

      if (!user) {
        res.status(404).json({
          error: "User not found",
        })
        return
      }

      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      })

      if (!notification) {
        res.status(404).json({
          error: "Notification not found",
        })
        return
      }

      if (notification.userId !== user.id) {
        res.status(403).json({
          error: "Not authorized to update this notification",
        })
        return
      }

      const updatedNotification = await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      })

      res.json({
        message: "Notification marked as read",
        notification: updatedNotification,
      })
    } catch (error) {
      console.error("Mark notification as read error:", error)
      res.status(500).json({
        error: "Error updating notification",
      })
    }
  }

  static async updatePreferences(req: Request, res: Response): Promise<void> {
    try {
      const validation = updatePreferencesSchema.safeParse(req.body)

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

      const preferences = await prisma.userPreferences.upsert({
        where: { userId: user.id },
        update: validation.data,
        create: {
          userId: user.id,
          ...validation.data,
        },
      })

      res.json({
        message: "Notification preferences updated successfully",
        preferences,
      })
    } catch (error) {
      console.error("Update preferences error:", error)
      res.status(500).json({
        error: "Error updating notification preferences",
      })
    }
  }

  // Utility method to create notifications (used by other controllers)
  static async createNotification(
    userId: string,
    title: string,
    message: string
  ): Promise<void> {
    try {
      await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          read: false,
        },
      })
    } catch (error) {
      console.error("Create notification error:", error)
    }
  }

  static async markAllAsRead(req: Request, res: Response): Promise<void> {
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

      await prisma.notification.updateMany({
        where: {
          userId: user.id,
          read: false,
        },
        data: {
          read: true,
        },
      })

      res.json({
        message: "All notifications marked as read",
      })
    } catch (error) {
      console.error("Mark all notifications as read error:", error)
      res.status(500).json({
        error: "Error updating notifications",
      })
    }
  }
}
