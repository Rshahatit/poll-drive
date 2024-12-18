import React from 'react';
import { User, Car, Calendar, MapPin, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRide } from '../context/RideContext';

export function ProfileCard() {
  const { user } = useAuth();
  const { upcomingRide, cancelRide } = useRide();
  
  // TODO: Backend Integration - Get actual completed rides count
  const completedRides = 15;

  const handleCancelRide = async () => {
    if (!confirm('Are you sure you want to cancel this ride?')) return;
    
    try {
      await cancelRide();
    } catch (error) {
      console.error('Failed to cancel ride:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <div className="bg-gray-200 p-3 rounded-full">
          <User className="h-8 w-8 text-gray-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <div className="flex items-center mt-1">
            <Car className="h-4 w-4 text-blue-600" />
            <span className="text-gray-600 ml-1">{completedRides} rides completed</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-5 w-5 mr-2" />
          <span>Member since March 2024</span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Upcoming Rides</h3>
        {upcomingRide ? (
          <div className="border rounded-lg p-3 relative">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-600 mt-1 shrink-0" />
                <div>
                  <p className="font-medium">{upcomingRide.location.name}</p>
                  <p className="text-sm text-gray-600">{upcomingRide.location.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{upcomingRide.time}</span>
              </div>
            </div>
            <button
              onClick={handleCancelRide}
              className="absolute top-2 right-2 text-red-500 hover:text-red-600"
              title="Cancel Ride"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No upcoming rides scheduled</p>
        )}
      </div>
    </div>
  );
}