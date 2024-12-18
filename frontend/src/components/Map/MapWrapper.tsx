import React from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { PollingLocationMap } from './PollingLocationMap';
import type { VotingLocation } from '../../types';

interface MapWrapperProps {
  pollingLocations: VotingLocation[];
  height?: string;
}

export function MapWrapper({ pollingLocations, height = '400px' }: MapWrapperProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const render = (status: string) => {
    switch (status) {
      case 'LOADING':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        );
      case 'FAILURE':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-red-600">
              Failed to load map. Please check your internet connection.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ height }} className="w-full rounded-lg overflow-hidden">
      <Wrapper apiKey={apiKey} render={render}>
        <PollingLocationMap pollingLocations={pollingLocations} />
      </Wrapper>
    </div>
  );
}