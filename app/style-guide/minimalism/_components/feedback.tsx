'use client';

import type { ReactNode } from 'react';
import { useEffect, useId } from 'react';

export type MinimalismAlertVariant =
  'info' | 'success' | 'warning' | 'danger' | 'neutral';

const alertVariantClassNames: Record<MinimalismAlertVariant, string> = {
  info: 'border-[var(--minimalism-accent)] bg-[var(--minimalism-accent-soft)] text-[var(--minimalism-ink)]',
  success:
    'border-[var(--minimalism-success)] bg-[var(--minimalism-success-soft)] text-[var(--minimalism-ink)]',
  warning:
    'border-[var(--minimalism-warning)] bg-[var(--minimalism-warning-soft)] text-[var(--minimalism-ink)]',
  danger:
    'border-[var(--minimalism-danger)] bg-[var(--minimalism-danger-soft)] text-[var(--minimalism-ink)]',
  neutral:
    'border-[var(--minimalism-line)] bg-[var(--minimalism-surface)] text-[var(--minimalism-ink)]'
};

export type MinimalismModalSize = 'sm' | 'md' | 'lg';

const modalSizeClassNames: Record<MinimalismModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-xl',
  lg: 'max-w-4xl'
};

export type MinimalismConfirmTone = 'default' | 'danger';

const confirmButtonClassNames: Record<MinimalismConfirmTone, string> = {
  default:
    'bg-[var(--minimalism-blue)] text-[var(--minimalism-accent-contrast)] hover:bg-[var(--minimalism-blue-muted)]',
  danger:
    'bg-[var(--minimalism-red)] text-[var(--minimalism-danger-contrast)] hover:brightness-110'
};

const minimalismSecondaryButtonClassName =
  'rounded-lg bg-[var(--minimalism-fill)] px-5 py-3 text-sm font-semibold text-[var(--minimalism-label)] transition-colors hover:bg-[var(--minimalism-fill-strong)]';

export function MinimalismAlert({
  children,
  title,
  variant = 'info'
}: Readonly<{
  children: ReactNode;
  title?: string;
  variant?: MinimalismAlertVariant;
}>) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 shadow-[var(--minimalism-shadow)] ${alertVariantClassNames[variant]}`}
      role="alert"
    >
      {title ? <p className="text-sm font-semibold">{title}</p> : null}
      <div
        className={`${title ? 'mt-1' : ''} text-sm leading-6 text-[var(--minimalism-secondary-label)]`}
      >
        {children}
      </div>
    </div>
  );
}

export function MinimalismModal({
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
  size?: MinimalismModalSize;
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6"
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
        className={`relative w-full ${modalSizeClassNames[size]} overflow-hidden rounded-lg border border-[var(--minimalism-separator)] bg-[var(--minimalism-surface-elevated)] shadow-[var(--minimalism-shadow)]`}
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--minimalism-separator)] px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-[var(--minimalism-blue)]">
              Minimalism Dialog
            </p>
            <h2
              id={titleId}
              className="mt-1 text-xl font-semibold text-[var(--minimalism-label)]"
            >
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className="mt-1 max-w-xl text-sm leading-6 text-[var(--minimalism-secondary-label)]"
              >
                {description}
              </p>
            ) : null}
          </div>
          <button
            className="rounded-lg border border-[var(--minimalism-separator)] bg-[var(--minimalism-surface)] px-3 py-1 text-2xl leading-none text-[var(--minimalism-secondary-label)] transition-colors hover:bg-[var(--minimalism-fill)]"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="px-5 py-5">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2 border-t border-[var(--minimalism-separator)] bg-[var(--minimalism-surface-grouped)] px-5 py-4">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
}

export function MinimalismConfirm({
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
  size?: MinimalismModalSize;
  title: string;
  tone?: MinimalismConfirmTone;
}>) {
  return (
    <MinimalismModal
      open={open}
      title={title}
      size={size}
      onClose={onCancel}
      footer={
        <>
          <button
            className={minimalismSecondaryButtonClassName}
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`rounded-lg px-5 py-3 text-sm font-semibold transition-colors ${confirmButtonClassNames[tone]}`}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-sm leading-6 text-[var(--minimalism-secondary-label)]">
        {children}
      </div>
    </MinimalismModal>
  );
}
