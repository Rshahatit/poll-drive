import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from '../../../context/LocationContext';
import { createMarkers } from './mapUtils';
import type { VotingLocation } from '../../../types';

export function usePollingLocationMap(pollingLocations: VotingLocation[]) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const { userLocation } = useLocation();

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!googleMapRef.current) {
      googleMapRef.current = new google.maps.Map(mapRef.current, {
        zoom: 12,
        center: userLocation || { lat: 40.7128, lng: -74.0060 },
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });
    }

    clearMarkers();
    const bounds = new google.maps.LatLngBounds();
    
    markersRef.current = createMarkers({
      map: googleMapRef.current,
      pollingLocations,
      userLocation,
      bounds
    });

    if (markersRef.current.length > 0) {
      googleMapRef.current.fitBounds(bounds);
    }

    return () => {
      clearMarkers();
    };
  }, [pollingLocations, userLocation, clearMarkers]);

  return { mapRef };
}