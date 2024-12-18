import { fetchWithAuth } from './base';

export const notificationService = {
  getNotifications: async (params: {
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchWithAuth(`/api/notifications?${query}`);
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    return fetchWithAuth(`/api/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  updatePreferences: async (preferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  }): Promise<void> => {
    return fetchWithAuth('/api/users/notification-preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },
};