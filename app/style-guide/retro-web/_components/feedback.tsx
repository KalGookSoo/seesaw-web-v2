'use client';

import type { ReactNode } from 'react';
import { useEffect, useId } from 'react';

export type RetroWebAlertVariant =
  'info' | 'success' | 'warning' | 'danger' | 'neutral';

const alertVariantClassNames: Record<RetroWebAlertVariant, string> = {
  info: 'border-[var(--retro-web-accent)] bg-[var(--retro-web-accent-soft)] text-[var(--retro-web-ink)]',
  success:
    'border-[var(--retro-web-success)] bg-[var(--retro-web-success-soft)] text-[var(--retro-web-ink)]',
  warning:
    'border-[var(--retro-web-warning)] bg-[var(--retro-web-warning-soft)] text-[var(--retro-web-ink)]',
  danger:
    'border-[var(--retro-web-danger)] bg-[var(--retro-web-danger-soft)] text-[var(--retro-web-ink)]',
  neutral:
    'border-[var(--retro-web-line)] bg-[var(--retro-web-surface)] text-[var(--retro-web-ink)]'
};

export type RetroWebModalSize = 'sm' | 'md' | 'lg';

const modalSizeClassNames: Record<RetroWebModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-xl',
  lg: 'max-w-4xl'
};

export type RetroWebConfirmTone = 'default' | 'danger';

const confirmButtonClassNames: Record<RetroWebConfirmTone, string> = {
  default:
    'bg-[var(--retro-web-blue)] text-[var(--retro-web-accent-contrast)] hover:bg-[var(--retro-web-blue-muted)]',
  danger:
    'bg-[var(--retro-web-red)] text-[var(--retro-web-danger-contrast)] hover:brightness-105'
};

const retroWebSecondaryButtonClassName =
  'border border-[var(--retro-web-separator)] bg-[var(--retro-web-fill)] px-5 py-3 font-mono text-sm font-semibold text-[var(--retro-web-label)] shadow-[var(--retro-web-shadow-soft)] transition-colors hover:bg-[var(--retro-web-fill-strong)]';

export function RetroWebAlert({
  children,
  title,
  variant = 'info'
}: Readonly<{
  children: ReactNode;
  title?: string;
  variant?: RetroWebAlertVariant;
}>) {
  return (
    <div
      className={`border px-4 py-3 shadow-[var(--retro-web-shadow)] ${alertVariantClassNames[variant]}`}
      role="alert"
    >
      {title ? (
        <p className="font-mono text-sm font-semibold">{title}</p>
      ) : null}
      <div
        className={`${title ? 'mt-1' : ''} text-sm leading-6 text-[var(--retro-web-secondary-label)]`}
      >
        {children}
      </div>
    </div>
  );
}

export function RetroWebModal({
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
  size?: RetroWebModalSize;
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
        className={`relative w-full ${modalSizeClassNames[size]} border border-[var(--retro-web-separator)] bg-[var(--retro-web-surface-elevated)] p-1 shadow-[var(--retro-web-shadow)]`}
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border border-[var(--retro-web-line-soft)] bg-[var(--retro-web-fill)] px-5 py-4 shadow-[var(--retro-web-inset)]">
          <div>
            <p className="font-mono text-sm font-semibold text-[var(--retro-web-blue)]">
              DIALOG.EXE
            </p>
            <h2
              id={titleId}
              className="mt-1 text-xl font-semibold text-[var(--retro-web-label)]"
            >
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className="mt-1 max-w-xl text-sm leading-6 text-[var(--retro-web-secondary-label)]"
              >
                {description}
              </p>
            ) : null}
          </div>
          <button
            className="border border-[var(--retro-web-separator)] bg-[var(--retro-web-surface)] px-3 py-1 text-2xl leading-none text-[var(--retro-web-secondary-label)] shadow-[var(--retro-web-shadow-soft)] transition-colors hover:bg-[var(--retro-web-fill-strong)]"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="px-5 py-5">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2 border border-[var(--retro-web-line-soft)] bg-[var(--retro-web-surface-grouped)] px-5 py-4 shadow-[var(--retro-web-inset)]">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
}

export function RetroWebConfirm({
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
  size?: RetroWebModalSize;
  title: string;
  tone?: RetroWebConfirmTone;
}>) {
  return (
    <RetroWebModal
      open={open}
      title={title}
      size={size}
      onClose={onCancel}
      footer={
        <>
          <button
            className={retroWebSecondaryButtonClassName}
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`border border-[var(--retro-web-separator)] px-5 py-3 font-mono text-sm font-semibold shadow-[var(--retro-web-shadow-soft)] transition-colors ${confirmButtonClassNames[tone]}`}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-sm leading-6 text-[var(--retro-web-secondary-label)]">
        {children}
      </div>
    </RetroWebModal>
  );
}
