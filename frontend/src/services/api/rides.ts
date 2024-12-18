import { fetchWithAuth } from './base';
import type { Ride } from '../../types';

interface RideRequest {
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  pollingLocationId: string;
  driverId: string;
  pickupTime: string;
  tipAmount: number;
}

export const rideService = {
  getRides: async (status: string): Promise<Ride[]> => {
    return fetchWithAuth(`/api/rides?status=${status}`);
  },

  getRideDetails: async (rideId: string): Promise<Ride> => {
    return fetchWithAuth(`/api/rides/${rideId}`);
  },

  bookRide: async (request: RideRequest): Promise<Ride> => {
    return fetchWithAuth('/api/rides', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  cancelRide: async (rideId: string, reason?: string): Promise<void> => {
    return fetchWithAuth(`/api/rides/${rideId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },

  rateRide: async (rideId: string, rating: number, comment?: string): Promise<void> => {
    return fetchWithAuth(`/api/rides/${rideId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  },
};