import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create test driver
  const driver = await prisma.user.create({
    data: {
      clerkId: "test_driver_clerk_id",
      name: "Test Driver",
      email: "driver@test.com",
      type: "DRIVER",
      phone: "1234567890",
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
        },
      },
    },
  })

  // Create test rider
  const rider = await prisma.user.create({
    data: {
      clerkId: "test_rider_clerk_id",
      name: "Test Rider",
      email: "rider@test.com",
      type: "RIDER",
      phone: "0987654321",
    },
  })

  console.log({ driver, rider })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
