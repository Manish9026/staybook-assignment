'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Event } from '../../types/events';
import { EventCard } from './EventCard';
import { cn } from '../../lib/utils';

interface EventGridProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  className?: string;
}

export function EventGrid({ events, onEventClick, className }: EventGridProps) {
  return (
    <motion.div
      layout
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5',
        className
      )}
      aria-label={`${events.length} events found`}
    >
      <AnimatePresence mode="popLayout">
        {events.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            index={index}
            onClick={onEventClick}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
