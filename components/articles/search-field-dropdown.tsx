'use client';

import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const options = [
  { label: '제목', value: 'title' },
  { label: '내용', value: 'content' },
  { label: '작성자', value: 'createdBy' }
] as const;

export function SearchFieldDropdown({
  defaultValue = 'title'
}: Readonly<{ defaultValue?: string }>) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [selectedValue, setSelectedValue] = useState(
    options.some((option) => option.value === defaultValue) ? defaultValue : 'title'
  );
  const selectedOption = options.find((option) => option.value === selectedValue) ?? options[0];

  return (
    <details ref={detailsRef} className="group relative">
      <summary className="form-control flex h-10 cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <span>{selectedOption.label}</span>
        <ChevronDown className="text-default-tertiary-label size-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-default-separator bg-default-surface absolute inset-x-0 top-[calc(100%+0.35rem)] z-20 border p-1 shadow-lg">
        {options.map((option) => (
          <button
            key={option.value}
            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${selectedValue === option.value ? 'bg-default-fill text-default-label font-semibold' : 'text-default-secondary-label hover:bg-default-fill hover:text-default-label'}`}
            type="button"
            onClick={() => {
              setSelectedValue(option.value);
              detailsRef.current?.removeAttribute('open');
            }}
          >
            {option.label}
            {selectedValue === option.value ? <span aria-hidden>·</span> : null}
          </button>
        ))}
      </div>
      <input name="keyField" type="hidden" value={selectedValue} />
    </details>
  );
}
