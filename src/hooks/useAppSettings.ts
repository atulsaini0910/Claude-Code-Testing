import { useState, useCallback, useEffect } from 'react';
import { db } from '../lib/storage';
import type { AppSettings } from '../types';

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => db.settings.get());

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    const updated = { ...db.settings.get(), ...patch };
    setSettings(updated);
    db.settings.set(updated);
  }, []);

  const toggleTheme = useCallback(() => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  }, [settings.theme, updateSettings]);

  return { settings, updateSettings, toggleTheme };
}
