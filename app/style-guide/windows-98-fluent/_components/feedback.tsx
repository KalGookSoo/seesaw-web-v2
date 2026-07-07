'use client';

import type { ReactNode } from 'react';
import { useEffect, useId } from 'react';

export type Windows98FluentAlertVariant =
  'info' | 'success' | 'warning' | 'danger' | 'neutral';

const alertVariantClassNames: Record<Windows98FluentAlertVariant, string> = {
  info: 'border-[var(--windows-98-fluent-accent)] bg-[var(--windows-98-fluent-accent-soft)] text-[var(--windows-98-fluent-ink)]',
  success:
    'border-[var(--windows-98-fluent-success)] bg-[var(--windows-98-fluent-success-soft)] text-[var(--windows-98-fluent-ink)]',
  warning:
    'border-[var(--windows-98-fluent-warning)] bg-[var(--windows-98-fluent-warning-soft)] text-[var(--windows-98-fluent-ink)]',
  danger:
    'border-[var(--windows-98-fluent-danger)] bg-[var(--windows-98-fluent-danger-soft)] text-[var(--windows-98-fluent-ink)]',
  neutral:
    'border-[var(--windows-98-fluent-line)] bg-[var(--windows-98-fluent-surface)] text-[var(--windows-98-fluent-ink)]'
};

export type Windows98FluentModalSize = 'sm' | 'md' | 'lg';

const modalSizeClassNames: Record<Windows98FluentModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-xl',
  lg: 'max-w-4xl'
};

export type Windows98FluentConfirmTone = 'default' | 'danger';

const confirmButtonClassNames: Record<Windows98FluentConfirmTone, string> = {
  default:
    'bg-[var(--windows-98-fluent-surface)] text-[var(--windows-98-fluent-label)] active:shadow-[var(--windows-98-fluent-inset-pressed)]',
  danger:
    'bg-[var(--windows-98-fluent-red)] text-[var(--windows-98-fluent-danger-contrast)] active:shadow-[var(--windows-98-fluent-inset-pressed)]'
};

const windows98FluentSecondaryButtonClassName =
  'border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] px-5 py-3 font-mono text-sm font-semibold text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)] active:shadow-[var(--windows-98-fluent-inset-pressed)]';

export function Windows98FluentAlert({
  children,
  title,
  variant = 'info'
}: Readonly<{
  children: ReactNode;
  title?: string;
  variant?: Windows98FluentAlertVariant;
}>) {
  return (
    <div
      className={`border px-4 py-3 shadow-[var(--windows-98-fluent-inset)] ${alertVariantClassNames[variant]}`}
      role="alert"
    >
      {title ? (
        <p className="font-mono text-sm font-semibold">{title}</p>
      ) : null}
      <div
        className={`${title ? 'mt-1' : ''} text-sm leading-6 text-[var(--windows-98-fluent-secondary-label)]`}
      >
        {children}
      </div>
    </div>
  );
}

export function Windows98FluentModal({
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
  size?: Windows98FluentModalSize;
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
        className={`relative w-full ${modalSizeClassNames[size]} border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]`}
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 bg-[var(--windows-98-fluent-accent)] px-5 py-3 text-[var(--windows-98-fluent-accent-contrast)]">
          <div>
            <p className="font-mono text-sm font-semibold">DIALOG.EXE</p>
            <h2 id={titleId} className="mt-1 text-xl font-semibold">
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className="mt-1 max-w-xl text-sm leading-6 text-[var(--windows-98-fluent-accent-contrast)]"
              >
                {description}
              </p>
            ) : null}
          </div>
          <button
            className="flex size-8 shrink-0 items-center justify-center border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] font-mono text-xl leading-none font-bold text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)] active:shadow-[var(--windows-98-fluent-inset-pressed)]"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="px-5 py-5">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2 border border-[var(--windows-98-fluent-line-soft)] bg-[var(--windows-98-fluent-surface-grouped)] px-5 py-4 shadow-[var(--windows-98-fluent-inset-pressed)]">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
}

export function Windows98FluentConfirm({
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
  size?: Windows98FluentModalSize;
  title: string;
  tone?: Windows98FluentConfirmTone;
}>) {
  return (
    <Windows98FluentModal
      open={open}
      title={title}
      size={size}
      onClose={onCancel}
      footer={
        <>
          <button
            className={windows98FluentSecondaryButtonClassName}
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`border border-[var(--windows-98-fluent-separator)] px-5 py-3 font-mono text-sm font-semibold shadow-[var(--windows-98-fluent-inset)] transition-colors ${confirmButtonClassNames[tone]}`}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-sm leading-6 text-[var(--windows-98-fluent-secondary-label)]">
        {children}
      </div>
    </Windows98FluentModal>
  );
}
