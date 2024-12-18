import React from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';
import type { VotingLocation } from '../../types';

interface NearestPollingStationProps {
  location: VotingLocation | null;
  isLoading: boolean;
  error: Error | null;
}

export function NearestPollingStation({ 
  location, 
  isLoading, 
  error 
}: NearestPollingStationProps) {
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
        <div className="text-red-600">
          <p className="font-medium">Error loading polling location</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">
          Enter your location to find the nearest polling station.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start gap-3 mb-4">
        <Navigation className="h-6 w-6 text-blue-600 mt-1" />
        <div>
          <h3 className="font-semibold text-lg">Nearest Polling Location</h3>
          <p className="text-gray-600 text-sm">Based on your location</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-1" />
          <div>
            <p className="font-medium">{location.name}</p>
            <p className="text-sm text-gray-600">{location.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-blue-600" />
          <p className="text-sm text-gray-600">Open from 7:00 AM to 8:00 PM</p>
        </div>

        <div className="mt-4 pt-4 border-t">
          <button
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`, '_blank')}
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