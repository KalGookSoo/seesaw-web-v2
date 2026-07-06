'use client';

import type { ReactNode } from 'react';
import { useEffect, useId } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg';

const modalSizeClassNames: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-3xl'
};

export function Modal({
  children,
  description,
  footer,
  onClose,
  open,
  size = 'md',
  title
}: Readonly<{
  children: ReactNode;
  description?: string;
  footer?: ReactNode;
  onClose: () => void;
  open: boolean;
  size?: ModalSize;
  title: string;
}>) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-sm" role="presentation">
      <button className="absolute inset-0 cursor-default" type="button" aria-label="모달 닫기" onClick={onClose} />
      <section
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={`relative w-full ${modalSizeClassNames[size]} border-default-separator bg-default-surface overflow-hidden rounded-xl border shadow-2xl`}
        role="dialog"
      >
        <header className="border-default-separator flex items-start justify-between gap-4 border-b px-5 py-4">
          <div>
            <h2 id={titleId} className="text-default-label text-base font-semibold">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="text-default-secondary-label mt-1 text-sm leading-6">
                {description}
              </p>
            ) : null}
          </div>
          <button
            className="text-default-tertiary-label hover:bg-default-fill hover:text-default-label rounded-md px-2 text-2xl leading-none transition"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="px-5 py-5">{children}</div>
        {footer ? (
          <footer className="border-default-separator bg-default-surface-grouped flex justify-end gap-2 border-t px-5 py-4">{footer}</footer>
        ) : null}
      </section>
    </div>
  );
}
