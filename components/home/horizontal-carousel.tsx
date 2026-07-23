'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HorizontalCarousel({
  children,
  className
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(direction: 1 | -1) {
    const node = scrollerRef.current;
    if (!node) {
      return;
    }

    node.scrollBy({
      left: direction * node.clientWidth * 0.85,
      behavior: 'smooth'
    });
  }

  return (
    <div className={`group/carousel relative ${className ?? ''}`}>
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&>*]:shrink-0 [&>*]:snap-start"
      >
        {children}
      </div>
      <button
        type="button"
        aria-label="이전"
        onClick={() => scrollByAmount(-1)}
        className="border-default-separator bg-default-surface text-default-label absolute top-1/2 -left-4 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition hover:scale-105 sm:flex"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        aria-label="다음"
        onClick={() => scrollByAmount(1)}
        className="border-default-separator bg-default-surface text-default-label absolute top-1/2 -right-4 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition hover:scale-105 sm:flex"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
