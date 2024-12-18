import React, { useState } from 'react';
import { MapPin, Clock, Users, AlertCircle } from 'lucide-react';
import type { VotingLocation } from '../types';
import { RideBookingModal } from './modals/RideBookingModal';
import { useRide } from '../context/RideContext';

interface RidesListProps {
  locations: VotingLocation[];
}

export function RidesList({ locations }: RidesListProps) {
  const { canBookRide, bookRide } = useRide();
  const [selectedLocation, setSelectedLocation] = useState<VotingLocation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookRide = (location: VotingLocation) => {
    if (!canBookRide) {
      alert('You already have an upcoming ride booked. Please cancel it before booking a new one.');
      return;
    }
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  const handleConfirmRide = async (time: string, tipAmount: number) => {
    if (!selectedLocation) return;
    
    try {
      await bookRide(selectedLocation, time, 'mock-driver-id', tipAmount);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to book ride:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4">Available Rides</h2>
      
      {!canBookRide && (
        <div className="mb-4 p-3 sm:p-4 bg-yellow-50 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-yellow-600 text-sm sm:text-base">
            You already have an upcoming ride booked. Please cancel it before booking a new one.
          </p>
        </div>
      )}
      
      {locations.length === 0 ? (
        <p className="text-gray-600">Search for your address to see available rides.</p>
      ) : (
        <div className="space-y-4">
          {locations.map((location) => (
            <div
              key={location.id}
              className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">{location.name}</h3>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{location.address}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">Multiple pickup times available</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">3 drivers available</span>
                  </div>
                </div>
                <button
                  onClick={() => handleBookRide(location)}
                  disabled={!canBookRide}
                  className={`w-full sm:w-auto px-4 py-2 rounded-md ${
                    canBookRide
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Book Ride
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedLocation && (
        <RideBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          location={selectedLocation}
          onConfirm={handleConfirmRide}
        />
      )}
    </div>
  );
}