'use client';

import React from 'react';
import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-10 sm:mt-20 border-t border-[var(--border-color)] py-6 sm:py-10">
      <div className="page-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent-gradient)' }}
            >
              <Zap size={14} className="text-white" />
            </div>
            <span className="gradient-text font-bold text-sm">EventSphere</span>
          </div>

          <p className="text-sm text-[var(--text-muted)] text-center">
            Powered by{' '}
            <a
              href="https://developer.ticketmaster.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-secondary)] hover:underline"
            >
              Ticketmaster Discovery API
            </a>
          </p>

          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <span>Built with Next.js + FastAPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
