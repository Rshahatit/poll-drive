// Configuration for Google Maps
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Log last 4 characters of API key for verification
if (apiKey) {
  console.log('Using Google Maps API key ending in:', apiKey.slice(-4));
}

export const GOOGLE_MAPS_CONFIG = {
  apiKey,
  defaultCenter: { lat: 40.7128, lng: -74.0060 }, // NYC
  defaultZoom: 11,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};