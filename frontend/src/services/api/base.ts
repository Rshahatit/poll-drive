import type { User } from '../../types';

const API_URL = import.meta.env.VITE_API_URL;

// Create a function that takes the token as a parameter instead of using hooks
export async function fetchWithAuth(endpoint: string, token: string, options: RequestInit = {}) {
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

// Create a hook for using the API with authentication
export function createApiHook<T>(endpoint: string, options: RequestInit = {}) {
  return async function useApiEndpoint(token: string): Promise<T> {
    return fetchWithAuth(endpoint, token, options);
  };
}