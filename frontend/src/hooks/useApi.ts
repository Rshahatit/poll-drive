import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import type { ApiError } from '../services/api/types';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T>(
  apiCall: (token: string, ...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  const { getToken } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (...args: any[]) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      
      const result = await apiCall(token, ...args);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      options.onError?.(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, getToken, options]);

  return {
    data,
    error,
    isLoading,
    execute,
  };
}