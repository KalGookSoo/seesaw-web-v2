'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

type Option = Readonly<{ value: string; label: string }>;

export function MonochromeDropdown({
  label,
  options,
  defaultValue
}: Readonly<{
  label: string;
  options: readonly Option[];
  defaultValue: string;
}>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div ref={containerRef} className="relative space-y-2">
      <span className="block text-sm font-semibold text-[var(--monochrome-label)]">{label}</span>
      <button
        className="flex h-10 w-full items-center justify-between border border-[var(--monochrome-separator)] bg-[var(--monochrome-surface)] px-3 text-left text-sm text-[var(--monochrome-label)] outline-none transition-colors hover:border-[var(--monochrome-line)] focus:border-[var(--monochrome-accent)] focus:ring-2 focus:ring-[var(--monochrome-accent-soft)]"
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        <span>{selectedOption.label}</span>
        <ChevronDown className={`size-4 text-[var(--monochrome-tertiary-label)] transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute z-10 mt-1 w-full border border-[var(--monochrome-line)] bg-[var(--monochrome-surface-elevated)] p-1 shadow-[0_8px_20px_rgb(32_34_31_/_0.12)]" role="listbox" aria-label={label}>
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-[var(--monochrome-label)] transition-colors hover:bg-[var(--monochrome-fill)]"
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setValue(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
                {selected ? <Check className="size-4 text-[var(--monochrome-accent)]" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
