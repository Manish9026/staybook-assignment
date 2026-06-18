import axios, { AxiosError, AxiosInstance } from 'axios';
import { EventsResponse, CategoryItem } from '../types/events';
import { API_BASE_URL } from './constants';
import { buildQueryString } from './utils';

export interface EventSearchParams {
  city?: string;
  keyword?: string;
  category?: string;
  page?: number;
  size?: number;
  sort?: string;
  startDateTime?: string;
  endDateTime?: string;
}

// Create axios instance with base config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 35000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data as Record<string, unknown> | undefined;
    const message =
      (data?.detail as string) ||
      (data?.message as string) ||
      error.message ||
      'An unexpected error occurred';

    // Enrich the error with a user-friendly message
    const enrichedError = new ApiError(message, status || 0, error);
    return Promise.reject(enrichedError);
  }
);

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }

  get isRateLimit(): boolean {
    return this.status === 429;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

// API Functions

/**
 * Search events with filters. Results come from backend cache.
 */
export async function searchEvents(params: EventSearchParams): Promise<EventsResponse> {
  const queryString = buildQueryString({
    city: params.city,
    keyword: params.keyword,
    category: params.category,
    page: params.page ?? 0,
    size: params.size ?? 12,
    sort: params.sort ?? 'date,asc',
    startDateTime: params.startDateTime,
    endDateTime: params.endDateTime,
  });

  const response = await apiClient.get<EventsResponse>(`/api/events?${queryString}`);
  return response.data;
}

/**
 * Fetch available event categories.
 */
export async function fetchCategories(): Promise<CategoryItem[]> {
  const response = await apiClient.get<CategoryItem[]>('/api/events/categories');
  return response.data;
}

/**
 * Health check
 */
export async function healthCheck(): Promise<{ status: string; api_configured: boolean }> {
  const response = await apiClient.get('/api/health');
  return response.data;
}

export default apiClient;
