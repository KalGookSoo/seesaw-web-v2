'use client';

import type { CSSProperties, ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

type ThemeColorPlaygroundContextValue = {
  accentColor: string;
  backgroundColor: string;
  initialAccentColor: string;
  initialBackgroundColor: string;
  resetColors: () => void;
  setAccentColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
};

const ThemeColorPlaygroundContext =
  createContext<ThemeColorPlaygroundContextValue | null>(null);

function useThemeColorPlayground() {
  const context = useContext(ThemeColorPlaygroundContext);

  if (!context) {
    throw new Error(
      'ThemeColorControls must be used inside ThemeColorPlayground.'
    );
  }

  return context;
}

export function ThemeColorPlayground({
  children,
  className,
  initialAccentColor,
  initialBackgroundColor
}: Readonly<{
  children: ReactNode;
  className: string;
  initialAccentColor: string;
  initialBackgroundColor: string;
}>) {
  const [accentColor, setAccentColor] = useState(initialAccentColor);
  const [backgroundColor, setBackgroundColor] = useState(
    initialBackgroundColor
  );

  const value = useMemo(
    () => ({
      accentColor,
      backgroundColor,
      initialAccentColor,
      initialBackgroundColor,
      resetColors: () => {
        setAccentColor(initialAccentColor);
        setBackgroundColor(initialBackgroundColor);
      },
      setAccentColor,
      setBackgroundColor
    }),
    [accentColor, backgroundColor, initialAccentColor, initialBackgroundColor]
  );

  const style = {
    '--site-accent': accentColor,
    '--site-background': backgroundColor
  } as CSSProperties;

  return (
    <ThemeColorPlaygroundContext.Provider value={value}>
      <main className={className} style={style}>
        {children}
      </main>
    </ThemeColorPlaygroundContext.Provider>
  );
}

export function ThemeColorControls({
  className,
  inputClassName,
  labelClassName,
  resetButtonClassName,
  title = 'Site colors'
}: Readonly<{
  className: string;
  inputClassName: string;
  labelClassName: string;
  resetButtonClassName: string;
  title?: string;
}>) {
  const {
    accentColor,
    backgroundColor,
    initialAccentColor,
    initialBackgroundColor,
    resetColors,
    setAccentColor,
    setBackgroundColor
  } = useThemeColorPlayground();

  return (
    <section className={className} aria-label="사이트 테마 색상 미리보기">
      <div className="flex items-center justify-between gap-3">
        <p className={labelClassName}>{title}</p>
        <button
          className={resetButtonClassName}
          type="button"
          onClick={resetColors}
        >
          Reset
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center justify-between gap-3">
          <span className={labelClassName}>Theme</span>
          <input
            className={inputClassName}
            type="color"
            value={accentColor}
            aria-label={`테마 색상. 기본값 ${initialAccentColor}`}
            onChange={(event) => setAccentColor(event.target.value)}
          />
        </label>
        <label className="flex items-center justify-between gap-3">
          <span className={labelClassName}>Background</span>
          <input
            className={inputClassName}
            type="color"
            value={backgroundColor}
            aria-label={`배경 색상. 기본값 ${initialBackgroundColor}`}
            onChange={(event) => setBackgroundColor(event.target.value)}
          />
        </label>
      </div>
    </section>
  );
}
