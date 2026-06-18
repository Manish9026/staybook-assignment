'use client';

import { useEffect } from 'react';
import { useAppearanceStore } from '../store/appearanceStore';
import { AppearanceSettings, AppTheme, FontFamily, ShadowIntensity } from '../types/events';

const SHADOW_VALUES: Record<ShadowIntensity, string> = {
  none: '0 0 0 transparent',
  soft: '0 2px 8px rgba(0,0,0,0.2)',
  medium: '0 4px 20px rgba(0,0,0,0.35)',
  strong: '0 8px 40px rgba(0,0,0,0.6)',
};

/**
 * Applies appearance settings as CSS custom properties on :root.
 * This enables the entire app to react to theme/font/style changes instantly.
 */
export function useAppearance() {
  const { settings, updateSettings, resetSettings } = useAppearanceStore();

  useEffect(() => {
    const root = document.documentElement;

    // Apply theme class
    root.setAttribute('data-theme', settings.theme);

    // Apply font family
    root.style.setProperty('--font-family', `"${settings.font}", sans-serif`);

    // Apply border radius
    root.style.setProperty('--border-radius', `${settings.borderRadius}px`);

    // Apply shadow
    root.style.setProperty('--card-shadow', SHADOW_VALUES[settings.shadowIntensity]);

    // Apply typography
    root.style.setProperty('--title-size', `${settings.titleSize}px`);
    root.style.setProperty('--title-weight', `${settings.titleWeight}`);
    root.style.setProperty('--subtitle-size', `${settings.subtitleSize}px`);
    root.style.setProperty('--subtitle-weight', `${settings.subtitleWeight}`);

    // Glassmorphism toggle
    root.style.setProperty(
      '--glass-blur',
      settings.cardGlassmorphism ? '20px' : '0px'
    );
    root.style.setProperty(
      '--glass-bg',
      settings.cardGlassmorphism ? 'var(--card-glass-bg)' : 'var(--card-solid-bg)'
    );

    // Animations toggle
    root.style.setProperty(
      '--animation-duration',
      settings.animationsEnabled ? '0.3s' : '0s'
    );
  }, [settings]);

  return { settings, updateSettings, resetSettings };
}
