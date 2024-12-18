import { fetchWithAuth } from './base';
import type { VotingLocation } from '../../types';
import { validateCoordinates } from '../../utils/location';

export const locationService = {
  getNearbyPollingLocations: async (params: {
    lat: number;
    lng: number;
    radius: number;
  }): Promise<VotingLocation[]> => {
    try {
      if (!validateCoordinates(params.lat, params.lng)) {
        console.warn('Invalid coordinates for polling locations');
        return [];
      }

      const query = new URLSearchParams({
        lat: params.lat.toFixed(6),
        lng: params.lng.toFixed(6),
        radius: params.radius.toString()
      }).toString();
      
      return await fetchWithAuth(`/api/locations/polling?${query}`);
    } catch (error) {
      console.error('Failed to fetch polling locations:', error);
      return [];
    }
  },
};