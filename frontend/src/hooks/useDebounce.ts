'use client';

import { useEffect, useState } from 'react';

/**
 * Debounce a value — returns the value only after it hasn't changed
 * for `delay` milliseconds. Useful for search inputs to reduce API calls.
 */
export function useDebounce<T>(value: T, delay: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
