'use client';

import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type DropdownOption = Readonly<{
  label: string;
  value: string;
}>;

type DropdownSelectProps = Readonly<{
  options: readonly DropdownOption[];
  value?: string;
  defaultValue?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}>;

export function DropdownSelect({
  options,
  value,
  defaultValue,
  name,
  onValueChange,
  className = ''
}: DropdownSelectProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const initialValue = value ?? defaultValue ?? options[0]?.value ?? '';
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const currentValue = value ?? selectedValue;
  const selectedOption = options.find((option) => option.value === currentValue) ?? options[0];

  const selectValue = (nextValue: string) => {
    if (value === undefined) {
      setSelectedValue(nextValue);
    }
    onValueChange?.(nextValue);
    detailsRef.current?.removeAttribute('open');
  };

  return (
    <details ref={detailsRef} className={`group relative ${className}`}>
      <summary className="form-control flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <span>{selectedOption?.label}</span>
        <ChevronDown aria-hidden className="text-default-tertiary-label size-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-default-separator bg-default-surface absolute inset-x-0 top-[calc(100%+0.35rem)] z-30 max-h-[min(20rem,calc(100dvh-16rem))] overflow-y-auto overscroll-contain border p-1 shadow-lg">
        {options.map((option) => (
          <button
            key={option.value}
            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${currentValue === option.value ? 'bg-default-fill text-default-label font-semibold' : 'text-default-secondary-label hover:bg-default-fill hover:text-default-label'}`}
            type="button"
            onClick={() => selectValue(option.value)}
          >
            {option.label}
            {currentValue === option.value ? <span aria-hidden>·</span> : null}
          </button>
        ))}
      </div>
      {name ? <input name={name} type="hidden" value={currentValue} /> : null}
    </details>
  );
}
