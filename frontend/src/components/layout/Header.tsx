'use client';

import React, { useState } from 'react';
import { Settings, Zap } from 'lucide-react';
import { SettingsModal } from '../settings/SettingsModal';
import { useAppearanceStore } from '../../store/appearanceStore';

export function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings } = useAppearanceStore();

  const isLight = settings.theme === 'light';

  return (
    <>
      <header
        className="sticky top-0 z-30 w-full border-b border-[var(--border-color)]"
        style={{
          background: 'var(--bg-primary)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--accent-gradient)' }}
              >
                <Zap size={18} className="text-white" />
              </div>
              <div>
                <h1
                  className="gradient-text leading-none"
                  style={{
                    fontSize: 'clamp(14px, 3vw, var(--title-size, 20px))',
                    fontWeight: 'var(--title-weight, 700)',
                  }}
                >
                  EventSphere
                </h1>
                <p
                  className="text-[var(--text-muted)] leading-none mt-0.5 hidden xs:block"
                  style={{
                    fontSize: 'clamp(8px, 1.5vw, calc(var(--subtitle-size, 14px) * 0.75))',
                    fontWeight: 'var(--subtitle-weight, 400)',
                  }}
                >
                  Discover live events worldwide
                </p>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button
                id="header-settings-btn"
                onClick={() => setSettingsOpen(true)}
                aria-label="Open appearance settings"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-color)]
                           text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                           hover:border-[var(--accent-primary)] transition-all duration-200
                           text-sm font-medium"
              >
                <Settings size={16} />
                <span className="hidden sm:inline">Appearance</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
