'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function LazyImage({ 
  src, 
  alt, 
  className, 
  fallbackSrc, 
  ...props 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // High-quality event fallback cover image from Unsplash
  const defaultFallback = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop';

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  const currentSrc = hasError ? (fallbackSrc || defaultFallback) : (src || defaultFallback);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[var(--bg-tertiary)]">
      {/* Background Skeleton Shimmer */}
      {!isLoaded && (
        <div 
          className="skeleton absolute inset-0 z-0 w-full h-full"
          style={{ borderRadius: 'inherit' }}
        />
      )}

      {/* Styled Image */}
      <img
        src={currentSrc}
        alt={alt || 'Image'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-all duration-700 ease-out",
          isLoaded 
            ? "opacity-100 scale-100 blur-0" 
            : "opacity-0 scale-105 blur-[8px]",
          className
        )}
        {...props}
      />
    </div>
  );
}
