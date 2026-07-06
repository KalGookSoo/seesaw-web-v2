'use client';

import type { ReactNode } from 'react';

import { Modal, type ModalSize } from '@/components/ui/modal';

export type ConfirmTone = 'default' | 'danger';

const confirmButtonClassNames: Record<ConfirmTone, string> = {
  default: 'bg-default-blue text-white hover:bg-default-blue/90',
  danger: 'bg-default-red text-white hover:bg-default-red/90'
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
      onClose={onCancel}
      footer={
        <>
          <button
            className="border-default-separator bg-default-surface text-default-label hover:bg-default-fill rounded-md border px-4 py-2 text-sm font-semibold transition"
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${confirmButtonClassNames[tone]}`}
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
