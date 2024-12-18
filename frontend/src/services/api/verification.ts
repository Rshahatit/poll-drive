import { fetchWithAuth } from './base';

export const verificationService = {
  uploadDriverId: async (file: File): Promise<{ status: string }> => {
    const formData = new FormData();
    formData.append('idDocument', file);

    return fetchWithAuth('/api/drivers/verify', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type here, let the browser set it with the boundary
      },
    });
  },

  getVerificationStatus: async (): Promise<{
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    message?: string;
  }> => {
    return fetchWithAuth('/api/drivers/verification-status');
  },
};