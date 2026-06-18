'use client';

import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, Frown, Zap, TrendingUp } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchBar } from '../components/search/SearchBar';
import { CategoryFilter } from '../components/search/CategoryFilter';
import { EventGrid } from '../components/events/EventGrid';
import { EventSkeleton } from '../components/events/EventSkeleton';
import { EventDetail } from '../components/events/EventDetail';
import { Pagination } from '../components/pagination/Pagination';
import { CityCardGrid } from '../components/search/CityCardGrid';
import { useEvents } from '../hooks/useEvents';
import { useDebounce } from '../hooks/useDebounce';
import { Event } from '../types/events';
import { SORT_OPTIONS, DEBOUNCE_DELAY, PAGE_SIZE } from '../lib/constants';
import { ApiError } from '../lib/api';
import { cn } from '../lib/utils';

const POPULAR_CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'London', 'Toronto',
  'Sydney', 'Miami', 'Las Vegas', 'Austin', 'Nashville',
];

function HomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Search state initialized from query params
  const [cityInput, setCityInput] = useState(() => searchParams.get('city') || '');
  const [category, setCategory] = useState(() => searchParams.get('category') || '');
  const [sort, setSort] = useState(() => searchParams.get('sort') || 'date,asc');
  const [page, setPage] = useState(() => {
    const p = searchParams.get('page');
    return p ? parseInt(p, 10) : 0;
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Debounced city for API calls (350ms)
  const debouncedCity = useDebounce(cityInput, DEBOUNCE_DELAY);

  // Sync state to URL search parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedCity) params.set('city', debouncedCity);
    if (category) params.set('category', category);
    if (sort && sort !== 'date,asc') params.set('sort', sort);
    if (page > 0) params.set('page', page.toString());

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(url, { scroll: false });
  }, [debouncedCity, category, sort, page, pathname, router]);

  // Fetch events
  const { events, pagination, isLoading, isRefetching, error, hasQuery } = useEvents({
    city: debouncedCity,
    category: category || undefined,
    page,
    size: PAGE_SIZE,
    sort,
  });

  // Handlers
  const handleCityChange = useCallback((value: string) => {
    setCityInput(value);
    setPage(0); // Reset page on new search
  }, []);

  const handleCategoryChange = useCallback((cat: string) => {
    setCategory(cat);
    setPage(0);
  }, []);

  const handleSortChange = useCallback((newSort: string) => {
    setSort(newSort);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePopularCity = (city: string) => {
    setCityInput(city);
    setPage(0);
  };

  const isEmpty = hasQuery && !isLoading && events.length === 0;

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Ambient Glowing Blobs & Grid Pattern */}
      <div className="absolute top-0 inset-x-0 h-[650px] overflow-hidden pointer-events-none z-0">
        <div className="grid-bg-overlay" />
        <div className="ambient-glow-1 top-[-10%] left-[10%]" />
        <div className="ambient-glow-2 top-[20%] right-[5%]" />
      </div>

      <Header />

      <main className="flex-1 page-container py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8 md:space-y-10 relative z-10">

        {/* Hero Section */}
        <section className="text-center space-y-4 pt-6 sm:pt-12 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                           border border-[var(--border-strong)] text-xs sm:text-sm text-[var(--text-secondary)] mb-4 sm:mb-6 bg-[var(--bg-secondary)]/40 backdrop-blur-sm shadow-sm">
              <TrendingUp size={14} className="text-[var(--accent-primary)] animate-pulse" />
              <span className="font-semibold tracking-wide">Discover live events worldwide</span>
            </div>

            <h2
              className="block px-2 tracking-tight"
              style={{
                fontSize: 'clamp(calc(var(--title-size, 28px) * 1.15), 6.5vw, calc(var(--title-size, 28px) * 1.8))',
                fontWeight: 'var(--title-weight, 900)',
                lineHeight: 1.05,
                wordBreak: 'break-word',
                letterSpacing: '-0.04em',
              }}
            >
              <span className="text-[var(--text-primary)]">Find Your Next</span> <br className="hidden sm:block" />
              <span className="gradient-text" style={{ fontWeight: 'var(--title-weight, 900)' }}>Live Experience</span>
            </h2>

            <p
              className="text-[var(--text-secondary)] mt-4 sm:mt-5 max-w-xl mx-auto px-4"
              style={{
                fontSize: 'clamp(14px, 2vw, 17px)',
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Search concerts, sports, theatre, comedy shows and more in any city worldwide.
            </p>
          </motion.div>
        </section>

        {/* Search Bar */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto w-full space-y-3 sm:space-y-4 px-1"
        >
          <SearchBar
            cityValue={cityInput}
            onCityChange={handleCityChange}
            isLoading={isLoading || isRefetching}
            placeholder="Search city (e.g. New York, London, Tokyo...)"
          />

          {/* Popular cities tags under SearchBar */}
          {!hasQuery && (
            <div className="flex flex-wrap gap-2 justify-center pt-1">
              <span className="text-xs text-[var(--text-muted)] self-center">Popular:</span>
              {POPULAR_CITIES.slice(0, 6).map((city) => (
                <button
                  key={city}
                  id={`popular-city-${city.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => handlePopularCity(city)}
                  className="text-xs px-3 py-1.5 rounded-full border border-[var(--border-color)]
                             text-[var(--text-secondary)] hover:border-[var(--accent-primary)]
                             hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50 transition-all duration-150 cursor-pointer"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </motion.section>

        {/* Filters */}
        {hasQuery && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 animate-fade-in"
          >
            <CategoryFilter
              selected={category || 'all'}
              onChange={handleCategoryChange}
            />

            {/* Sort + Results count row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
              <p className="text-sm text-[var(--text-muted)]">
                {isLoading ? (
                  <span className="skeleton inline-block h-4 w-32 rounded" />
                ) : pagination ? (
                  <>
                    <span className="text-[var(--text-primary)] font-medium">
                      {pagination.total_elements.toLocaleString()}
                    </span>{' '}
                    events found in{' '}
                    <span className="text-[var(--accent-primary)] font-medium">
                      {debouncedCity}
                    </span>
                  </>
                ) : null}
              </p>

              {/* Sort select */}
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                aria-label="Sort events"
                className="input-base text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 cursor-pointer w-full sm:w-auto"
                style={{ borderRadius: 'var(--border-radius)' }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.section>
        )}

        {/* Content Area */}
        <section aria-live="polite" aria-atomic="false">

          {/* Loading skeleton */}
          {isLoading && <EventSkeleton count={PAGE_SIZE} />}

          {/* Error state */}
          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center gap-4 py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20
                             flex items-center justify-center">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Something went wrong
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm">
                  {(error as ApiError)?.message || 'Failed to fetch events. Please try again.'}
                </p>
              </div>
              <button
                onClick={() => handleCityChange(cityInput)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 cursor-pointer"
                style={{ background: 'var(--accent-gradient)' }}
              >
                Retry
              </button>
            </motion.div>
          )}

          {/* Empty state */}
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center gap-4 py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)]
                             flex items-center justify-center text-3xl">
                <Frown size={32} className="text-[var(--text-muted)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  No events found
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  Try a different city or clear the category filter.
                </p>
              </div>
              <button
                onClick={() => {
                  setCategory('');
                  setPage(0);
                }}
                className="px-5 py-2.5 rounded-lg text-sm font-medium border border-[var(--border-color)]
                           text-[var(--text-secondary)] hover:border-[var(--accent-primary)] transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            </motion.div>
          )}

          {/* Welcome / city cards grid state */}
          {!hasQuery && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-full"
            >
              <CityCardGrid onCitySelect={handlePopularCity} />
            </motion.div>
          )}

          {/* Events grid */}
          {hasQuery && !isLoading && events.length > 0 && (
            <EventGrid
              events={events}
              onEventClick={setSelectedEvent}
            />
          )}
        </section>

        {/* Pagination */}
        {hasQuery && pagination && !isLoading && events.length > 0 && (
          <section className="pt-8">
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </section>
        )}
      </main>

      <Footer />

      {/* Event Detail Modal */}
      <EventDetail
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]" style={{ color: 'var(--text-secondary)' }}>
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold tracking-wide">Loading EventSphere...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}

