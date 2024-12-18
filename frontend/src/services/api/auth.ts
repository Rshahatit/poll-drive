import { fetchWithAuth } from './base';
import type { User } from '../../types';

interface UserRegistrationData {
  name: string;
  type: 'DRIVER' | 'RIDER';
  phone?: string;
  email: string;
}

export const authService = {
  register: async (userData: UserRegistrationData): Promise<User> => {
    return fetchWithAuth('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async (): Promise<User> => {
    return fetchWithAuth('/api/auth/profile');
  },

  updateProfile: async (userData: Partial<UserRegistrationData>): Promise<User> => {
    return fetchWithAuth('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};