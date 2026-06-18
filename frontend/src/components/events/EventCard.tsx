'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ExternalLink, DollarSign } from 'lucide-react';
import { Event } from '../../types/events';
import { Badge } from '../ui/Badge';
import {
  getBestImage,
  getCategoryGradient,
  formatDate,
  formatTime,
  formatPrice,
  cn,
} from '../../lib/utils';
import { CATEGORY_ICONS } from '../../lib/constants';

import { LazyImage } from '../ui/LazyImage';

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
  index?: number;
}

/**
 * Safely check if a string is meaningful (not null, undefined, empty, or "Undefined").
 */
function isMeaningful(val?: string | null): val is string {
  if (!val) return false;
  const lower = val.trim().toLowerCase();
  return lower !== '' && lower !== 'undefined' && lower !== 'n/a' && lower !== 'unknown';
}

export function EventCard({ event, onClick, index = 0 }: EventCardProps) {
  const imageUrl = getBestImage(event.images, '16_9');
  const gradient = getCategoryGradient(event.category);
  const categoryIcon = isMeaningful(event.category) ? (CATEGORY_ICONS[event.category] || '🎪') : '🎪';
  const hasImage = !!imageUrl;
  const price = formatPrice(event.price_ranges ?? []);
  const [imgError, setImgError] = useState(false);

  // Determine the footer sub-label
  const footerLabel =
    (isMeaningful(event.sub_category) ? event.sub_category : null) ||
    (isMeaningful(event.category) ? event.category : null) ||
    'Event';

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.06, 0.5),
        ease: [0.23, 1, 0.32, 1],
      }}
      onClick={() => onClick(event)}
      className="glass-card cursor-pointer overflow-hidden group h-full flex flex-col"
      style={{ borderRadius: 'var(--border-radius)' }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${event.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(event);
        }
      }}
    >
      {/* Image / Gradient Header */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        {hasImage && !imgError ? (
          <>
            <LazyImage
              src={imageUrl}
              alt={event.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              fallbackSrc="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop"
              onError={() => setImgError(true)}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
          </>
        ) : (
          /* Fallback gradient */
          <div className={cn('absolute inset-0 bg-gradient-to-br', gradient)}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl opacity-30 float-animation">
                {categoryIcon}
              </span>
            </div>
          </div>
        )}

        {/* Category badge top-left */}
        {isMeaningful(event.category) && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="default" size="sm">
              <span>{categoryIcon}</span>
              <span>{event.category}</span>
            </Badge>
          </div>
        )}

        {/* Status badge top-right */}
        {event.status === 'onsale' && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="success" size="sm">● On Sale</Badge>
          </div>
        )}
        {event.status === 'cancelled' && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="danger" size="sm">Cancelled</Badge>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Title */}
        <h3
          className="font-semibold leading-snug text-[var(--text-primary)] line-clamp-2"
          style={{ fontSize: 'clamp(14px, 2vw, 17px)' }}
        >
          {event.name}
        </h3>

        {/* Date & Time */}
        {(event.start_date || event.start_time) && (
          <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
            <Calendar size={14} className="shrink-0 text-[var(--accent-primary)]" />
            <span>{formatDate(event.start_date)}</span>
            {event.start_time && (
              <>
                <span className="text-[var(--text-muted)]">·</span>
                <Clock size={14} className="shrink-0" />
                <span>{formatTime(event.start_time)}</span>
              </>
            )}
          </div>
        )}

        {/* Venue — only show if venue and venue.name are meaningful */}
        {event.venue && isMeaningful(event.venue.name) && (
          <div className="flex items-start gap-1.5 text-sm text-[var(--text-secondary)]">
            <MapPin size={14} className="shrink-0 mt-0.5 text-[var(--accent-primary)]" />
            <span className="line-clamp-1">
              {event.venue.name}
              {isMeaningful(event.venue.city) && (
                <span className="text-[var(--text-muted)]">
                  {' '}· {event.venue.city}
                  {isMeaningful(event.venue.state) ? `, ${event.venue.state}` : ''}
                </span>
              )}
            </span>
          </div>
        )}

        {/* Price */}
        {price && (
          <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
            <DollarSign size={14} className="shrink-0 text-[var(--accent-primary)]" />
            <span className={price === 'Price TBD' ? 'text-[var(--text-muted)]' : ''}>
              {price}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">
            {footerLabel}
          </span>
          <span
            className="text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: 'var(--accent-primary)' }}
          >
            View Details
            <ExternalLink size={11} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
