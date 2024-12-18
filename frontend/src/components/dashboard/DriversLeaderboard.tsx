import React from 'react';
import { Trophy, Car } from 'lucide-react';

interface Driver {
  id: string;
  firstName: string;
  lastInitial: string;
  completedRides: number;
}

// TODO: Backend Integration - Replace with API data
const mockDrivers: Driver[] = [
  { id: '1', firstName: 'John', lastInitial: 'D', completedRides: 25 },
  { id: '2', firstName: 'Sarah', lastInitial: 'M', completedRides: 22 },
  { id: '3', firstName: 'Michael', lastInitial: 'R', completedRides: 20 },
  { id: '4', firstName: 'Emma', lastInitial: 'T', completedRides: 18 },
  { id: '5', firstName: 'David', lastInitial: 'B', completedRides: 15 },
];

export function DriversLeaderboard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h2 className="text-xl font-semibold">Top Volunteer Drivers</h2>
      </div>

      <div className="space-y-4">
        {mockDrivers.map((driver, index) => (
          <div
            key={driver.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index === 0 ? 'bg-yellow-100 text-yellow-600' :
                index === 1 ? 'bg-gray-100 text-gray-600' :
                index === 2 ? 'bg-orange-100 text-orange-600' :
                'bg-blue-50 text-blue-600'
              }`}>
                {index + 1}
              </div>
              <div>
                <span className="font-medium">
                  {driver.firstName} {driver.lastInitial}.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Car className="h-4 w-4" />
              <span>{driver.completedRides} rides</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}