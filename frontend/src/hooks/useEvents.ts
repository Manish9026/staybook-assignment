'use client';

import useSWR from 'swr';
import { searchEvents, EventSearchParams, ApiError } from '../lib/api';
import { EventsResponse } from '../types/events';

const fetcher = (params: EventSearchParams) => searchEvents(params);

/**
 * SWR-powered hook for fetching events.
 * - Caches responses on the client (stale-while-revalidate)
 * - Deduplicates concurrent identical requests
 * - Only fetches when city or keyword is provided
 */
export function useEvents(params: EventSearchParams) {
  const hasQuery = !!(params.city?.trim() || params.keyword?.trim());

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    EventsResponse,
    ApiError
  >(
    hasQuery ? ['events', params] : null,
    () => fetcher(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // 5s dedup window
      keepPreviousData: true,  // Show old data while fetching new page
    }
  );

  return {
    data,
    error,
    isLoading: isLoading && !data,  // True only on first load
    isRefetching: isValidating && !!data,
    events: data?.events ?? [],
    pagination: data?.pagination,
    hasQuery,
    refresh: mutate,
  };
}
