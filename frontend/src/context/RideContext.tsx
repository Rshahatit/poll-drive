import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Ride, VotingLocation } from '../types';
import { mockRideService } from '../data/mockRides';
import { useAuth } from './AuthContext';

interface RideContextType {
  upcomingRide: Ride | null;
  canBookRide: boolean;
  bookRide: (location: VotingLocation, time: string, driverId: string, tipAmount: number) => Promise<void>;
  cancelRide: () => Promise<void>;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export function RideProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [upcomingRide, setUpcomingRide] = useState<Ride | null>(null);

  useEffect(() => {
    if (user) {
      mockRideService.getRides('upcoming')
        .then((rides) => {
          if (rides.length > 0) {
            setUpcomingRide(rides[0]);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  const canBookRide = !upcomingRide;

  const bookRide = useCallback(async (
    location: VotingLocation,
    time: string,
    driverId: string,
    tipAmount: number
  ) => {
    if (!canBookRide) {
      throw new Error('You already have an active ride booking');
    }

    try {
      const ride = await mockRideService.bookRide({
        location,
        pickupTime: time,
        driverId,
        tipAmount,
      });

      setUpcomingRide(ride);
    } catch (error) {
      console.error('Failed to book ride:', error);
      throw error;
    }
  }, [canBookRide]);

  const cancelRide = useCallback(async () => {
    if (!upcomingRide) return;

    try {
      await mockRideService.cancelRide(upcomingRide.id);
      setUpcomingRide(null);
    } catch (error) {
      console.error('Failed to cancel ride:', error);
      throw error;
    }
  }, [upcomingRide]);

  return (
    <RideContext.Provider
      value={{
        upcomingRide,
        canBookRide,
        bookRide,
        cancelRide,
      }}
    >
      {children}
    </RideContext.Provider>
  );
}

export function useRide() {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within RideProvider');
  }
  return context;
}