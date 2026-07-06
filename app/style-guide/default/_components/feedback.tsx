'use client';

import type { ReactNode } from 'react';
import { useEffect, useId } from 'react';

export type DefaultAlertVariant =
  'info' | 'success' | 'warning' | 'danger' | 'neutral';

const alertVariantClassNames: Record<DefaultAlertVariant, string> = {
  info: 'border-[var(--default-blue-muted)] bg-[var(--default-blue-soft)] text-[var(--default-blue-contrast)]',
  success:
    'border-[var(--default-green-muted)] bg-[var(--default-green-soft)] text-[var(--default-green-contrast)]',
  warning:
    'border-[var(--default-orange-muted)] bg-[var(--default-orange-soft)] text-[var(--default-orange-contrast)]',
  danger:
    'border-[var(--default-red-muted)] bg-[var(--default-red-soft)] text-[var(--default-red-contrast)]',
  neutral:
    'border-[var(--default-separator)] bg-[var(--default-surface)] text-[var(--default-label)]'
};

export type DefaultModalSize = 'sm' | 'md' | 'lg';

const modalSizeClassNames: Record<DefaultModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-xl',
  lg: 'max-w-4xl'
};

export type DefaultConfirmTone = 'default' | 'danger';

const confirmButtonClassNames: Record<DefaultConfirmTone, string> = {
  default:
    'bg-[var(--default-blue)] text-white hover:bg-[var(--default-blue-muted)]',
  danger:
    'bg-[var(--default-red)] text-[var(--default-danger-contrast)] hover:brightness-110'
};

const defaultSecondaryButtonClassName =
  'rounded-xl border border-[var(--default-separator)] bg-[var(--default-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--default-label)] transition-colors hover:bg-[var(--default-fill)]';

export function DefaultAlert({
  children,
  title,
  variant = 'info'
}: Readonly<{
  children: ReactNode;
  title?: string;
  variant?: DefaultAlertVariant;
}>) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 shadow-[var(--default-shadow-soft)] ${alertVariantClassNames[variant]}`}
      role="alert"
    >
      {title ? <p className="text-sm font-semibold">{title}</p> : null}
      <div className={`${title ? 'mt-1' : ''} text-sm leading-6`}>
        {children}
      </div>
    </div>
  );
}

export function DefaultModal({
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
  size?: DefaultModalSize;
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-sm"
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
        className={`relative w-full ${modalSizeClassNames[size]} overflow-hidden rounded-3xl border border-[var(--default-separator)] bg-[var(--default-surface-elevated)] shadow-[var(--default-shadow)]`}
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--default-separator)] px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-[var(--default-blue)]">
              Default Dialog
            </p>
            <h2
              id={titleId}
              className="mt-1 text-xl font-semibold text-[var(--default-label)]"
            >
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className="mt-1 max-w-xl text-sm leading-6 text-[var(--default-secondary-label)]"
              >
                {description}
              </p>
            ) : null}
          </div>
          <button
            className="rounded-full border border-[var(--default-separator)] bg-[var(--default-fill)] px-3 py-1 text-2xl leading-none text-[var(--default-secondary-label)] transition-colors hover:bg-[var(--default-fill-strong)]"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="px-5 py-5">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2 border-t border-[var(--default-separator)] bg-[var(--default-surface-grouped)] px-5 py-4">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
}

export function DefaultConfirm({
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
  size?: DefaultModalSize;
  title: string;
  tone?: DefaultConfirmTone;
}>) {
  return (
    <DefaultModal
      open={open}
      title={title}
      size={size}
      onClose={onCancel}
      footer={
        <>
          <button
            className={defaultSecondaryButtonClassName}
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${confirmButtonClassNames[tone]}`}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-sm leading-6 text-[var(--default-secondary-label)]">
        {children}
      </div>
    </DefaultModal>
  );
}
