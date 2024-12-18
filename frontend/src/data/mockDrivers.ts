import type { Driver } from '../types';

export const MOCK_DRIVERS: Driver[] = [
  {
    id: '1',
    name: 'John Driver',
    email: 'driver@example.com',
    type: 'driver',
    carDetails: {
      model: 'Toyota Camry',
      totalSeats: 4,
      availableSeats: 3
    },
    verificationStatus: 'verified',
    pickupLocation: {
      address: '123 Main St',
      lat: 40.7128,
      lng: -74.0060
    }
  }
];

export const mockDriverService = {
  drivers: [...MOCK_DRIVERS],

  getAvailableDrivers: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDriverService.drivers.filter(d => d.carDetails.availableSeats > 0);
  },

  updateAvailability: async (driverId: string, seats: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const driver = mockDriverService.drivers.find(d => d.id === driverId);
    if (driver) {
      driver.carDetails.availableSeats = seats;
    }
  }
};