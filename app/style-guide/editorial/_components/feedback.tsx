'use client';

import type { ReactNode } from 'react';
import { useEffect, useId } from 'react';

export type EditorialAlertVariant =
  'info' | 'success' | 'warning' | 'danger' | 'neutral';

const alertVariantClassNames: Record<EditorialAlertVariant, string> = {
  info: 'border-[var(--editorial-accent)] bg-[var(--editorial-accent-soft)] text-[var(--editorial-ink)]',
  success:
    'border-[var(--editorial-success)] bg-[var(--editorial-success-soft)] text-[var(--editorial-ink)]',
  warning:
    'border-[var(--editorial-warning)] bg-[var(--editorial-warning-soft)] text-[var(--editorial-ink)]',
  danger:
    'border-[var(--editorial-danger)] bg-[var(--editorial-danger-soft)] text-[var(--editorial-ink)]',
  neutral:
    'border-[var(--editorial-line)] bg-[var(--editorial-surface)] text-[var(--editorial-ink)]'
};

export type EditorialModalSize = 'sm' | 'md' | 'lg';

const modalSizeClassNames: Record<EditorialModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-xl',
  lg: 'max-w-4xl'
};

export type EditorialConfirmTone = 'default' | 'danger';

const confirmButtonClassNames: Record<EditorialConfirmTone, string> = {
  default:
    'bg-[var(--editorial-accent)] text-[var(--editorial-accent-contrast)] hover:bg-[var(--editorial-line)]',
  danger:
    'bg-[var(--editorial-danger)] text-white hover:bg-[var(--editorial-line)]'
};

const editorialSecondaryButtonClassName =
  'border border-[var(--editorial-line-soft)] bg-[var(--editorial-surface)] px-5 py-2.5 text-xs font-bold tracking-widest text-[var(--editorial-ink)] uppercase transition-colors hover:border-[var(--editorial-line)] hover:bg-[var(--editorial-surface-muted)]';

export function EditorialAlert({
  children,
  title,
  variant = 'info'
}: Readonly<{
  children: ReactNode;
  title?: string;
  variant?: EditorialAlertVariant;
}>) {
  return (
    <div
      className={`border-l-4 px-5 py-4 shadow-none ${alertVariantClassNames[variant]}`}
      role="alert"
    >
      {title ? (
        <p className="font-sans text-xs font-black tracking-widest uppercase">
          {title}
        </p>
      ) : null}
      <div
        className={`${title ? 'mt-2' : ''} font-serif text-sm leading-7 text-[var(--editorial-ink-soft)] italic`}
      >
        {children}
      </div>
    </div>
  );
}

export function EditorialModal({
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
  size?: EditorialModalSize;
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--editorial-line)]/35 px-4 py-6 backdrop-blur-sm"
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
        className={`relative w-full ${modalSizeClassNames[size]} border border-[var(--editorial-line)] bg-[var(--editorial-surface)] shadow-[12px_12px_0_var(--editorial-line-soft)]`}
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b-2 border-[var(--editorial-line)] px-6 py-5">
          <div>
            <p className="text-[0.625rem] font-black tracking-[0.24em] text-[var(--editorial-accent)] uppercase">
              Editorial Dialog
            </p>
            <h2
              id={titleId}
              className="mt-2 font-serif text-2xl font-black text-[var(--editorial-ink)]"
            >
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className="mt-2 max-w-xl font-serif text-sm leading-7 text-[var(--editorial-ink-soft)] italic"
              >
                {description}
              </p>
            ) : null}
          </div>
          <button
            className="border border-[var(--editorial-line)] px-3 py-1 font-serif text-2xl leading-none text-[var(--editorial-ink)] transition-colors hover:bg-[var(--editorial-line)] hover:text-[var(--editorial-background)]"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="px-6 py-6">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2 border-t border-[var(--editorial-line-soft)] bg-[var(--editorial-surface-muted)] px-6 py-5">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
}

export function EditorialConfirm({
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
  size?: EditorialModalSize;
  title: string;
  tone?: EditorialConfirmTone;
}>) {
  return (
    <EditorialModal
      open={open}
      title={title}
      size={size}
      onClose={onCancel}
      footer={
        <>
          <button
            className={editorialSecondaryButtonClassName}
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors ${confirmButtonClassNames[tone]}`}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="font-serif text-sm leading-7 text-[var(--editorial-ink-soft)] italic">
        {children}
      </div>
    </EditorialModal>
  );
}
