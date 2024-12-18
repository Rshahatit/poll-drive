import React, { useEffect, useRef } from 'react';
import { useLocation } from '../../context/LocationContext';

interface GoogleMapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
}

export function GoogleMap({ center, zoom }: GoogleMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map>();
  const { setUserLocation } = useLocation();

  useEffect(() => {
    if (ref.current && !mapRef.current) {
      mapRef.current = new google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(userLocation);
            mapRef.current?.setCenter(userLocation);
            
            new google.maps.Marker({
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
            });
          },
          () => {
            console.error('Error getting user location');
          }
        );
      }
    }
  }, [center, zoom, setUserLocation]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}