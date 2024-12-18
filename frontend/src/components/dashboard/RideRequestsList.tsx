import React from 'react';
import { RideRequest } from './RideRequest';

interface RideRequestsListProps {
  requests: Array<{
    id: number;
    pickup: string;
    destination: string;
  }>;
  onAcceptRequest: (id: number) => void;
}

export function RideRequestsList({ requests, onAcceptRequest }: RideRequestsListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Ride Requests</h2>
      <div className="space-y-4">
        {requests.map((request) => (
          <RideRequest
            key={request.id}
            {...request}
            onAccept={onAcceptRequest}
          />
        ))}
      </div>
    </div>
  );
}