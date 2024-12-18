import type { Ride } from '../types';

export function validateRideBooking(ride: Partial<Ride>): string | null {
  if (!ride.location) {
    return 'Location is required';
  }

  if (!ride.time) {
    return 'Pickup time is required';
  }

  if (!ride.driverId) {
    return 'Driver information is missing';
  }

  if (typeof ride.tipAmount !== 'number' || ride.tipAmount < 0) {
    return 'Invalid tip amount';
  }

  return null;
}