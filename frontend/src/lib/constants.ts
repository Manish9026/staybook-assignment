import {
  AppearanceSettings,
  AppTheme,
  FontFamily,
  SortOption,
} from '../types/events';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const SORT_OPTIONS: SortOption[] = [
  { label: 'Date (Earliest)', value: 'date,asc' },
  { label: 'Date (Latest)', value: 'date,desc' },
  { label: 'Name (A→Z)', value: 'name,asc' },
  { label: 'Name (Z→A)', value: 'name,desc' },
  { label: 'Relevance', value: 'relevance,desc' },
];

export const EVENT_CATEGORIES = [
  { id: 'all', name: 'All Events' },
  { id: 'Music', name: 'Music' },
  { id: 'Sports', name: 'Sports' },
  { id: 'Arts & Theatre', name: 'Arts & Theatre' },
  { id: 'Film', name: 'Film' },
  { id: 'Family', name: 'Family' },
  { id: 'Comedy', name: 'Comedy' },
  { id: 'Miscellaneous', name: 'Miscellaneous' },
];

export const CATEGORY_ICONS: Record<string, string> = {
  Music: '🎵',
  Sports: '🏆',
  'Arts & Theatre': '🎭',
  Film: '🎬',
  Family: '👨‍👩‍👧',
  Comedy: '😂',
  Miscellaneous: '✨',
  'All Events': '🌟',
};

export const CATEGORY_COLORS: Record<string, string> = {
  Music: 'from-purple-500 to-pink-500',
  Sports: 'from-green-500 to-emerald-500',
  'Arts & Theatre': 'from-orange-500 to-amber-500',
  Film: 'from-red-500 to-rose-500',
  Family: 'from-blue-500 to-cyan-500',
  Comedy: 'from-yellow-400 to-orange-400',
  Miscellaneous: 'from-indigo-500 to-violet-500',
};

export const THEMES: { id: AppTheme; label: string; preview: string[] }[] = [
  { id: 'dark', label: 'Dark', preview: ['#0a0a0f', '#1a1a2e', '#7c3aed'] },
  { id: 'light', label: 'Light', preview: ['#f8fafc', '#ffffff', '#6366f1'] },
  { id: 'ocean', label: 'Ocean', preview: ['#0d1b2a', '#1b3a5c', '#0ea5e9'] },
  { id: 'sunset', label: 'Sunset', preview: ['#1a0a1e', '#2d1b3d', '#f97316'] },
  { id: 'forest', label: 'Forest', preview: ['#0a1a0f', '#1a3a20', '#22c55e'] },
  { id: 'midnight', label: 'Midnight', preview: ['#050510', '#0f0f2d', '#818cf8'] },
];

export const FONTS: FontFamily[] = [
  'Inter',
  'Roboto',
  'Outfit',
  'Playfair Display',
  'JetBrains Mono',
  'Space Grotesk',
];

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: 'dark',
  font: 'Inter',
  borderRadius: 12,
  shadowIntensity: 'medium',
  titleSize: 28,
  titleWeight: 700,
  subtitleSize: 16,
  subtitleWeight: 400,
  cardGlassmorphism: true,
  animationsEnabled: true,
};

export const PAGE_SIZE = 12;
export const DEBOUNCE_DELAY = 350; // ms
export const THROTTLE_DELAY = 1000; // ms
