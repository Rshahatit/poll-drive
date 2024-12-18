import { useState, useEffect } from 'react';
import { useLocation } from '../context/LocationContext';
import type { VotingLocation } from '../types';

export function useDriverStatus() {
  const [availableSeats, setAvailableSeats] = useState(4);
  const [pickupTime, setPickupTime] = useState('');
  const [pickupLocation, setPickupLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [pollingStation, setPollingStation] = useState<VotingLocation | null>(null);
  const { userLocation } = useLocation();

  useEffect(() => {
    // TODO: Backend Integration
    // - PUT /api/drivers/status
    // - Update driver availability, pickup location, and polling station
    const updateDriverStatus = async () => {
      try {
        console.log('Updating driver status:', {
          availableSeats,
          pickupTime,
          pickupLocation,
          pollingStation,
        });
      } catch (error) {
        console.error('Failed to update driver status:', error);
      }
    };

    if (pickupLocation && pollingStation) {
      updateDriverStatus();
    }
  }, [availableSeats, pickupTime, pickupLocation, pollingStation]);

  const handleAcceptRide = () => {
    // Decrease available seats by 1
    if (availableSeats > 0) {
      setAvailableSeats(prev => prev - 1);
    }
  };

  return {
    availableSeats,
    setAvailableSeats,
    pickupTime,
    setPickupTime,
    pickupLocation,
    setPickupLocation,
    pollingStation,
    setPollingStation,
    handleAcceptRide,
    userLocation,
  };
}