import React from 'react';
import { useLocationDetection } from './useLocationDetection';
import { LocationButton } from './LocationButton';

interface LocationDetectorProps {
  onLocationDetected: (zipCode: string) => void;
}

export function LocationDetector({ onLocationDetected }: LocationDetectorProps) {
  const { detectLocation, isDetecting, error } = useLocationDetection(onLocationDetected);

  return (
    <div className="w-full">
      <LocationButton onClick={detectLocation} isDetecting={isDetecting} />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}