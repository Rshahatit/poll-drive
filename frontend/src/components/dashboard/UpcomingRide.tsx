import React from 'react';
import { MapPin, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { useRide } from '../../context/RideContext';

export function UpcomingRide() {
  const { upcomingRide, cancelRide } = useRide();

  if (!upcomingRide) {
    return null;
  }

  const handleCancel = async () => {
    try {
      await cancelRide();
    } catch (error) {
      // Handle error (could show a toast notification here)
      console.error('Failed to cancel ride:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">Upcoming Ride</h2>
        <button
          onClick={handleCancel}
          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
        >
          <AlertCircle className="h-4 w-4" />
          Cancel Ride
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-1" />
          <div>
            <p className="font-medium">{upcomingRide.location.name}</p>
            <p className="text-sm text-gray-600">{upcomingRide.location.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-blue-600" />
          <p className="text-gray-600">{upcomingRide.time}</p>
        </div>

        {upcomingRide.tipAmount > 0 && (
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <p className="text-gray-600">Tip Amount: ${upcomingRide.tipAmount}.00</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-500">
            Please be ready at least 10 minutes before your scheduled pickup time.
            If you need to cancel, please do so at least 2 hours in advance.
          </p>
        </div>
      </div>
    </div>
  );
}