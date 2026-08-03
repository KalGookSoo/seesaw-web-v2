'use client';

import { useEffect, useState } from 'react';

import styles from '@/components/editor/link-insert-dialog.module.css';

type LinkInsertDialogProps = Readonly<{
  open: boolean;
  initialText: string;
  onClose: () => void;
  onInsert: (text: string, url: string) => void;
}>;

function isValidUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return true;
  }
  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
}

export function LinkInsertDialog({ open, initialText, onClose, onInsert }: LinkInsertDialogProps) {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setText(initialText);
      setUrl('');
      setTouched(false);
    }
  }, [open, initialText]);

  if (!open) {
    return null;
  }

  const urlValid = isValidUrl(url);

  const handleClose = () => {
    onClose();
  };

  const handleInsert = () => {
    if (!urlValid) {
      setTouched(true);
      return;
    }
    onInsert(text.trim() || url.trim(), url.trim());
    handleClose();
  };

  return (
    <div className={styles.overlay} role="presentation">
      <button className={styles.overlayDismiss} type="button" aria-label="닫기" onClick={handleClose} />
      <div aria-modal="true" className={styles.dialog} role="dialog">
        <div className={styles.dialogHeader}>
          <h2 className={styles.dialogTitle}>링크 삽입</h2>
          <button className={styles.closeButton} type="button" aria-label="닫기" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.panel}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>링크 텍스트</span>
            <input
              className={styles.textInput}
              placeholder="표시할 텍스트를 입력하세요"
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>URL</span>
            <input
              className={styles.textInput}
              placeholder="https:// 또는 /articles/123"
              type="text"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                setTouched(false);
              }}
            />
            {touched && !urlValid ? (
              <p className={styles.error}>{url.trim() ? '올바른 URL 형식이 아닙니다.' : 'URL을 입력해주세요.'}</p>
            ) : null}
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
