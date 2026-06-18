'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Search, X, MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SearchBarProps {
  cityValue: string;
  onCityChange: (value: string) => void;
  keywordValue?: string;
  onKeywordChange?: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

const SUGGESTION_CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'London', 'Toronto',
  'Sydney', 'Miami', 'Las Vegas', 'Austin', 'Nashville',
  'San Francisco', 'San Diego', 'Seattle', 'Boston', 'Philadelphia',
  'Washington DC', 'Atlanta', 'Dallas', 'Houston', 'Denver',
  'Phoenix', 'Orlando', 'Paris', 'Tokyo', 'Rome', 'Berlin',
  'Amsterdam', 'Barcelona', 'Vancouver', 'Montreal', 'Melbourne',
  'Singapore', 'Mumbai', 'New Delhi', 'Bangalore', 'Dubai'
];

export function SearchBar({
  cityValue,
  onCityChange,
  keywordValue = '',
  onKeywordChange,
  isLoading = false,
  placeholder = 'Search city (e.g. New York, London...)',
  className,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleClear = () => {
    onCityChange('');
    inputRef.current?.focus();
  };

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestion list based on typing
  const query = cityValue.trim().toLowerCase();
  const filteredSuggestions = query
    ? SUGGESTION_CITIES.filter(city => 
        city.toLowerCase().includes(query) && 
        city.toLowerCase() !== query
      ).slice(0, 5)
    : [];

  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative w-full transition-all duration-300 p-[1px]',
        isFocused ? 'search-glow-active' : 'hover:border-[var(--border-strong)]',
        className
      )}
      style={{ 
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border-color)',
        background: isFocused 
          ? 'var(--accent-gradient)' 
          : 'linear-gradient(135deg, var(--border-color) 0%, transparent 100%)',
        boxShadow: isFocused 
          ? '0 20px 40px -10px var(--accent-glow)' 
          : '0 8px 30px -10px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* City Search Input Container */}
      <div 
        className="relative w-full bg-[var(--bg-secondary)] backdrop-blur-xl overflow-hidden flex items-center"
        style={{ borderRadius: 'calc(var(--border-radius) - 1px)' }}
      >
        {/* Left icon wrapper */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div 
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300",
              isFocused ? "bg-[var(--accent-glow)] border border-[var(--border-color)]" : "bg-white/5"
            )}
          >
            {isLoading ? (
              <Loader2
                size={18}
                className="text-[var(--accent-primary)] animate-spin"
              />
            ) : (
              <MapPin
                size={18}
                className={cn(
                  "transition-all duration-300",
                  isFocused ? "text-[var(--accent-primary)] scale-110" : "text-[var(--text-secondary)]"
                )}
              />
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          id="city-search-input"
          type="text"
          value={cityValue}
          onChange={(e) => {
            onCityChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className={cn(
            'w-full py-5.5 pl-16 pr-24 sm:pr-32 text-base bg-transparent border-0 outline-none',
            'text-[var(--text-primary)] placeholder-[var(--text-secondary)]/70 font-medium',
            'focus:ring-0 transition-all duration-200'
          )}
          aria-label="Search city"
        />

        {/* Clear button */}
        {cityValue && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className={cn(
              "absolute top-1/2 -translate-y-1/2 p-1.5 rounded-full z-10",
              "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
              "hover:bg-white/10 transition-all duration-150 cursor-pointer",
              "right-14 sm:right-32"
            )}
          >
            <X size={16} />
          </button>
        )}

        {/* Sleek integrated Explore/Search button */}
        <button
          onClick={() => {
            if (inputRef.current) {
              onCityChange(inputRef.current.value);
              setShowSuggestions(false);
            }
          }}
          type="button"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2.5 text-sm font-bold text-white flex items-center gap-1.5 transition-all duration-300 cursor-pointer active:scale-95 shadow-md hover:shadow-lg hover:shadow-violet-500/10 z-10"
          style={{
            background: 'var(--accent-gradient)',
            borderRadius: 'calc(var(--border-radius) - 5px)',
          }}
        >
          <Search size={14} className="stroke-[2.5]" />
          <span className="hidden sm:inline">Explore</span>
        </button>
      </div>

      {/* Autocomplete Suggestions Dropdown with cutting edges and rotation tilts */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-[108%] p-[1.5px] z-50 shadow-2xl"
            style={{
              borderRadius: 'var(--border-radius)',
              clipPath: 'polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)',
              background: 'var(--accent-gradient)',
            }}
          >
            <div 
              className="bg-[var(--bg-secondary)] p-2 flex flex-col gap-1 w-full"
              style={{
                clipPath: 'polygon(15px 0%, 100% 0%, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0% 100%, 0% 15px)',
              }}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-[var(--text-tertiary)] uppercase text-left">
                Suggested Cities
              </div>
              {filteredSuggestions.map((city, idx) => {
                const itemTilt = idx % 2 === 0 ? 0.8 : -0.8;
                return (
                  <motion.button
                    key={city}
                    type="button"
                    onClick={() => {
                      onCityChange(city);
                      setShowSuggestions(false);
                    }}
                    whileHover={{ 
                      scale: 1.015,
                      rotate: itemTilt,
                      x: 4,
                      transition: { duration: 0.15, ease: 'easeOut' }
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--text-primary)] hover:bg-[var(--accent-gradient)] hover:text-white transition-colors duration-150 flex items-center justify-between group/item cursor-pointer"
                    style={{ borderRadius: 'calc(var(--border-radius) - 5px)' }}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-[var(--text-tertiary)] group-hover/item:text-white transition-colors" />
                      <span className="font-semibold">{city}</span>
                    </div>
                    <span className="text-[10px] opacity-0 group-hover/item:opacity-100 transition-opacity text-white/95 mr-2">
                      Explore events &rarr;
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



