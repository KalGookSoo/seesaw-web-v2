'use client';

import type { ReactNode } from 'react';
import { useEffect, useId } from 'react';

export type NeoBrutalismAlertVariant =
  'info' | 'success' | 'warning' | 'danger' | 'neutral';

const alertVariantClassNames: Record<NeoBrutalismAlertVariant, string> = {
  info: 'border-[var(--neo-brutalism-accent)] bg-[var(--neo-brutalism-accent-soft)] text-[var(--neo-brutalism-ink)]',
  success:
    'border-[var(--neo-brutalism-success)] bg-[var(--neo-brutalism-success-soft)] text-[var(--neo-brutalism-ink)]',
  warning:
    'border-[var(--neo-brutalism-warning)] bg-[var(--neo-brutalism-warning-soft)] text-[var(--neo-brutalism-ink)]',
  danger:
    'border-[var(--neo-brutalism-danger)] bg-[var(--neo-brutalism-danger-soft)] text-[var(--neo-brutalism-ink)]',
  neutral:
    'border-[var(--neo-brutalism-line)] bg-[var(--neo-brutalism-surface)] text-[var(--neo-brutalism-ink)]'
};

export type NeoBrutalismModalSize = 'sm' | 'md' | 'lg';

const modalSizeClassNames: Record<NeoBrutalismModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-xl',
  lg: 'max-w-4xl'
};

export type NeoBrutalismConfirmTone = 'default' | 'danger';

const confirmButtonClassNames: Record<NeoBrutalismConfirmTone, string> = {
  default:
    'bg-[var(--neo-brutalism-blue)] text-[var(--neo-brutalism-accent-contrast)] hover:-translate-y-0.5',
  danger:
    'bg-[var(--neo-brutalism-red)] text-[var(--neo-brutalism-danger-contrast)] hover:-translate-y-0.5'
};

const neoBrutalismSecondaryButtonClassName =
  'border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-fill)] px-5 py-3 text-sm font-black text-[var(--neo-brutalism-label)] shadow-[3px_3px_0_var(--neo-brutalism-separator)] transition-transform hover:-translate-y-0.5';

export function NeoBrutalismAlert({
  children,
  title,
  variant = 'info'
}: Readonly<{
  children: ReactNode;
  title?: string;
  variant?: NeoBrutalismAlertVariant;
}>) {
  return (
    <div
      className={`border-4 px-4 py-3 shadow-[var(--neo-brutalism-shadow)] ${alertVariantClassNames[variant]}`}
      role="alert"
    >
      {title ? <p className="text-sm font-black uppercase">{title}</p> : null}
      <div
        className={`${title ? 'mt-1' : ''} text-sm leading-6 font-semibold text-[var(--neo-brutalism-secondary-label)]`}
      >
        {children}
      </div>
    </div>
  );
}

export function NeoBrutalismModal({
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
  size?: NeoBrutalismModalSize;
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
      role="presentation"
    >
      <button
        className="absolute inset-0 cursor-default"
        type="button"
        aria-label="모달 닫기"
        onClick={onClose}
      />
      <section
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={`relative w-full ${modalSizeClassNames[size]} border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface-elevated)] shadow-[var(--neo-brutalism-shadow)]`}
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface-grouped)] px-5 py-4">
          <div>
            <p className="text-sm font-black text-[var(--neo-brutalism-label)] uppercase">
              Neo-Brutalism Dialog
            </p>
            <h2
              id={titleId}
              className="mt-1 text-2xl font-black text-[var(--neo-brutalism-label)] uppercase"
            >
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className="mt-1 max-w-xl text-sm leading-6 font-semibold text-[var(--neo-brutalism-secondary-label)]"
              >
                {description}
              </p>
            ) : null}
          </div>
          <button
            className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-fill)] px-3 py-1 text-2xl leading-none font-black text-[var(--neo-brutalism-label)] shadow-[3px_3px_0_var(--neo-brutalism-separator)] transition-transform hover:-translate-y-0.5"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="px-5 py-5">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2 border-t-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface-grouped)] px-5 py-4">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
}

export function NeoBrutalismConfirm({
  cancelLabel = '취소',
  children,
  confirmLabel = '확인',
  onCancel,
  onConfirm,
  open,
  size = 'sm',
  title,
  tone = 'default'
}: Readonly<{
  cancelLabel?: string;
  children: ReactNode;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  size?: NeoBrutalismModalSize;
  title: string;
  tone?: NeoBrutalismConfirmTone;
}>) {
  return (
    <NeoBrutalismModal
      open={open}
      title={title}
      size={size}
      onClose={onCancel}
      footer={
        <>
          <button
            className={neoBrutalismSecondaryButtonClassName}
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`border-4 border-[var(--neo-brutalism-separator)] px-5 py-3 text-sm font-black shadow-[3px_3px_0_var(--neo-brutalism-separator)] transition-transform ${confirmButtonClassNames[tone]}`}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-sm leading-6 font-semibold text-[var(--neo-brutalism-secondary-label)]">
        {children}
      </div>
    </NeoBrutalismModal>
  );
}
