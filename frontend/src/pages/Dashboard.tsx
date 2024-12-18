import React from 'react';
import { useAuth } from '../context/AuthContext';
import { RiderDashboard } from './dashboards/RiderDashboard';
import { DriverDashboard } from './dashboards/DriverDashboard';

export function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return user.type === 'rider' ? <RiderDashboard /> : <DriverDashboard />;
}