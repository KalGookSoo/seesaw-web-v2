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
  title,
  variant = 'default'
}: Readonly<{
  children: ReactNode;
  description?: string;
  footer?: ReactNode;
  onClose: () => void;
  open: boolean;
  size?: ModalSize;
  title: string;
  variant?: 'default' | 'editorial';
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
    <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 py-6 ${variant === 'editorial' ? 'bg-default-label/20' : 'bg-black/30'}`} role="presentation">
      <button className="absolute inset-0 cursor-default" type="button" aria-label="모달 닫기" onClick={onClose} />
      <section
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={`relative w-full ${modalSizeClassNames[size]} border-default-separator bg-default-surface overflow-visible border ${variant === 'editorial' ? 'rounded-none' : 'rounded-xl shadow-2xl'}`}
        role="dialog"
      >
        <header className={`border-default-separator flex items-start justify-between gap-4 border-b px-5 py-4 ${variant === 'editorial' ? 'px-5 py-5' : ''}`}>
          <div>
            <h2 id={titleId} className={`text-default-label font-semibold ${variant === 'editorial' ? 'text-xl font-black tracking-[-0.04em]' : 'text-base'}`}>
              {title}
            </h2>
            {description ? (
            <p id={descriptionId} className="text-default-secondary-label mt-2 text-sm leading-6">
                {description}
              </p>
            ) : null}
          </div>
          <button
            className="text-default-tertiary-label hover:bg-default-fill hover:text-default-label inline-flex size-8 items-center justify-center text-2xl leading-none transition"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className={`${variant === 'editorial' ? 'px-5 py-5' : 'px-5 py-5'}`}>{children}</div>
        {footer ? (
          <footer className={`border-default-separator bg-default-surface-grouped flex flex-wrap justify-end gap-3 border-t px-5 py-4 ${variant === 'editorial' ? 'bg-default-surface px-5 py-5' : ''}`}>{footer}</footer>
        ) : null}
      </section>
    </div>
  );
}
