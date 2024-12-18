import React, { useState } from 'react';
import { LocationMap } from '../../components/LocationMap';
import { RidesList } from '../../components/RidesList';
import { ProfileCard } from '../../components/ProfileCard';
import { DriversLeaderboard } from '../../components/dashboard/DriversLeaderboard';
import { LocationSearch } from '../../components/LocationSearch';
import { UserSettings } from '../../components/settings/UserSettings';
import { UpcomingRide } from '../../components/dashboard/UpcomingRide';
import { NearestPollingLocation } from '../../components/dashboard/NearestPollingLocation';
import { useLocation } from '../../context/LocationContext';
import type { VotingLocation } from '../../types';
import { MOCK_POLLING_LOCATIONS } from '../../data/mockPollingLocations';

export function RiderDashboard() {
  const { setSelectedLocation } = useLocation();
  const [votingLocations, setVotingLocations] = useState<VotingLocation[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const handleLocationSelect = async (location: VotingLocation) => {
    setSelectedLocation(location);
    setVotingLocations(MOCK_POLLING_LOCATIONS.filter(loc => loc.id !== location.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Rider Dashboard</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full sm:w-auto px-4 py-2 text-blue-600 hover:text-blue-700 font-medium bg-white rounded-md shadow-sm border border-gray-200"
        >
          {showSettings ? 'Back to Dashboard' : 'Settings'}
        </button>
      </div>

      {showSettings ? (
        <UserSettings userType="rider" />
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Find Your Polling Location</h2>
            <LocationSearch onLocationSelect={handleLocationSelect} />
          </div>

          <NearestPollingLocation />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <UpcomingRide />
              <LocationMap />
              <RidesList locations={votingLocations} />
            </div>
            <div className="space-y-6 order-first lg:order-last">
              <ProfileCard />
              <DriversLeaderboard />
            </div>
          </div>
        </>
      )}
    </div>
  );
}