import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Clock, Users, AlertCircle } from 'lucide-react';
import { locationService } from '../../services/api';
import type { VotingLocation } from '../../types';
import { useApi } from '../../hooks/useApi';

export function NearestPollingLocation() {
  const [nearestLocation, setNearestLocation] = useState<VotingLocation | null>(null);
  const { execute: fetchLocations, isLoading, error } = useApi(locationService.getNearbyPollingLocations);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const locations = await fetchLocations({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              radius: 5000 // 5km radius
            });
            
            if (locations && locations.length > 0) {
              setNearestLocation(locations[0]);
            }
          } catch (err) {
            console.error('Failed to fetch locations:', err);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
        }
      );
    }
  }, [fetchLocations]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-3 text-red-600">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-medium">Error loading polling location</p>
            <p className="text-sm">{error.error || 'Please try again later'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!nearestLocation) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 text-gray-600">
          <MapPin className="h-5 w-5" />
          <p>No polling locations found nearby. Try searching for your address above.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start gap-3 mb-4">
        <Navigation className="h-6 w-6 text-blue-600 mt-1" />
        <div>
          <h3 className="font-semibold text-lg">Nearest Polling Location</h3>
          <p className="text-gray-600 text-sm">Based on your current location</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-1" />
          <div>
            <p className="font-medium">{nearestLocation.name}</p>
            <p className="text-sm text-gray-600">{nearestLocation.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-blue-600" />
          <p className="text-sm text-gray-600">Open from 7:00 AM to 8:00 PM</p>
        </div>

        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-blue-600" />
          <p className="text-sm text-gray-600">Currently: Low Wait Time</p>
        </div>

        <div className="mt-4 pt-4 border-t">
          <button
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${nearestLocation.lat},${nearestLocation.lng}`, '_blank')}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
}