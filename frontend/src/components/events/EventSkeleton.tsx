'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface EventSkeletonProps {
  count?: number;
  className?: string;
}

function SingleSkeleton() {
  return (
    <div
      className="glass-card overflow-hidden"
      style={{ borderRadius: 'var(--border-radius)' }}
    >
      {/* Image placeholder */}
      <div className="skeleton h-48" />

      {/* Content placeholders */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="skeleton h-5 w-4/5 rounded-md" />
        <div className="skeleton h-4 w-3/5 rounded-md" />

        {/* Meta */}
        <div className="flex gap-2">
          <div className="skeleton h-4 w-24 rounded-md" />
          <div className="skeleton h-4 w-20 rounded-md" />
        </div>

        {/* Venue */}
        <div className="skeleton h-4 w-3/4 rounded-md" />

        {/* Price */}
        <div className="skeleton h-4 w-1/3 rounded-md" />

        {/* Footer */}
        <div className="pt-3 border-t border-[var(--border-color)] flex justify-between">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

export function EventSkeleton({ count = 12, className }: EventSkeletonProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5',
        className
      )}
      aria-label="Loading events..."
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SingleSkeleton key={i} />
      ))}
    </div>
  );
}
