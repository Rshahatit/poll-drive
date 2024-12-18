import { fetchWithAuth } from './base';
import type { Location } from '../../types';

export const driverService = {
  updateDetails: async (details: {
    carModel: string;
    licensePlate: string;
    insuranceNumber: string;
    totalSeats: number;
  }): Promise<void> => {
    return fetchWithAuth('/api/drivers/details', {
      method: 'PUT',
      body: JSON.stringify(details),
    });
  },

  updateLocation: async (location: {
    lat: number;
    lng: number;
    availableSeats: number;
  }): Promise<void> => {
    return fetchWithAuth('/api/drivers/location', {
      method: 'PUT',
      body: JSON.stringify(location),
    });
  },

  updateAvailability: async (data: {
    available: boolean;
    availableSeats: number;
    pickupLocation?: Location;
  }): Promise<void> => {
    return fetchWithAuth('/api/drivers/availability', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getAvailable: async (params: {
    lat: number;
    lng: number;
    radius: number;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchWithAuth(`/api/drivers/available?${query}`);
  },
};