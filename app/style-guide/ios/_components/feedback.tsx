'use client';

import type { ReactNode } from 'react';
import { useEffect, useId } from 'react';

export type IosAlertVariant =
  'info' | 'success' | 'warning' | 'danger' | 'neutral';

const alertVariantClassNames: Record<IosAlertVariant, string> = {
  info: 'border-[var(--ios-accent)] bg-[var(--ios-accent-soft)] text-[var(--ios-ink)]',
  success:
    'border-[var(--ios-success)] bg-[var(--ios-success-soft)] text-[var(--ios-ink)]',
  warning:
    'border-[var(--ios-warning)] bg-[var(--ios-warning-soft)] text-[var(--ios-ink)]',
  danger:
    'border-[var(--ios-danger)] bg-[var(--ios-danger-soft)] text-[var(--ios-ink)]',
  neutral:
    'border-[var(--ios-line)] bg-[var(--ios-surface)] text-[var(--ios-ink)]'
};

export type IosModalSize = 'sm' | 'md' | 'lg';

const modalSizeClassNames: Record<IosModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-xl',
  lg: 'max-w-4xl'
};

export type IosConfirmTone = 'default' | 'danger';

const confirmButtonClassNames: Record<IosConfirmTone, string> = {
  default: 'bg-[var(--ios-blue)] text-white hover:bg-[var(--ios-blue-muted)]',
  danger: 'bg-[var(--ios-red)] text-white hover:brightness-110'
};

const iosSecondaryButtonClassName =
  'rounded-lg bg-[var(--ios-fill)] px-5 py-3 text-sm font-semibold text-[var(--ios-label)] transition-colors hover:bg-[var(--ios-fill-strong)]';

export function IosAlert({
  children,
  title,
  variant = 'info'
}: Readonly<{
  children: ReactNode;
  title?: string;
  variant?: IosAlertVariant;
}>) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 shadow-[var(--ios-shadow)] ${alertVariantClassNames[variant]}`}
      role="alert"
    >
      {title ? <p className="text-sm font-semibold">{title}</p> : null}
      <div
        className={`${title ? 'mt-1' : ''} text-sm leading-6 text-[var(--ios-secondary-label)]`}
      >
        {children}
      </div>
    </div>
  );
}

export function IosModal({
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
  size?: IosModalSize;
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6"
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
        className={`relative w-full ${modalSizeClassNames[size]} overflow-hidden rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-surface-elevated)] shadow-[var(--ios-shadow)]`}
        role="dialog"
      >
        <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-[var(--ios-fill-strong)] sm:hidden" />
        <header className="flex items-start justify-between gap-4 border-b border-[var(--ios-separator)] px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-[var(--ios-blue)]">
              iOS Dialog
            </p>
            <h2
              id={titleId}
              className="mt-1 text-xl font-semibold text-[var(--ios-label)]"
            >
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className="mt-1 max-w-xl text-sm leading-6 text-[var(--ios-secondary-label)]"
              >
                {description}
              </p>
            ) : null}
          </div>
          <button
            className="rounded-full bg-[var(--ios-fill)] px-3 py-1 text-2xl leading-none text-[var(--ios-secondary-label)] transition-colors hover:bg-[var(--ios-fill-strong)]"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="px-5 py-5">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2 border-t border-[var(--ios-separator)] bg-[var(--ios-surface-grouped)] px-5 py-4">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
}

export function IosConfirm({
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
  size?: IosModalSize;
  title: string;
  tone?: IosConfirmTone;
}>) {
  return (
    <IosModal
      open={open}
      title={title}
      size={size}
      onClose={onCancel}
      footer={
        <>
          <button
            className={iosSecondaryButtonClassName}
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
      <div className="text-sm leading-6 text-[var(--ios-secondary-label)]">
        {children}
      </div>
    </IosModal>
  );
}
