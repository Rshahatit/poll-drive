import React from 'react';
import { Car, UserRound } from 'lucide-react';

interface ActionCardsProps {
  onSelectType: (type: 'driver' | 'rider') => void;
}

export function ActionCards({ onSelectType }: ActionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
      <div
        onClick={() => onSelectType('driver')}
        className="relative group bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity" />
        <Car className="mx-auto h-12 w-12 text-blue-600" />
        <h3 className="mt-4 text-xl font-semibold">I Want to Drive</h3>
        <p className="mt-2 text-gray-600">
          Offer rides to voters in your community and help make democracy accessible to everyone.
        </p>
      </div>

      <div
        onClick={() => onSelectType('rider')}
        className="relative group bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity" />
        <UserRound className="mx-auto h-12 w-12 text-blue-600" />
        <h3 className="mt-4 text-xl font-semibold">I Need a Ride</h3>
        <p className="mt-2 text-gray-600">
          Connect with volunteer drivers and get a free ride to your polling location.
        </p>
      </div>
    </div>
  );
}