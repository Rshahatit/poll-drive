import type { VotingLocation } from '../types';

export const MOCK_POLLING_LOCATIONS: VotingLocation[] = [
  {
    id: '1',
    name: 'City Hall Polling Station',
    address: '123 Main Street, New York, NY 10001',
    lat: 40.7128,
    lng: -74.0060,
  },
  {
    id: '2',
    name: 'Public Library Voting Center',
    address: '456 Park Avenue, New York, NY 10022',
    lat: 40.7589,
    lng: -73.9677,
  },
  {
    id: '3',
    name: 'Community Center Polls',
    address: '789 Broadway, New York, NY 10003',
    lat: 40.7320,
    lng: -73.9927,
  },
  {
    id: '4',
    name: 'High School Gymnasium',
    address: '321 School Lane, New York, NY 10016',
    lat: 40.7459,
    lng: -73.9777,
  },
  {
    id: '5',
    name: 'Fire Station #12 Voting Site',
    address: '567 Emergency Drive, New York, NY 10013',
    lat: 40.7197,
    lng: -74.0048,
  },
];