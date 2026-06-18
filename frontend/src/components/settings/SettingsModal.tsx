'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import { useAppearanceStore } from '../../store/appearanceStore';
import { AppearancePanel } from './AppearancePanel';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { resetSettings } = useAppearanceStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="settings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Slide-in panel from right */}
          <motion.div
            key="settings-panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            role="dialog"
            aria-modal="true"
            aria-label="Appearance Settings"
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm flex flex-col"
            style={{
              background: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border-color)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-5 border-b"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div>
                <h2 className="font-bold text-[var(--text-primary)]">
                  Appearance
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Customize your experience
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="settings-reset-btn"
                  onClick={resetSettings}
                  aria-label="Reset to defaults"
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]
                             hover:bg-white/5 transition-all duration-150"
                  title="Reset to defaults"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  id="settings-close-btn"
                  onClick={onClose}
                  aria-label="Close settings"
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]
                             hover:bg-white/5 transition-all duration-150"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <AppearancePanel />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
