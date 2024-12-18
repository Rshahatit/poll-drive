import type { Ride } from '../types';
import { MOCK_POLLING_LOCATIONS } from './mockPollingLocations';

export const MOCK_RIDES: Ride[] = [
  {
    id: '1',
    location: MOCK_POLLING_LOCATIONS[0],
    time: '10:00 AM',
    driverId: '1',
    tipAmount: 5,
    status: 'upcoming'
  },
  {
    id: '2',
    location: MOCK_POLLING_LOCATIONS[1],
    time: '2:00 PM',
    driverId: '1',
    tipAmount: 10,
    status: 'completed'
  }
];

export const mockRideService = {
  rides: [...MOCK_RIDES],

  getRides: async (status: string): Promise<Ride[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockRideService.rides.filter(ride => ride.status === status);
  },

  bookRide: async (request: any): Promise<Ride> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newRide: Ride = {
      id: String(mockRideService.rides.length + 1),
      location: request.location,
      time: request.pickupTime,
      driverId: request.driverId,
      tipAmount: request.tipAmount,
      status: 'upcoming'
    };

    mockRideService.rides.push(newRide);
    return newRide;
  },

  cancelRide: async (rideId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const rideIndex = mockRideService.rides.findIndex(r => r.id === rideId);
    if (rideIndex !== -1) {
      mockRideService.rides[rideIndex].status = 'cancelled';
    }
  }
};