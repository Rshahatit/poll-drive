import React, { memo } from 'react';
import { usePollingLocationMap } from './usePollingLocationMap';
import type { VotingLocation } from '../../../types';

interface PollingLocationMapProps {
  pollingLocations: VotingLocation[];
}

export const PollingLocationMap = memo(function PollingLocationMap({ pollingLocations }: PollingLocationMapProps) {
  const { mapRef } = usePollingLocationMap(pollingLocations);
  return <div ref={mapRef} className="w-full h-full" />;
});