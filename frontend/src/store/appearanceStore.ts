'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppearanceSettings } from '../types/events';
import { DEFAULT_APPEARANCE } from '../lib/constants';

interface AppearanceStore {
  settings: AppearanceSettings;
  updateSettings: (partial: Partial<AppearanceSettings>) => void;
  resetSettings: () => void;
}

export const useAppearanceStore = create<AppearanceStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_APPEARANCE,

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),

      resetSettings: () =>
        set({ settings: DEFAULT_APPEARANCE }),
    }),
    {
      name: 'events-appearance',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
