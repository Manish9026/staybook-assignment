'use client';

import { useCallback, useRef } from 'react';

/**
 * Throttle a callback function — ensures it is called at most once
 * per `limit` milliseconds, regardless of how often it's invoked.
 * Useful for scroll handlers, resize events, etc.
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number = 1000
): T {
  const lastCall = useRef<number>(0);
  const lastFn = useRef<T>(fn);
  lastFn.current = fn;

  const throttled = useCallback(
    (...args: unknown[]) => {
      const now = Date.now();
      if (now - lastCall.current >= limit) {
        lastCall.current = now;
        return lastFn.current(...args);
      }
    },
    [limit]
  );

  return throttled as T;
}
