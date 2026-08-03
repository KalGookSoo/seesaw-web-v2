'use client';

import { useEffect, useState } from 'react';

import styles from '@/components/editor/color-picker-dialog.module.css';

const PRESET_COLORS = [
  '#000000',
  '#ffffff',
  '#6b7280',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899'
];

type ColorPickerDialogProps = Readonly<{
  open: boolean;
  title: string;
  onClose: () => void;
  onSelect: (color: string) => void;
  onClear: () => void;
}>;

export function ColorPickerDialog({ open, title, onClose, onSelect, onClear }: ColorPickerDialogProps) {
  const [customColor, setCustomColor] = useState('#000000');

  useEffect(() => {
    if (open) {
      setCustomColor('#000000');
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const handleSelect = (color: string) => {
    onSelect(color);
    handleClose();
  };

  const handleClear = () => {
    onClear();
    handleClose();
  };

  return (
    <div className={styles.overlay} role="presentation">
      <button className={styles.overlayDismiss} type="button" aria-label="닫기" onClick={handleClose} />
      <div aria-modal="true" className={styles.dialog} role="dialog">
        <div className={styles.dialogHeader}>
          <h2 className={styles.dialogTitle}>{title}</h2>
          <button className={styles.closeButton} type="button" aria-label="닫기" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.panel}>
          <div className={styles.palette}>
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                className={styles.swatch}
                style={{ backgroundColor: color }}
                title={color}
                type="button"
                onClick={() => handleSelect(color)}
              />
            ))}
          </div>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>사용자 지정 색상</span>
            <div className={styles.customColorRow}>
              <input
                className={styles.colorInput}
                type="color"
                value={customColor}
                onChange={(event) => setCustomColor(event.target.value)}
              />
              <input
                className={styles.textInput}
                type="text"
                value={customColor}
                onChange={(event) => setCustomColor(event.target.value)}
              />
              <button className={styles.applyButton} type="button" onClick={() => handleSelect(customColor)}>
                적용
              </button>
            </div>
          </label>
        </div>

        <div className={styles.dialogFooter}>
          <button className={styles.secondaryButton} type="button" onClick={handleClear}>
            색상 지우기
          </button>
          <button className={styles.secondaryButton} type="button" onClick={handleClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
