import React, { useState, useCallback } from 'react';
import { Compass } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { getZipCodeFromCoordinates } from '../../utils/location';

interface LocationDetectorProps {
  onLocationDetected: (coords: { lat: number; lng: number }) => void;
}

export function LocationDetector({ onLocationDetected }: LocationDetectorProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUserLocation } = useLocation();

  const detectLocation = useCallback(async () => {
    if (isDetecting) return;
    
    setIsDetecting(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 5000
        });
      });

      const { latitude: lat, longitude: lng } = position.coords;
      
      // Update user location in context
      setUserLocation({ lat, lng });
      
      // Notify parent component
      onLocationDetected({ lat, lng });

    } catch (err) {
      setError('Could not detect your location. Please enter your ZIP code manually.');
    } finally {
      setIsDetecting(false);
    }
  }, [onLocationDetected, setUserLocation, isDetecting]);

  return (
    <div className="w-full">
      <button
        onClick={detectLocation}
        disabled={isDetecting}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Compass className={`h-5 w-5 ${isDetecting ? 'animate-spin' : ''}`} />
        {isDetecting ? 'Detecting location...' : 'Use my current location'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}