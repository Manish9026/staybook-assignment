import type { Metadata } from 'next';
import './globals.css';
import AppearanceProvider from '../components/providers/AppearanceProvider';

export const metadata: Metadata = {
  title: 'EventSphere — Discover Live Events Worldwide',
  description:
    'Search and explore live events by city. Find concerts, sports, theatre, comedy shows, and more with EventSphere powered by Ticketmaster.',
  keywords: 'events, concerts, live events, ticketmaster, music, sports, theatre',
  openGraph: {
    title: 'EventSphere — Discover Live Events',
    description: 'Find concerts, sports, theatre and more in your city.',
    type: 'website',
  },
};

/**
 * Blocking inline script that runs BEFORE React hydrates.
 * Reads the persisted appearance settings from localStorage
 * and applies theme + CSS custom properties on :root immediately —
 * preventing the "flash of default theme" on reload.
 */
const THEME_INIT_SCRIPT = `
(function() {
  try {
    var raw = localStorage.getItem('events-appearance');
    if (!raw) return;
    var parsed = JSON.parse(raw);
    var s = parsed && parsed.state && parsed.state.settings;
    if (!s) return;
    var d = document.documentElement;
    var st = d.style;
    if (s.theme) d.setAttribute('data-theme', s.theme);
    if (s.font) st.setProperty('--font-family', '"' + s.font + '", sans-serif');
    if (s.borderRadius != null) st.setProperty('--border-radius', s.borderRadius + 'px');
    if (s.titleSize) st.setProperty('--title-size', s.titleSize + 'px');
    if (s.titleWeight) st.setProperty('--title-weight', '' + s.titleWeight);
    if (s.subtitleSize) st.setProperty('--subtitle-size', s.subtitleSize + 'px');
    if (s.subtitleWeight) st.setProperty('--subtitle-weight', '' + s.subtitleWeight);
    var shadows = { none: '0 0 0 transparent', soft: '0 2px 8px rgba(0,0,0,0.2)', medium: '0 4px 20px rgba(0,0,0,0.35)', strong: '0 8px 40px rgba(0,0,0,0.6)' };
    if (s.shadowIntensity && shadows[s.shadowIntensity]) st.setProperty('--card-shadow', shadows[s.shadowIntensity]);
    st.setProperty('--glass-blur', s.cardGlassmorphism ? '20px' : '0px');
    st.setProperty('--glass-bg', s.cardGlassmorphism ? 'var(--card-glass-bg)' : 'var(--card-solid-bg)');
    st.setProperty('--animation-duration', s.animationsEnabled !== false ? '0.3s' : '0s');
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0f" />
        {/* Blocking script — runs before paint to prevent theme flash */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        <AppearanceProvider>{children}</AppearanceProvider>
      </body>
    </html>
  );
}
