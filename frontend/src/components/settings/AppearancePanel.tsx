'use client';

import React from 'react';
import { useAppearanceStore } from '../../store/appearanceStore';
import {
  AppTheme,
  FontFamily,
  ShadowIntensity,
} from '../../types/events';
import { THEMES, FONTS } from '../../lib/constants';
import { cn } from '../../lib/utils';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-[var(--text-muted)] px-5">
        {title}
      </h3>
      <div className="px-5">{children}</div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  id,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  id: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <label htmlFor={id} className="text-[var(--text-secondary)]">
          {label}
        </label>
        <span className="font-mono text-[var(--accent-secondary)] text-xs">
          {value}{unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--accent-primary) ${((value - min) / (max - min)) * 100}%, var(--input-border) 0%)`,
        }}
      />
    </div>
  );
}

export function AppearancePanel() {
  const { settings, updateSettings } = useAppearanceStore();

  return (
    <div className="py-4 space-y-7">
      {/* Theme Settings */}
      <Section title="Theme">
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              id={`theme-btn-${theme.id}`}
              onClick={() => updateSettings({ theme: theme.id })}
              aria-pressed={settings.theme === theme.id}
              className={cn(
                'relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-150',
                settings.theme === theme.id
                  ? 'border-[var(--accent-primary)] scale-[1.02]'
                  : 'border-[var(--border-color)] hover:border-[var(--border-strong)]'
              )}
            >
              {/* Color swatches */}
              <div className="flex gap-1">
                {theme.preview.map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-xs text-[var(--text-secondary)]">{theme.label}</span>
              {settings.theme === theme.id && (
                <div
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: 'var(--accent-primary)' }}
                />
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* Font Settings */}
      <Section title="Font Family">
        <div className="flex flex-col gap-1.5">
          {FONTS.map((font) => (
            <button
              key={font}
              id={`font-btn-${font.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => updateSettings({ font: font as FontFamily })}
              aria-pressed={settings.font === font}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition-all duration-150',
                settings.font === font
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--text-primary)]'
                  : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
              )}
              style={{ fontFamily: `'${font}', sans-serif` }}
            >
              <span>{font}</span>
              {settings.font === font && (
                <span className="text-[var(--accent-primary)] text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* Typography Settings */}
      <Section title="Typography">
        <div className="space-y-4">
          <SliderRow
            id="title-size-slider"
            label="Title Size"
            value={settings.titleSize}
            min={16}
            max={48}
            unit="px"
            onChange={(v) => updateSettings({ titleSize: v })}
          />
          <SliderRow
            id="title-weight-slider"
            label="Title Weight"
            value={settings.titleWeight}
            min={400}
            max={900}
            step={100}
            onChange={(v) => updateSettings({ titleWeight: v })}
          />
          <SliderRow
            id="subtitle-size-slider"
            label="Subtitle Size"
            value={settings.subtitleSize}
            min={12}
            max={32}
            unit="px"
            onChange={(v) => updateSettings({ subtitleSize: v })}
          />
          <SliderRow
            id="subtitle-weight-slider"
            label="Subtitle Weight"
            value={settings.subtitleWeight}
            min={300}
            max={700}
            step={100}
            onChange={(v) => updateSettings({ subtitleWeight: v })}
          />
        </div>
      </Section>

      {/* Layout & Effects Settings */}
      <Section title="Layout & Effects">
        <div className="space-y-4">
          <SliderRow
            id="border-radius-slider"
            label="Border Radius"
            value={settings.borderRadius}
            min={0}
            max={24}
            unit="px"
            onChange={(v) => updateSettings({ borderRadius: v })}
          />

          {/* Shadow Intensity */}
          <div className="space-y-2">
            <span className="text-sm text-[var(--text-secondary)]">Shadow Intensity</span>
            <div className="flex gap-2">
              {(['none', 'soft', 'medium', 'strong'] as ShadowIntensity[]).map((s) => (
                <button
                  key={s}
                  id={`shadow-${s}`}
                  onClick={() => updateSettings({ shadowIntensity: s })}
                  aria-pressed={settings.shadowIntensity === s}
                  className={cn(
                    'flex-1 py-1.5 rounded-lg border text-xs capitalize transition-all duration-150',
                    settings.shadowIntensity === s
                      ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Toggle Features */}
      <Section title="Features">
        <div className="space-y-3">
          {/* Glassmorphism toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Glassmorphism</span>
            <button
              id="toggle-glass"
              role="switch"
              aria-checked={settings.cardGlassmorphism}
              onClick={() => updateSettings({ cardGlassmorphism: !settings.cardGlassmorphism })}
              className={cn(
                'relative w-11 h-6 rounded-full transition-colors duration-200',
                settings.cardGlassmorphism
                  ? 'bg-[var(--accent-primary)]'
                  : 'bg-[var(--border-strong)]'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200',
                  settings.cardGlassmorphism ? 'left-6' : 'left-1'
                )}
              />
            </button>
          </div>

          {/* Animations toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Animations</span>
            <button
              id="toggle-animations"
              role="switch"
              aria-checked={settings.animationsEnabled}
              onClick={() => updateSettings({ animationsEnabled: !settings.animationsEnabled })}
              className={cn(
                'relative w-11 h-6 rounded-full transition-colors duration-200',
                settings.animationsEnabled
                  ? 'bg-[var(--accent-primary)]'
                  : 'bg-[var(--border-strong)]'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200',
                  settings.animationsEnabled ? 'left-6' : 'left-1'
                )}
              />
            </button>
          </div>
        </div>
      </Section>

      {/* Live preview */}
      <Section title="Preview">
        <div
          className="p-4 rounded-xl border border-[var(--border-color)]"
          style={{ background: 'var(--glass-bg, var(--card-glass-bg))' }}
        >
          <p
            style={{
              fontFamily: `'${settings.font}', sans-serif`,
              fontSize: settings.titleSize * 0.65 + 'px',
              fontWeight: settings.titleWeight,
              color: 'var(--text-primary)',
            }}
          >
            Event Title Preview
          </p>
          <p
            style={{
              fontFamily: `'${settings.font}', sans-serif`,
              fontSize: settings.subtitleSize * 0.75 + 'px',
              fontWeight: settings.subtitleWeight,
              color: 'var(--text-secondary)',
              marginTop: '4px',
            }}
          >
            Venue · City · Date
          </p>
        </div>
      </Section>
    </div>
  );
}
