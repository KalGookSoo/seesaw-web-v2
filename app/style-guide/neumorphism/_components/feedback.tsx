'use client';

import type { ReactNode } from 'react';
import { useEffect, useId } from 'react';

export type NeumorphismAlertVariant =
  'info' | 'success' | 'warning' | 'danger' | 'neutral';

const alertVariantClassNames: Record<NeumorphismAlertVariant, string> = {
  info: 'border-[var(--neumorphism-accent)] bg-[var(--neumorphism-accent-soft)] text-[var(--neumorphism-ink)]',
  success:
    'border-[var(--neumorphism-success)] bg-[var(--neumorphism-success-soft)] text-[var(--neumorphism-ink)]',
  warning:
    'border-[var(--neumorphism-warning)] bg-[var(--neumorphism-warning-soft)] text-[var(--neumorphism-ink)]',
  danger:
    'border-[var(--neumorphism-danger)] bg-[var(--neumorphism-danger-soft)] text-[var(--neumorphism-ink)]',
  neutral:
    'border-[var(--neumorphism-line)] bg-[var(--neumorphism-surface)] text-[var(--neumorphism-ink)]'
};

export type NeumorphismModalSize = 'sm' | 'md' | 'lg';

const modalSizeClassNames: Record<NeumorphismModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-xl',
  lg: 'max-w-4xl'
};

export type NeumorphismConfirmTone = 'default' | 'danger';

const confirmButtonClassNames: Record<NeumorphismConfirmTone, string> = {
  default:
    'bg-[var(--neumorphism-blue)] text-[var(--neumorphism-accent-contrast)] hover:bg-[var(--neumorphism-blue-muted)]',
  danger:
    'bg-[var(--neumorphism-red)] text-[var(--neumorphism-danger-contrast)] hover:brightness-105'
};

const neumorphismSecondaryButtonClassName =
  'rounded-2xl bg-[var(--neumorphism-surface)] px-5 py-3 text-sm font-semibold text-[var(--neumorphism-label)] shadow-[var(--neumorphism-shadow-soft)] transition-shadow hover:shadow-[var(--neumorphism-shadow-inset)]';

export function NeumorphismAlert({
  children,
  title,
  variant = 'info'
}: Readonly<{
  children: ReactNode;
  title?: string;
  variant?: NeumorphismAlertVariant;
}>) {
  return (
    <div
      className={`rounded-3xl border px-5 py-4 shadow-[var(--neumorphism-shadow-soft)] ${alertVariantClassNames[variant]}`}
      role="alert"
    >
      {title ? <p className="text-sm font-semibold">{title}</p> : null}
      <div
        className={`${title ? 'mt-1' : ''} text-sm leading-6 text-[var(--neumorphism-secondary-label)]`}
      >
        {children}
      </div>
    </div>
  );
}

export function NeumorphismModal({
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
  size?: NeumorphismModalSize;
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4 py-6 backdrop-blur-sm"
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
        className={`relative w-full ${modalSizeClassNames[size]} overflow-hidden rounded-3xl border border-[var(--neumorphism-separator)] bg-[var(--neumorphism-surface-elevated)] shadow-[var(--neumorphism-shadow)]`}
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-[var(--neumorphism-blue)]">
              Neumorphism Dialog
            </p>
            <h2
              id={titleId}
              className="mt-1 text-xl font-semibold text-[var(--neumorphism-label)]"
            >
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className="mt-1 max-w-xl text-sm leading-6 text-[var(--neumorphism-secondary-label)]"
              >
                {description}
              </p>
            ) : null}
          </div>
          <button
            className="rounded-full bg-[var(--neumorphism-surface)] px-3 py-1 text-2xl leading-none text-[var(--neumorphism-secondary-label)] shadow-[var(--neumorphism-shadow-soft)] transition-shadow hover:shadow-[var(--neumorphism-shadow-inset)]"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="px-6 py-5">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2 bg-[var(--neumorphism-surface-grouped)] px-6 py-5 shadow-[var(--neumorphism-shadow-inset)]">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
}

export function NeumorphismConfirm({
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
  size?: NeumorphismModalSize;
  title: string;
  tone?: NeumorphismConfirmTone;
}>) {
  return (
    <NeumorphismModal
      open={open}
      title={title}
      size={size}
      onClose={onCancel}
      footer={
        <>
          <button
            className={neumorphismSecondaryButtonClassName}
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`rounded-2xl px-5 py-3 text-sm font-semibold shadow-[var(--neumorphism-shadow-soft)] transition-colors ${confirmButtonClassNames[tone]}`}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-sm leading-6 text-[var(--neumorphism-secondary-label)]">
        {children}
      </div>
    </NeumorphismModal>
  );
}
