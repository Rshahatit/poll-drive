import React from 'react';

interface RideRequestProps {
  id: number;
  pickup: string;
  destination: string;
  onAccept: (id: number) => void;
}

export function RideRequest({ id, pickup, destination, onAccept }: RideRequestProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">Rider #{id}</h3>
          <p className="text-gray-600 mt-1">Pickup: {pickup}</p>
          <p className="text-gray-600">Destination: {destination}</p>
        </div>
        <button
          onClick={() => onAccept(id)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Accept
        </button>
      </div>
    </div>
  );
}