// TypeScript interfaces for Events API
// These mirror the backend Pydantic models exactly.

export interface EventImage {
  url: string;
  width?: number;
  height?: number;
  ratio?: string;
}

export interface EventVenue {
  id?: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface PriceRange {
  type?: string;
  currency?: string;
  min?: number;
  max?: number;
}

export interface Event {
  id: string;
  name: string;
  url?: string;
  start_date?: string;
  start_time?: string;
  timezone?: string;
  status?: string;
  category?: string;
  sub_category?: string;
  images: EventImage[];
  venue?: EventVenue;
  price_ranges: PriceRange[];
  info?: string;
  please_note?: string;
}

export interface PaginationMeta {
  total_elements: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface EventsResponse {
  events: Event[];
  pagination: PaginationMeta;
}

export interface CategoryItem {
  id: string;
  name: string;
}

export interface SearchFilters {
  city: string;
  keyword: string;
  category: string;
  sort: string;
  page: number;
}

export type SortOption = {
  label: string;
  value: string;
};

export type AppTheme =
  | 'dark'
  | 'light'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'midnight';

export type FontFamily =
  | 'Inter'
  | 'Roboto'
  | 'Outfit'
  | 'Playfair Display'
  | 'JetBrains Mono'
  | 'Space Grotesk';

export type ShadowIntensity = 'none' | 'soft' | 'medium' | 'strong';

export interface AppearanceSettings {
  theme: AppTheme;
  font: FontFamily;
  borderRadius: number;        // 0–20px
  shadowIntensity: ShadowIntensity;
  titleSize: number;           // 16–48px
  titleWeight: number;         // 400–900
  subtitleSize: number;        // 12–32px
  subtitleWeight: number;      // 300–700
  cardGlassmorphism: boolean;
  animationsEnabled: boolean;
}
