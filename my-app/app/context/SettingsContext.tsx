'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Settings } from '@/app/types/settings';

const KEY = 'universe-settings';
const DEFAULT: Settings = { theme: 'light', textSize: 100, contrast: 100 };

export const MIN = 100;
export const MAX = 200;
export const STEP = 25;

interface SettingsContextType {
  settings: Settings;
  toggleTheme: () => void;
  setTextSize: (v: number) => void;
  setContrast: (v: number) => void;
  resetToDefaults: () => void;
  isDefault: boolean;
  isOpen: boolean;
  togglePanel: () => void;
  announcement: string;
  announce: (msg: string) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

function applyToDOM(s: Settings) {
  const root = document.documentElement;
  root.setAttribute('data-theme', s.theme);
  root.style.setProperty('--text-scale', `${s.textSize / 100}`);
  root.style.setProperty('--contrast-scale', `${s.contrast / 100}`);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
        applyToDOM(parsed);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initial = { ...DEFAULT, theme: prefersDark ? 'dark' : 'light' } as Settings;
        setSettings(initial);
        applyToDOM(initial);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    applyToDOM(settings);
    try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch {}
  }, [settings, loaded]);

  const announce = useCallback((msg: string) => {
    setAnnouncement('');
    setTimeout(() => setAnnouncement(msg), 50);
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings(s => {
      const next = s.theme === 'light' ? 'dark' : 'light';
      announce(`Dark mode ${next === 'dark' ? 'on' : 'off'}`);
      return { ...s, theme: next };
    });
  }, [announce]);

  const setTextSize = useCallback((v: number) => {
    const clamped = Math.min(MAX, Math.max(MIN, Math.round(v)));
    setSettings(s => ({ ...s, textSize: clamped }));
    announce(`Text size set to ${clamped} percent`);
  }, [announce]);

  const setContrast = useCallback((v: number) => {
    const clamped = Math.min(MAX, Math.max(MIN, Math.round(v)));
    setSettings(s => ({ ...s, contrast: clamped }));
    announce(`Contrast set to ${clamped} percent`);
  }, [announce]);

  const togglePanel = useCallback(() => {
    setIsOpen(o => {
      const next = !o;
      announce(next ? 'Settings panel opened' : 'Settings panel closed');
      return next;
    });
  }, [announce]);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT);
    applyToDOM(DEFAULT);
    announce('Settings reset to defaults');
  }, [announce]);

  const isDefault =
    settings.theme === DEFAULT.theme &&
    settings.textSize === DEFAULT.textSize &&
    settings.contrast === DEFAULT.contrast;

  return (
    <SettingsContext.Provider value={{
      settings,
      toggleTheme,
      setTextSize,
      setContrast,
      resetToDefaults,
      isDefault,
      isOpen,
      togglePanel,
      announcement,
      announce,
    }}>
      {children}
      <div role="status" aria-live="polite" aria-atomic="true" className='sr-only'>
        {announcement}
      </div>
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be inside SettingsProvider');
  return ctx;
}