'use client';

import { useEffect, useState } from 'react';

import styles from '@/components/editor/source-code-dialog.module.css';

type SourceCodeTab = 'html' | 'markdown';

type SourceCodeDialogProps = Readonly<{
  open: boolean;
  initialHtml: string;
  initialMarkdown: string;
  onClose: () => void;
  onApply: (tab: SourceCodeTab, value: string) => void;
}>;

export function SourceCodeDialog({ open, initialHtml, initialMarkdown, onClose, onApply }: SourceCodeDialogProps) {
  const [tab, setTab] = useState<SourceCodeTab>('html');
  const [htmlValue, setHtmlValue] = useState('');
  const [markdownValue, setMarkdownValue] = useState('');

  useEffect(() => {
    if (open) {
      setTab('html');
      setHtmlValue(initialHtml);
      setMarkdownValue(initialMarkdown);
    }
  }, [open, initialHtml, initialMarkdown]);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const handleApply = () => {
    onApply(tab, tab === 'html' ? htmlValue : markdownValue);
    handleClose();
  };

  return (
    <div className={styles.overlay} role="presentation">
      <button aria-label="닫기" className={styles.overlayDismiss} type="button" onClick={handleClose} />
      <div aria-modal="true" className={styles.dialog} role="dialog">
        <div className={styles.dialogHeader}>
          <h2 className={styles.dialogTitle}>소스 코드 보기/편집</h2>
          <button aria-label="닫기" className={styles.closeButton} type="button" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            aria-pressed={tab === 'html'}
            className={tab === 'html' ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton}
            type="button"
            onClick={() => setTab('html')}
          >
            HTML
          </button>
          <button
            aria-pressed={tab === 'markdown'}
            className={tab === 'markdown' ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton}
            type="button"
            onClick={() => setTab('markdown')}
          >
            Markdown
          </button>
        </div>

        <div className={styles.panel}>
          <textarea
            className={styles.sourceTextarea}
            spellCheck={false}
            value={tab === 'html' ? htmlValue : markdownValue}
            onChange={(event) => {
              if (tab === 'html') {
                setHtmlValue(event.target.value);
              } else {
                setMarkdownValue(event.target.value);
              }
            }}
          />
        </div>

        <div className={styles.dialogFooter}>
          <button className={styles.secondaryButton} type="button" onClick={handleClose}>
            취소
          </button>
          <button className={styles.primaryButton} type="button" onClick={handleApply}>
            적용
          </button>
        </div>
      </div>
    </div>
  );
}
