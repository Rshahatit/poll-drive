import { useAuth } from '@clerk/clerk-react';
import type { User, VotingLocation, Ride } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const { getToken } = useAuth();
  const token = await getToken();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
}

