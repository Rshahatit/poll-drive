import React, { useState } from 'react';
import { ZipCodeInput } from './ZipCodeInput';
import { LocationDetector } from './LocationDetector';
import { useLocation } from '../../context/LocationContext';
import type { VotingLocation } from '../../types';

interface LocationSelectorProps {
  onLocationSelected: (location: VotingLocation) => void;
}

export function LocationSelector({ onLocationSelected }: LocationSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [nearbyLocations, setNearbyLocations] = useState<VotingLocation[]>([]);
  const { setSelectedLocation } = useLocation();

  const handleZipCode = async (zipCode: string) => {
    setIsLoading(true);
    try {
      // First, convert ZIP code to coordinates
      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.results[0]) {
        const { lat, lng } = geocodeData.results[0].geometry.location;
        
        // TODO: Replace with actual API call to backend
        // This would fetch nearby polling locations based on coordinates
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/locations/polling?lat=${lat}&lng=${lng}`
        );
        const locations = await response.json();
        
        setNearbyLocations(locations);
        
        if (locations.length > 0) {
          setSelectedLocation(locations[0]);
          onLocationSelected(locations[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ZipCodeInput onZipCodeSubmit={handleZipCode} isLoading={isLoading} />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>
      <LocationDetector onLocationDetected={handleZipCode} />
      
      {nearbyLocations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Nearest Polling Locations</h3>
          <div className="space-y-3">
            {nearbyLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => {
                  setSelectedLocation(location);
                  onLocationSelected(location);
                }}
                className="w-full p-4 text-left border rounded-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <h4 className="font-medium">{location.name}</h4>
                <p className="text-sm text-gray-600">{location.address}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}