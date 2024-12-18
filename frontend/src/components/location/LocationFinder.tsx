import React, { useState, useCallback } from 'react';
import { ZipCodeInput } from './ZipCodeInput';
import { LocationDetector } from './LocationDetector';
import { NearestPollingStation } from './NearestPollingStation';
import { MapWrapper } from '../Map/MapWrapper';
import { usePollingLocations } from '../../hooks/usePollingLocations';
import { useLocation } from '../../context/LocationContext';
import { getCoordinatesFromZipCode } from '../../utils/location';

export function LocationFinder() {
  const [zipError, setZipError] = useState<string | null>(null);
  const { setUserLocation } = useLocation();
  const { 
    locations,
    nearestLocation,
    isLoading,
    error,
    fetchNearbyLocations
  } = usePollingLocations();

  const handleLocationUpdate = useCallback(async (coords: { lat: number; lng: number }) => {
    if (!coords.lat || !coords.lng) return;
    
    setUserLocation(coords);
    await fetchNearbyLocations(coords);
  }, [setUserLocation, fetchNearbyLocations]);

  const handleZipCode = useCallback(async (zipCode: string) => {
    setZipError(null);
    const coords = await getCoordinatesFromZipCode(
      zipCode,
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    );

    if (!coords) {
      setZipError('Could not find location for this ZIP code');
      return;
    }

    await handleLocationUpdate(coords);
  }, [handleLocationUpdate]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Find Your Polling Location</h2>
        <div className="space-y-4">
          <ZipCodeInput 
            onZipCodeSubmit={handleZipCode} 
            isLoading={isLoading} 
          />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>
          <LocationDetector onLocationDetected={handleLocationUpdate} />
          {zipError && (
            <p className="text-sm text-red-600 mt-2">{zipError}</p>
          )}
        </div>
      </div>

      <NearestPollingStation
        location={nearestLocation}
        isLoading={isLoading}
        error={error}
      />

      {locations.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Polling Locations Map</h3>
          <MapWrapper pollingLocations={locations} height="400px" />
        </div>
      )}
    </div>
  );
}