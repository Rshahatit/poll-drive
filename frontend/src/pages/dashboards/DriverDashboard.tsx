import React, { useState } from 'react';
import { LocationMap } from '../../components/LocationMap';
import { ProfileCard } from '../../components/ProfileCard';
import { RideStatus } from '../../components/dashboard/RideStatus';
import { RideRequestsList } from '../../components/dashboard/RideRequestsList';
import { UserSettings } from '../../components/settings/UserSettings';
import { useRideRequests } from '../../hooks/useRideRequests';
import { useDriverStatus } from '../../hooks/useDriverStatus';

export function DriverDashboard() {
  const { requests, handleAcceptRequest } = useRideRequests();
  const {
    availableSeats,
    setAvailableSeats,
    pickupTime,
    setPickupTime,
    pickupLocation,
    setPickupLocation,
    pollingStation,
    setPollingStation,
    handleAcceptRide,
  } = useDriverStatus();
  const [showSettings, setShowSettings] = useState(false);

  const onAcceptRequest = (id: number) => {
    handleAcceptRequest(id);
    handleAcceptRide();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          {showSettings ? 'Back to Dashboard' : 'Settings'}
        </button>
      </div>

      {showSettings ? (
        <UserSettings userType="driver" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Your Ride Status</h2>
              <RideStatus
                availableSeats={availableSeats}
                setAvailableSeats={setAvailableSeats}
                pickupTime={pickupTime}
                setPickupTime={setPickupTime}
                pickupLocation={pickupLocation}
                setPickupLocation={setPickupLocation}
                pollingStation={pollingStation}
                setPollingStation={setPollingStation}
              />
            </div>
            
            <LocationMap />
            <RideRequestsList
              requests={requests}
              onAcceptRequest={onAcceptRequest}
            />
          </div>
          
          <div>
            <ProfileCard />
          </div>
        </div>
      )}
    </div>
  );
}