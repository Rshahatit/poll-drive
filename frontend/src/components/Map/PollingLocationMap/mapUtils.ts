import type { VotingLocation } from '../../../types';

interface CreateMarkersParams {
  map: google.maps.Map;
  pollingLocations: VotingLocation[];
  userLocation: google.maps.LatLngLiteral | null;
  bounds: google.maps.LatLngBounds;
}

export function createMarkers({ map, pollingLocations, userLocation, bounds }: CreateMarkersParams): google.maps.Marker[] {
  const markers: google.maps.Marker[] = [];

  if (userLocation) {
    const userMarker = new google.maps.Marker({
      position: userLocation,
      map,
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
    markers.push(userMarker);
    bounds.extend(userLocation);
  }

  pollingLocations.forEach((location, index) => {
    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new google.maps.Size(32, 32),
      },
      title: location.name,
    });

    const infoWindow = createInfoWindow(location);

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    markers.push(marker);
    bounds.extend({ lat: location.lat, lng: location.lng });

    if (index === 0) {
      infoWindow.open(map, marker);
    }
  });

  return markers;
}

function createInfoWindow(location: VotingLocation): google.maps.InfoWindow {
  return new google.maps.InfoWindow({
    content: `
      <div class="p-2">
        <h3 class="font-semibold">${location.name}</h3>
        <p class="text-sm">${location.address}</p>
        <p class="text-sm mt-1">Open 7:00 AM - 8:00 PM</p>
      </div>
    `,
  });
}