'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

import { LazyImage } from '../ui/LazyImage';

interface CityData {
  name: string;
  image: string;
  tagline: string;
  count: string;
}

const CITIES: CityData[] = [
  {
    name: 'New York',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600&auto=format&fit=crop',
    tagline: 'The city that never sleeps',
    count: 'Concerts & Broadway Shows',
  },
  {
    name: 'Los Angeles',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    tagline: 'Entertainment capital of the world',
    count: 'Premier Live & Comedy Shows',
  },
  {
    name: 'Chicago',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=600&auto=format&fit=crop',
    tagline: 'Stunning architecture & rich jazz culture',
    count: 'Sports & Live Music Festivals',
  },
  {
    name: 'London',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop',
    tagline: 'Royal history meets modern vibes',
    count: 'Theatre, Arenas & Festivals',
  },
  {
    name: 'Sydney',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=600&auto=format&fit=crop',
    tagline: 'Sun-drenched harbor and landmark venues',
    count: 'Opera, Arts & Live Events',
  },
  {
    name: 'Miami',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop',
    tagline: 'Vibrant beaches and electric nightlife',
    count: 'Dance Music & Grand Arenas',
  },
  {
    name: 'Las Vegas',
    image: 'https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?q=80&w=600&auto=format&fit=crop',
    tagline: 'Spectacular neon lights and mega-residencies',
    count: 'World-class Arenas & Shows',
  },
  {
    name: 'Nashville',
    image: 'https://images.unsplash.com/photo-1532960401447-7dd05bef20b0?q=80&w=600&auto=format&fit=crop',
    tagline: 'The heart and home of live country music',
    count: 'Honky Tonks & Stadium Tours',
  }
];

// Stable predefined tilt angles to prevent hydration mismatches
const TILT_ANGLES = [-2.5, 1.8, -1.5, 2.2, -2.0, 1.2, -1.8, 2.5];

interface CityCardGridProps {
  onCitySelect: (city: string) => void;
}

export function CityCardGrid({ onCitySelect }: CityCardGridProps) {
  return (
    <div className="space-y-6 pt-4 sm:pt-8">
      {/* Title */}
      <div className="text-center sm:text-left flex items-center justify-center sm:justify-start gap-2 px-2">
        <div className="p-1.5 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)]">
          <Compass size={18} className="text-[var(--accent-primary)] animate-pulse" />
        </div>
        <h3 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
          Explore Popular Cities
        </h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
        {CITIES.map((city, index) => {
          const tilt = TILT_ANGLES[index % TILT_ANGLES.length];
          return (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 30, rotate: tilt }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              whileHover={{ 
                rotate: 0, 
                scale: 1.05, 
                zIndex: 10,
                transition: { duration: 0.25, ease: 'easeOut' }
              }}
              onClick={() => onCitySelect(city.name)}
              className="relative group p-[1.5px] cursor-pointer select-none"
              style={{
                clipPath: 'polygon(24px 0%, 100% 0%, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0% 100%, 0% 24px)',
                background: 'var(--border-color)',
                transition: 'background-color 0.3s ease',
              }}
              id={`city-card-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {/* Glowing Gradient Border overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  clipPath: 'polygon(24px 0%, 100% 0%, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0% 100%, 0% 24px)',
                }}
              />

              {/* Inner container */}
              <div
                style={{
                  clipPath: 'polygon(23px 0%, 100% 0%, 100% calc(100% - 23px), calc(100% - 23px) 100%, 0% 100%, 0% 23px)',
                }}
                className="relative bg-[var(--bg-secondary)] h-[240px] w-full overflow-hidden flex flex-col justify-end p-5"
              >
                {/* City Cover Image */}
                <LazyImage
                  src={city.image}
                  alt={city.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-112 ease-out filter brightness-[0.6] group-hover:brightness-[0.75]"
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-90 pointer-events-none" />

                {/* Decorative Cybernetic Corner Highlights */}
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[var(--border-color)] group-hover:border-[var(--accent-secondary)] transition-colors duration-300" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[var(--border-color)] group-hover:border-[var(--accent-primary)] transition-colors duration-300" />

                {/* Content */}
                <div className="relative z-10 space-y-1 text-left">
                  <span className="text-[9px] font-bold tracking-widest text-[var(--accent-secondary)] uppercase">
                    {city.count}
                  </span>
                  <h4 className="text-lg font-extrabold text-[var(--text-primary)] group-hover:text-white transition-colors duration-200">
                    {city.name}
                  </h4>
                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1 group-hover:text-white transition-colors duration-200">
                    {city.tagline}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
