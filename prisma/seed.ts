// prisma/seed.ts
import { PrismaClient } from "@prisma/client"
import { TEST_USERS } from "../src/middleware/test-auth"

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.notification.deleteMany()
  await prisma.ride.deleteMany()
  await prisma.driverVerification.deleteMany()
  await prisma.driverDetails.deleteMany()
  await prisma.userPreferences.deleteMany()
  await prisma.user.deleteMany()

  // Create test driver
  const driver = await prisma.user.create({
    data: {
      clerkId: TEST_USERS.DRIVER.userId,
      name: "Test Driver",
      email: TEST_USERS.DRIVER.email,
      type: "DRIVER",
      phone: "1234567890",
      preferences: {
        create: {
          emailEnabled: true,
          pushEnabled: true,
          smsEnabled: true,
        },
      },
      driverDetails: {
        create: {
          carModel: "Toyota Camry",
          licensePlate: "TEST123",
          insuranceNumber: "INS123",
          totalSeats: 4,
          available: true,
          currentLat: 37.7749,
          currentLng: -122.4194,
          availableSeats: 3,
          verification: {
            create: {
              status: "APPROVED",
              idImageUrl: "https://example.com/id",
              driverLicenseUrl: "https://example.com/license",
            },
          },
        },
      },
    },
  })

  // Create test rider
  const rider = await prisma.user.create({
    data: {
      clerkId: TEST_USERS.RIDER.userId,
      name: "Test Rider",
      email: TEST_USERS.RIDER.email,
      type: "RIDER",
      phone: "0987654321",
      preferences: {
        create: {
          emailEnabled: true,
          pushEnabled: true,
          smsEnabled: true,
        },
      },
    },
  })

  // Create some sample rides
  const ride = await prisma.ride.create({
    data: {
      riderId: rider.id,
      driverId: driver.id,
      status: "COMPLETED",
      pickupLat: 37.7749,
      pickupLng: -122.4194,
      pickupAddress: "123 Test St, San Francisco, CA",
      pollingLocationId: "test_location_1",
      pickupTime: new Date(),
      completedTime: new Date(),
      tipAmount: 5.0,
    },
  })

  console.log({
    message: "Database seeded!",
    testUsers: {
      driver: {
        id: driver.id,
        clerkId: driver.clerkId,
        email: driver.email,
      },
      rider: {
        id: rider.id,
        clerkId: rider.clerkId,
        email: rider.email,
      },
    },
    sampleRide: {
      id: ride.id,
      status: ride.status,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
