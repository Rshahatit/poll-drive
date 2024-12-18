import React from 'react';
import { MapWrapper } from './Map/MapWrapper';
import { useLocation } from '../context/LocationContext';
import { MOCK_POLLING_LOCATIONS } from '../data/mockPollingLocations';

export function LocationMap() {
  const { selectedLocation } = useLocation();
  
  // Filter locations to include selected location and nearby ones
  const locations = selectedLocation 
    ? [selectedLocation, ...MOCK_POLLING_LOCATIONS.filter(loc => loc.id !== selectedLocation.id)]
    : MOCK_POLLING_LOCATIONS;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Nearby Polling Locations</h2>
      <MapWrapper pollingLocations={locations} />
    </div>
  );
}