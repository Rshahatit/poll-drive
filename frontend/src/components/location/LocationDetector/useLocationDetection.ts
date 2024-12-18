import { useState, useCallback } from 'react';
import { useLocation } from '../../../context/LocationContext';
import { getZipCodeFromCoordinates, validateCoordinates } from '../../../utils/location';

export function useLocationDetection(onLocationDetected: (coords: { lat: number; lng: number }) => void) {
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

      if (!validateCoordinates(lat, lng)) {
        throw new Error('Invalid coordinates received from geolocation');
      }
      
      // Update user location in context
      setUserLocation({ lat, lng });
      
      // Notify parent component
      onLocationDetected({ lat, lng });

    } catch (err) {
      setError('Could not detect your location. Please enter your ZIP code manually.');
      console.error('Geolocation error:', err);
    } finally {
      setIsDetecting(false);
    }
  }, [onLocationDetected, setUserLocation, isDetecting]);

  return {
    detectLocation,
    isDetecting,
    error
  };
}