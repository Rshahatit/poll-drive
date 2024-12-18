import { useState, useEffect } from 'react';

interface RideRequest {
  id: number;
  pickup: string;
  destination: string;
}

export function useRideRequests() {
  const [requests, setRequests] = useState<RideRequest[]>([
    {
      id: 1,
      pickup: '123 Main St',
      destination: 'City Hall Polling Station',
    },
    {
      id: 2,
      pickup: '456 Oak Ave',
      destination: 'Community Center Polls',
    },
  ]);

  useEffect(() => {
    // TODO: Backend Integration - WebSocket connection
    // - Connect to ws://api/drivers/requests
    // - Listen for new ride requests
    // - Update requests state
    return () => {
      // Cleanup WebSocket connection
    };
  }, []);

  const handleAcceptRequest = async (id: number) => {
    // TODO: Backend Integration
    // - POST /api/rides/accept
    // - Update ride status
    // - Notify rider
    console.log('Accepting request:', id);
    setRequests(requests.filter(request => request.id !== id));
  };

  return {
    requests,
    handleAcceptRequest,
  };
}