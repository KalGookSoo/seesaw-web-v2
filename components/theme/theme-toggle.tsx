'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'seesaw-theme';

function getSystemTheme(): ThemeMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTheme(): ThemeMode {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : getSystemTheme();
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      className="border-default-separator bg-default-surface text-default-label hover:bg-default-fill inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium shadow-sm transition"
      type="button"
      aria-pressed={theme === 'dark'}
      onClick={toggleTheme}
    >
      <span className="bg-default-blue size-2 rounded-full" />
      {theme === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
}
