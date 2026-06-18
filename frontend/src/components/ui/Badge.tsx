'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  className?: string;
}

const BADGE_VARIANTS = {
  default: 'bg-white/10 text-white/80 border border-white/20',
  accent: 'bg-gradient-to-r from-violet-500 to-purple-500 text-white',
  success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
  ghost: 'bg-transparent text-[var(--text-secondary)] border border-[var(--border-color)]',
};

const BADGE_SIZES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        BADGE_VARIANTS[variant],
        BADGE_SIZES[size],
        className
      )}
    >
      {children}
    </span>
  );
}
