// src/components/Map/PollingLocationMap.tsx
import React, { useEffect, useRef, useCallback, memo } from 'react';
import { useLocation } from '../../context/LocationContext';
import type { VotingLocation } from '../../types';

interface PollingLocationMapProps {
  pollingLocations: VotingLocation[];
}

export const PollingLocationMap = memo(function PollingLocationMap({ pollingLocations }: PollingLocationMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const { userLocation } = useLocation();

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(ref.current, {
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

    // Clear existing markers
    clearMarkers();

    // Add markers for polling locations and user location
    const bounds = new google.maps.LatLngBounds();

    if (userLocation) {
      const userMarker = new google.maps.Marker({
        position: userLocation,
        map: mapRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        title: 'Your Location',
      });
      markersRef.current.push(userMarker);
      bounds.extend(userLocation);
    }

    pollingLocations.forEach((location, index) => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: mapRef.current!,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new google.maps.Size(32, 32),
        },
        title: location.name,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold">${location.name}</h3>
            <p class="text-sm">${location.address}</p>
            <p class="text-sm mt-1">Open 7:00 AM - 8:00 PM</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapRef.current!, marker);
      });

      markersRef.current.push(marker);
      bounds.extend({ lat: location.lat, lng: location.lng });

      // Show info window for nearest location by default
      if (index === 0) {
        infoWindow.open(mapRef.current!, marker);
      }
    });

    // Fit bounds if we have markers
    if (markersRef.current.length > 0) {
      mapRef.current.fitBounds(bounds);
    }

    return () => {
      clearMarkers();
    };
  }, [pollingLocations, userLocation, clearMarkers]);

  return <div ref={ref} className="w-full h-full" />;
});
