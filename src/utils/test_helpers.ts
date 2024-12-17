// src/utils/test-helpers.ts
export const DEV_USERS = {
  RIDER: {
    userId: "dev_rider_123",
    email: "rider@test.com",
    type: "RIDER",
  },
  DRIVER: {
    userId: "dev_driver_123",
    email: "driver@test.com",
    type: "DRIVER",
  },
}

export const setTestUser = (userType: "RIDER" | "DRIVER") => {
  process.env.DEV_USER = JSON.stringify(DEV_USERS[userType])
}
