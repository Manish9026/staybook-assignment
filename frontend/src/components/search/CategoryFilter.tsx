'use client';

import React, { useRef } from 'react';
import { cn } from '../../lib/utils';
import { EVENT_CATEGORIES, CATEGORY_ICONS } from '../../lib/constants';

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
  className?: string;
}

export function CategoryFilter({ selected, onChange, className }: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn('relative', className)}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />

      {/* Scrollable pill row */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar px-2 py-1"
        role="group"
        aria-label="Event category filter"
      >
        {EVENT_CATEGORIES.map((cat) => {
          const isActive = selected === cat.id;
          const icon = CATEGORY_ICONS[cat.name] || '🎪';
          return (
            <button
              key={cat.id}
              id={`category-filter-${cat.id}`}
              onClick={() => onChange(cat.id === 'all' ? '' : cat.id)}
              aria-pressed={isActive}
              className={cn(
                'category-pill flex items-center gap-1.5 shrink-0',
                isActive && 'active'
              )}
            >
              <span role="img" aria-hidden="true">{icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
