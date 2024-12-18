import { useState, useCallback, useRef } from 'react';
import { useApi } from './useApi';
import { locationService } from '../services/api';
import { validateCoordinates } from '../utils/location';
import type { VotingLocation } from '../types';

interface UsePollingLocationsResult {
  locations: VotingLocation[];
  nearestLocation: VotingLocation | null;
  isLoading: boolean;
  error: Error | null;
  fetchNearbyLocations: (params: { lat: number; lng: number }) => Promise<void>;
}

export function usePollingLocations(): UsePollingLocationsResult {
  const [locations, setLocations] = useState<VotingLocation[]>([]);
  const [nearestLocation, setNearestLocation] = useState<VotingLocation | null>(null);
  const lastFetchRef = useRef<string>('');
  
  const { execute: fetchLocations, isLoading, error } = useApi(
    locationService.getNearbyPollingLocations
  );

  const fetchNearbyLocations = useCallback(async ({ lat, lng }: { lat: number; lng: number }) => {
    if (!validateCoordinates(lat, lng)) {
      console.warn('Invalid coordinates provided to fetchNearbyLocations');
      return;
    }

    // Create a cache key for this location
    const locationKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;

    // Skip if we've already fetched for these coordinates
    if (locationKey === lastFetchRef.current) {
      return;
    }

    try {
      lastFetchRef.current = locationKey;
      const fetchedLocations = await fetchLocations({
        lat,
        lng,
        radius: 5000 // 5km radius
      });

      if (fetchedLocations && Array.isArray(fetchedLocations)) {
        setLocations(fetchedLocations);
        if (fetchedLocations.length > 0) {
          setNearestLocation(fetchedLocations[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch polling locations:', err);
    }
  }, [fetchLocations]);

  return {
    locations,
    nearestLocation,
    isLoading,
    error,
    fetchNearbyLocations
  };
}