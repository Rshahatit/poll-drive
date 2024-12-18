import React from 'react';
import { Car, Users, Clock, MapPin } from 'lucide-react';
import { LocationSearch } from '../LocationSearch';
import type { VotingLocation } from '../../types';

interface RideStatusProps {
  availableSeats: number;
  setAvailableSeats: (seats: number) => void;
  pickupTime: string;
  setPickupTime: (time: string) => void;
  pickupLocation: google.maps.LatLngLiteral | null;
  setPickupLocation: (location: google.maps.LatLngLiteral | null) => void;
  pollingStation: VotingLocation | null;
  setPollingStation: (location: VotingLocation | null) => void;
}

export function RideStatus({
  availableSeats,
  setAvailableSeats,
  pickupTime,
  setPickupTime,
  pickupLocation,
  setPickupLocation,
  pollingStation,
  setPollingStation,
}: RideStatusProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <Car className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-medium">Active Ride</span>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <label className="block text-sm text-gray-600">Available Seats</label>
              <select
                value={availableSeats}
                onChange={(e) => setAvailableSeats(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-blue-600" />
            <div>
              <label className="block text-sm text-gray-600">Pickup Time</label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-medium">Set Pickup Location</span>
          </div>
          <LocationSearch
            onLocationSelect={(location) => {
              setPickupLocation({ lat: location.lat, lng: location.lng });
            }}
          />
          {pickupLocation && (
            <div className="mt-2 text-sm text-gray-600">
              Pickup location set: {pickupLocation.lat.toFixed(4)}, {pickupLocation.lng.toFixed(4)}
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-medium">Select Polling Station</span>
          </div>
          <LocationSearch
            onLocationSelect={(location) => {
              setPollingStation(location);
            }}
          />
          {pollingStation && (
            <div className="mt-2 text-sm text-gray-600">
              Destination: {pollingStation.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}