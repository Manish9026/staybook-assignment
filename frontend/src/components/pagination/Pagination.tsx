'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { PaginationMeta } from '../../types/events';
import { cn } from '../../lib/utils';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ pagination, onPageChange, className }: PaginationProps) {
  const { current_page, total_pages, total_elements, page_size, has_next, has_previous } = pagination;

  const handlePage = (page: number) => {
    if (page < 0 || page >= total_pages) return;
    onPageChange(page);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build page number window (max 5 visible)
  const getPageNumbers = (): (number | '...')[] => {
    if (total_pages <= 7) {
      return Array.from({ length: total_pages }, (_, i) => i);
    }
    const pages: (number | '...')[] = [0];
    if (current_page > 3) pages.push('...');
    const start = Math.max(1, current_page - 1);
    const end = Math.min(total_pages - 2, current_page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current_page < total_pages - 4) pages.push('...');
    pages.push(total_pages - 1);
    return pages;
  };

  if (total_pages <= 1) return null;

  const pageNumbers = getPageNumbers();
  const startItem = current_page * page_size + 1;
  const endItem = Math.min((current_page + 1) * page_size, total_elements);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('flex flex-col items-center gap-4', className)}
    >
      {/* Info text */}
      <p className="text-sm text-[var(--text-muted)]">
        Showing{' '}
        <span className="font-medium text-[var(--text-secondary)]">
          {startItem}–{endItem}
        </span>{' '}
        of{' '}
        <span className="font-medium text-[var(--text-secondary)]">
          {total_elements.toLocaleString()}
        </span>{' '}
        events
      </p>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5" role="navigation" aria-label="Pagination">
        {/* Prev */}
        <button
          id="pagination-prev"
          onClick={() => handlePage(current_page - 1)}
          disabled={!has_previous}
          aria-label="Previous page"
          className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)]
                     hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, idx) =>
          page === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-3 py-2 text-sm text-[var(--text-muted)]"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              id={`pagination-page-${page}`}
              onClick={() => handlePage(page as number)}
              aria-label={`Go to page ${(page as number) + 1}`}
              aria-current={page === current_page ? 'page' : undefined}
              className={cn(
                'min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium border transition-all duration-150',
                page === current_page
                  ? 'text-white border-transparent'
                  : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]'
              )}
              style={
                page === current_page
                  ? { background: 'var(--accent-gradient)' }
                  : {}
              }
            >
              {(page as number) + 1}
            </button>
          )
        )}

        {/* Next */}
        <button
          id="pagination-next"
          onClick={() => handlePage(current_page + 1)}
          disabled={!has_next}
          aria-label="Next page"
          className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)]
                     hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}
