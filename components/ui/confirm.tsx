'use client';

import type { ReactNode } from 'react';

import { Modal, type ModalSize } from '@/components/ui/modal';

export type ConfirmTone = 'default' | 'danger';

const confirmButtonClassNames: Record<ConfirmTone, string> = {
  default: 'bg-default-primary text-white hover:bg-default-primary-muted',
  danger: 'bg-default-danger text-white hover:bg-default-danger-muted'
};

export function Confirm({
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
  size?: ModalSize;
  title: string;
  tone?: ConfirmTone;
}>) {
  return (
    <Modal
      open={open}
      title={title}
      size={size}
      variant="editorial"
      onClose={onCancel}
      footer={
        <>
          <button
            className="border-default-separator bg-default-surface text-default-label hover:bg-default-fill border px-4 py-2 text-sm font-semibold transition"
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`px-4 py-2 text-sm font-semibold transition ${confirmButtonClassNames[tone]}`}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-default-secondary-label text-sm leading-6">{children}</div>
    </Modal>
  );
}
