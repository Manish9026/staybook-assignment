'use client';

import { useEffect } from 'react';
import { useAppearance } from '../../hooks/useAppearance';

/**
 * Client-side provider that initializes the appearance system.
 * Applies CSS custom properties on mount and whenever settings change.
 */
export default function AppearanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useAppearance();
  return <>{children}</>;
}
