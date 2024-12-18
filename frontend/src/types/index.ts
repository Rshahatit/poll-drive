export interface User {
  id: string;
  name: string;
  email: string;
  type: 'driver' | 'rider';
}

export interface Driver extends User {
  type: 'driver';
  carDetails: {
    model: string;
    totalSeats: number;
    availableSeats: number;
  };
  verificationStatus: 'pending' | 'verified';
  pickupLocation: {
    address: string;
    lat: number;
    lng: number;
  };
}

export interface Rider extends User {
  type: 'rider';
  pickupLocation: {
    address: string;
    lat: number;
    lng: number;
  };
}

export interface VotingLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Ride {
  id: string;
  location: VotingLocation;
  time: string;
  driverId: string;
  tipAmount: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}