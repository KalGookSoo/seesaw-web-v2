'use client';

import { useState } from 'react';

import styles from '@/components/editor/table-insert-dialog.module.css';

type TableInsertDialogProps = Readonly<{
  open: boolean;
  onClose: () => void;
  onInsert: (rows: number, columns: number) => void;
}>;

const MIN_SIZE = 1;
const MAX_SIZE = 20;
const DEFAULT_SIZE = 3;

function clampSize(value: number): number {
  if (Number.isNaN(value)) {
    return MIN_SIZE;
  }
  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(value)));
}

export function TableInsertDialog({ open, onClose, onInsert }: TableInsertDialogProps) {
  const [rows, setRows] = useState(DEFAULT_SIZE);
  const [columns, setColumns] = useState(DEFAULT_SIZE);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    setRows(DEFAULT_SIZE);
    setColumns(DEFAULT_SIZE);
    onClose();
  };

  const handleInsert = () => {
    onInsert(rows, columns);
    handleClose();
  };

  return (
    <div className={styles.overlay} role="presentation">
      <button className={styles.overlayDismiss} type="button" aria-label="닫기" onClick={handleClose} />
      <div aria-modal="true" className={styles.dialog} role="dialog">
        <div className={styles.dialogHeader}>
          <h2 className={styles.dialogTitle}>표 삽입</h2>
          <button className={styles.closeButton} type="button" aria-label="닫기" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.panel}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>행 개수</span>
            <input
              className={styles.numberInput}
              max={MAX_SIZE}
              min={MIN_SIZE}
              type="number"
              value={rows}
              onChange={(event) => setRows(clampSize(event.target.valueAsNumber))}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>열 개수</span>
            <input
              className={styles.numberInput}
              max={MAX_SIZE}
              min={MIN_SIZE}
              type="number"
              value={columns}
              onChange={(event) => setColumns(clampSize(event.target.valueAsNumber))}
            />
          </label>
        </div>

        <div className={styles.dialogFooter}>
          <button className={styles.secondaryButton} type="button" onClick={handleClose}>
            취소
          </button>
          <button className={styles.primaryButton} type="button" onClick={handleInsert}>
            삽입
          </button>
        </div>
      </div>
    </div>
  );
}
