import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { EventImage, PriceRange } from '../types/events';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format ISO date string to human-readable format.
 * e.g. "2024-12-25" → "Wed, Dec 25, 2024"
 */
export function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Date TBD';
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format time string "HH:MM:SS" → "7:30 PM"
 */
export function formatTime(timeStr?: string): string {
  if (!timeStr) return '';
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${String(minutes).padStart(2, '0')} ${ampm}`;
  } catch {
    return timeStr;
  }
}

/**
 * Format price range → "$15 – $85" or "Free" or "Price TBD"
 */
export function formatPrice(priceRanges: PriceRange[]): string {
  if (!priceRanges.length) return 'Price TBD';
  const first = priceRanges[0];
  if (!first.min && !first.max) return 'Free';
  const currency = first.currency || 'USD';
  const symbol = currency === 'USD' ? '$' : currency;
  if (first.min !== undefined && first.max !== undefined) {
    if (first.min === first.max) return `${symbol}${first.min}`;
    return `${symbol}${first.min} – ${symbol}${first.max}`;
  }
  return first.min ? `From ${symbol}${first.min}` : `Up to ${symbol}${first.max}`;
}

/**
 * Get the best available event image for a given ratio preference.
 */
export function getBestImage(
  images: EventImage[],
  preferRatio: string = '16_9'
): string {
  if (!images?.length) return '';
  const preferred = images.find((img) => img.ratio === preferRatio);
  if (preferred) return preferred.url;
  // Fallback: largest available
  const sorted = [...images].sort(
    (a, b) => (b.width || 0) * (b.height || 0) - (a.width || 0) * (a.height || 0)
  );
  return sorted[0]?.url || '';
}

/**
 * Get gradient color for an event based on category
 */
export function getCategoryGradient(category?: string): string {
  const gradients: Record<string, string> = {
    Music: 'from-purple-600 via-pink-600 to-rose-600',
    Sports: 'from-green-600 via-emerald-600 to-teal-600',
    'Arts & Theatre': 'from-orange-500 via-amber-500 to-yellow-500',
    Film: 'from-red-600 via-rose-600 to-pink-600',
    Family: 'from-blue-600 via-cyan-600 to-sky-600',
    Comedy: 'from-yellow-500 via-orange-500 to-amber-500',
    Miscellaneous: 'from-indigo-600 via-violet-600 to-purple-600',
  };
  return gradients[category || ''] || 'from-slate-600 via-slate-700 to-slate-800';
}

/**
 * Truncate text to a maximum length with ellipsis.
 */
export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + '…';
}

/**
 * Build query string from object, skipping null/empty values.
 */
export function buildQueryString(params: Record<string, string | number | undefined | null>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '') {
      qs.set(key, String(value));
    }
  }
  return qs.toString();
}

/**
 * Get event status color class
 */
export function getStatusColor(status?: string): string {
  switch (status?.toLowerCase()) {
    case 'onsale': return 'text-green-400';
    case 'offsale': return 'text-red-400';
    case 'cancelled': return 'text-red-500';
    case 'postponed': return 'text-yellow-400';
    case 'rescheduled': return 'text-orange-400';
    default: return 'text-slate-400';
  }
}

/**
 * Get event status label
 */
export function getStatusLabel(status?: string): string {
  switch (status?.toLowerCase()) {
    case 'onsale': return 'On Sale';
    case 'offsale': return 'Off Sale';
    case 'cancelled': return 'Cancelled';
    case 'postponed': return 'Postponed';
    case 'rescheduled': return 'Rescheduled';
    default: return status || 'Unknown';
  }
}
