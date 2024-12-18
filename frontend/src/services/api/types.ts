export interface ApiResponse<T> {
  message: string;
  data?: T;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface ApiError {
  error: string;
  details?: any;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface LocationParams {
  lat: number;
  lng: number;
  radius: number;
}