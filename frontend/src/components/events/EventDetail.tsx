'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  ExternalLink,
  AlertCircle,
  Info,
} from 'lucide-react';
import { LazyImage } from '../ui/LazyImage';
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

interface EventDetailProps {
  event: Event | null;
  onClose: () => void;
}

/** Safely check if a string is meaningful (not null, undefined, empty, or "Undefined"). */
function isMeaningful(val?: string | null): val is string {
  if (!val) return false;
  const lower = val.trim().toLowerCase();
  return lower !== '' && lower !== 'undefined' && lower !== 'n/a' && lower !== 'unknown';
}

export function EventDetail({ event, onClose }: EventDetailProps) {
  const [imgError, setImgError] = useState(false);

  // Reset img error when event changes
  useEffect(() => { setImgError(false); }, [event?.id]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (event) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [event, onClose]);

  const imageUrl = event ? getBestImage(event.images, '16_9') : '';
  const gradient = event ? getCategoryGradient(event.category) : '';
  const categoryIcon = event?.category && isMeaningful(event.category) ? (CATEGORY_ICONS[event.category] || '🎪') : '🎪';
  const priceRanges = event?.price_ranges ?? [];

  return (
    <AnimatePresence>
      {event && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={event.name}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
              style={{ borderRadius: 'var(--border-radius)' }}
            >
              {/* Hero Image */}
              <div className="relative h-64 w-full overflow-hidden rounded-t-[var(--border-radius)] flex-shrink-0">
                {imageUrl && !imgError ? (
                  <>
                    <LazyImage
                      src={imageUrl}
                      alt={event.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      fallbackSrc="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop"
                      onError={() => setImgError(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                  </>
                ) : (
                  <div className={cn('absolute inset-0 bg-gradient-to-br', gradient)}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-8xl opacity-25">{categoryIcon}</span>
                    </div>
                  </div>
                )}

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {isMeaningful(event.category) && (
                    <Badge variant="default" className="mb-2">
                      {categoryIcon} {event.category}
                    </Badge>
                  )}
                  <h2
                    className="text-white font-bold leading-tight"
                    style={{
                      fontSize: 'var(--title-size, 24px)',
                      fontWeight: 'var(--title-weight, 700)',
                    }}
                  >
                    {event.name}
                  </h2>
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  aria-label="Close event details"
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60
                             text-white transition-all duration-150 backdrop-blur-sm z-20 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Status */}
                {event.status && event.status !== 'onsale' && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertCircle size={16} className="text-amber-400" />
                    <span className="text-amber-300 text-sm font-medium capitalize">
                      Status: {event.status}
                    </span>
                  </div>
                )}

                {/* Date, Time, Timezone */}
                {(event.start_date || event.start_time) && (
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold">
                      Date & Time
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {event.start_date && (
                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                          <Calendar size={16} className="text-[var(--accent-primary)]" />
                          <span className="text-sm">{formatDate(event.start_date)}</span>
                        </div>
                      )}
                      {event.start_time && (
                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                          <Clock size={16} className="text-[var(--accent-primary)]" />
                          <span className="text-sm">
                            {formatTime(event.start_time)}
                            {isMeaningful(event.timezone) && (
                              <span className="text-[var(--text-muted)] ml-1">
                                ({event.timezone!.split('/').pop()?.replace('_', ' ')})
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Venue */}
                {event.venue && isMeaningful(event.venue.name) && (
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold">
                      Venue
                    </h3>
                    <div className="flex items-start gap-2 text-[var(--text-secondary)]">
                      <MapPin size={16} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{event.venue.name}</p>
                        {(isMeaningful(event.venue.address) || isMeaningful(event.venue.city)) && (
                          <p className="text-sm mt-0.5">
                            {[event.venue.address, event.venue.city, event.venue.state, event.venue.country]
                              .filter((v) => isMeaningful(v))
                              .join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Price */}
                {priceRanges.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold">
                      Pricing
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {priceRanges.map((pr, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-sm"
                        >
                          <DollarSign size={14} className="text-[var(--accent-primary)]" />
                          <span className="font-medium text-[var(--text-primary)]">
                            {formatPrice([pr])}
                          </span>
                          {isMeaningful(pr.type) && (
                            <span className="text-[var(--text-muted)]">({pr.type})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Info */}
                {(isMeaningful(event.info) || isMeaningful(event.please_note)) && (
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold">
                      Info
                    </h3>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)]">
                      <Info size={16} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {isMeaningful(event.info) ? event.info : event.please_note}
                      </p>
                    </div>
                  </div>
                )}

                {/* CTA */}
                {event.url && (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="event-detail-cta"
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-6
                               rounded-[var(--border-radius)] font-semibold text-white
                               transition-all duration-200 hover:opacity-90 hover:scale-[1.02]
                               active:scale-95"
                    style={{ background: 'var(--accent-gradient)' }}
                  >
                    <ExternalLink size={18} />
                    Get Tickets
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
