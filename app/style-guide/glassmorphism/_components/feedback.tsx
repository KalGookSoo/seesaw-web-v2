'use client';

import type { ReactNode } from 'react';
import { useEffect, useId } from 'react';

export type GlassmorphismAlertVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

const alertVariantClassNames: Record<GlassmorphismAlertVariant, string> = {
  info: 'border-[var(--glassmorphism-accent)] bg-[var(--glassmorphism-accent-soft)] text-[var(--glassmorphism-ink)]',
  success: 'border-[var(--glassmorphism-success)] bg-[var(--glassmorphism-success-soft)] text-[var(--glassmorphism-ink)]',
  warning: 'border-[var(--glassmorphism-warning)] bg-[var(--glassmorphism-warning-soft)] text-[var(--glassmorphism-ink)]',
  danger: 'border-[var(--glassmorphism-danger)] bg-[var(--glassmorphism-danger-soft)] text-[var(--glassmorphism-ink)]',
  neutral: 'border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface)] text-[var(--glassmorphism-ink)]'
};

export type GlassmorphismModalSize = 'sm' | 'md' | 'lg';

const modalSizeClassNames: Record<GlassmorphismModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-xl',
  lg: 'max-w-4xl'
};

export type GlassmorphismConfirmTone = 'default' | 'danger';

const confirmButtonClassNames: Record<GlassmorphismConfirmTone, string> = {
  default:
    'bg-[var(--glassmorphism-accent)] text-[var(--glassmorphism-accent-contrast)] shadow-lg shadow-[var(--glassmorphism-accent)]/20 hover:bg-[var(--glassmorphism-accent-muted)]',
  danger: 'bg-[var(--glassmorphism-danger)] text-white shadow-lg shadow-[var(--glassmorphism-danger)]/20 hover:brightness-110'
};

const glassmorphismSecondaryButtonClassName =
  'rounded-full border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface)] px-5 py-2.5 text-xs font-bold tracking-widest text-[var(--glassmorphism-ink)] uppercase shadow-sm backdrop-blur-xl transition-colors hover:bg-[var(--glassmorphism-surface-strong)]';

export function GlassmorphismAlert({
  children,
  title,
  variant = 'info'
}: Readonly<{
  children: ReactNode;
  title?: string;
  variant?: GlassmorphismAlertVariant;
}>) {
  return (
    <div
      className={`rounded-2xl border px-5 py-4 shadow-[var(--glassmorphism-shadow)] backdrop-blur-2xl ${alertVariantClassNames[variant]}`}
      role="alert"
    >
      {title ? <p className="font-sans text-xs font-black tracking-widest uppercase">{title}</p> : null}
      <div className={`${title ? 'mt-2' : ''} text-sm leading-7 text-[var(--glassmorphism-ink-soft)]`}>{children}</div>
    </div>
  );
}

export function GlassmorphismModal({
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
  size?: GlassmorphismModalSize;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-xl" role="presentation">
      <button className="absolute inset-0 cursor-default" type="button" aria-label="모달 닫기" onClick={onClose} />
      <section
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={`relative w-full ${modalSizeClassNames[size]} overflow-hidden rounded-3xl border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface-strong)] shadow-[var(--glassmorphism-shadow)] backdrop-blur-3xl`}
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--glassmorphism-line-soft)] px-6 py-5">
          <div>
            <p className="text-[10px] font-black tracking-[0.24em] text-[var(--glassmorphism-accent)] uppercase">Glass Dialog</p>
            <h2 id={titleId} className="mt-2 text-2xl font-semibold text-[var(--glassmorphism-ink)]">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-2 max-w-xl text-sm leading-7 text-[var(--glassmorphism-ink-soft)]">
                {description}
              </p>
            ) : null}
          </div>
          <button
            className="rounded-full border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface-muted)] px-3 py-1 text-2xl leading-none text-[var(--glassmorphism-ink)] backdrop-blur-xl transition-colors hover:bg-[var(--glassmorphism-surface-strong)]"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="px-6 py-6">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2 border-t border-[var(--glassmorphism-line-soft)] bg-[var(--glassmorphism-surface-muted)] px-6 py-5 backdrop-blur-xl">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
}

export function GlassmorphismConfirm({
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
  size?: GlassmorphismModalSize;
  title: string;
  tone?: GlassmorphismConfirmTone;
}>) {
  return (
    <GlassmorphismModal
      open={open}
      title={title}
      size={size}
      onClose={onCancel}
      footer={
        <>
          <button className={glassmorphismSecondaryButtonClassName} type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={`rounded-full px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors ${confirmButtonClassNames[tone]}`}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-sm leading-7 text-[var(--glassmorphism-ink-soft)]">{children}</div>
    </GlassmorphismModal>
  );
}
