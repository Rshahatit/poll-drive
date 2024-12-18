import type { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Driver',
    email: 'driver@example.com',
    type: 'driver'
  },
  {
    id: '2',
    name: 'Sarah Rider',
    email: 'rider@example.com',
    type: 'rider'
  }
];

export const mockAuthService = {
  currentUser: null as User | null,

  login: async (email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    mockAuthService.currentUser = user;
    return user;
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockAuthService.currentUser = null;
  },

  getCurrentUser: () => mockAuthService.currentUser
};