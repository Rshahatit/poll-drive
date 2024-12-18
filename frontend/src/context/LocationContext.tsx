import React, { createContext, useContext, useState, useCallback } from 'react';
import { validateCoordinates } from '../utils/location';
import type { VotingLocation } from '../types';

interface LocationContextType {
  selectedLocation: VotingLocation | null;
  setSelectedLocation: (location: VotingLocation | null) => void;
  userLocation: google.maps.LatLngLiteral | null;
  setUserLocation: (location: google.maps.LatLngLiteral | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<VotingLocation | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);

  const handleSetUserLocation = useCallback((location: google.maps.LatLngLiteral | null) => {
    if (!location) {
      setUserLocation(null);
      return;
    }
    
    if (!validateCoordinates(location.lat, location.lng)) {
      console.warn('Invalid coordinates provided to setUserLocation');
      return;
    }

    // Prevent setting the same location multiple times
    setUserLocation(prev => {
      if (prev?.lat === location.lat && prev?.lng === location.lng) {
        return prev;
      }
      return location;
    });
  }, []);

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        userLocation,
        setUserLocation: handleSetUserLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}