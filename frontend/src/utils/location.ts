export function validateCoordinates(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    isFinite(lat) &&
    isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  );
}

export async function getZipCodeFromCoordinates(
  lat: number,
  lng: number,
  apiKey: string
): Promise<string | null> {
  if (!validateCoordinates(lat, lng)) {
    console.warn('Invalid coordinates provided to getZipCodeFromCoordinates');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    const data = await response.json();

    const zipCode = data.results[0]?.address_components?.find(
      (component: any) => component.types.includes('postal_code')
    )?.long_name;

    return zipCode || null;
  } catch (error) {
    console.error('Error getting ZIP code:', error);
    return null;
  }
}

export async function getCoordinatesFromZipCode(
  zipCode: string,
  apiKey: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.results[0]?.geometry?.location) {
      const { lat, lng } = data.results[0].geometry.location;
      if (validateCoordinates(lat, lng)) {
        return { lat, lng };
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
}