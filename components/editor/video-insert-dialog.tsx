'use client';

import { Fragment, useState } from 'react';

import styles from '@/components/editor/video-insert-dialog.module.css';

type VideoInsertTab = 'file' | 'url';

type VideoInsertDialogProps = Readonly<{
  open: boolean;
  onClose: () => void;
  onInsertFile: (file: File, description: string) => void;
  onInsertUrl: (url: string, description: string) => void;
}>;

function tabClassName(active: boolean): string {
  return active ? `${styles.tab} ${styles.tabActive}` : styles.tab;
}

export function VideoInsertDialog({ open, onClose, onInsertFile, onInsertUrl }: VideoInsertDialogProps) {
  const [tab, setTab] = useState<VideoInsertTab>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState('');
  const [url, setUrl] = useState('');
  const [urlDescription, setUrlDescription] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [checkingUrl, setCheckingUrl] = useState(false);

  if (!open) {
    return null;
  }

  const reset = () => {
    setTab('file');
    setSelectedFile(null);
    setFileDescription('');
    setUrl('');
    setUrlDescription('');
    setUrlError(null);
    setCheckingUrl(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleInsert = () => {
    if (tab === 'file') {
      if (!selectedFile) {
        return;
      }
      onInsertFile(selectedFile, fileDescription);
      handleClose();
      return;
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      return;
    }

    setUrlError(null);
    setCheckingUrl(true);
    const probe = document.createElement('video');
    probe.preload = 'metadata';
    probe.onloadedmetadata = () => {
      setCheckingUrl(false);
      onInsertUrl(trimmedUrl, urlDescription);
      handleClose();
    };
    probe.onerror = () => {
      setCheckingUrl(false);
      setUrlError('동영상을 불러올 수 없습니다. URL을 확인해주세요.');
    };
    probe.src = trimmedUrl;
  };

  const insertDisabled = tab === 'file' ? !selectedFile : !url.trim() || checkingUrl;

  return (
    <div className={styles.overlay} role="presentation">
      <button className={styles.overlayDismiss} type="button" aria-label="닫기" onClick={handleClose} />
      <div aria-modal="true" className={styles.dialog} role="dialog">
        <div className={styles.dialogHeader}>
          <h2 className={styles.dialogTitle}>동영상 삽입</h2>
          <button className={styles.closeButton} type="button" aria-label="닫기" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.tabs}>
          <button className={tabClassName(tab === 'file')} type="button" onClick={() => setTab('file')}>
            파일
          </button>
          <button className={tabClassName(tab === 'url')} type="button" onClick={() => setTab('url')}>
            URL
          </button>
        </div>

        <div className={styles.tabPanel}>
          {tab === 'file' ? (
            <Fragment key="file">
              <label className={styles.field}>
                <span className={styles.fieldLabel}>파일</span>
                <input
                  accept="video/*"
                  type="file"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>설명(대체 텍스트)</span>
                <input
                  className={styles.textInput}
                  placeholder="동영상 설명을 입력하세요"
                  type="text"
                  value={fileDescription}
                  onChange={(event) => setFileDescription(event.target.value)}
                />
              </label>
            </Fragment>
          ) : (
            <Fragment key="url">
              <label className={styles.field}>
                <span className={styles.fieldLabel}>동영상 URL</span>
                <input
                  className={styles.textInput}
                  placeholder="https://"
                  type="text"
                  value={url}
                  onChange={(event) => {
                    setUrl(event.target.value);
                    setUrlError(null);
                  }}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>설명(대체 텍스트)</span>
                <input
                  className={styles.textInput}
                  placeholder="동영상 설명을 입력하세요"
                  type="text"
                  value={urlDescription}
                  onChange={(event) => setUrlDescription(event.target.value)}
                />
              </label>
              {urlError ? <p className={styles.error}>{urlError}</p> : null}
            </Fragment>
          )}
        </div>

        <div className={styles.dialogFooter}>
          <button className={styles.secondaryButton} type="button" onClick={handleClose}>
            취소
          </button>
          <button className={styles.primaryButton} disabled={insertDisabled} type="button" onClick={handleInsert}>
            {checkingUrl ? '확인 중…' : '삽입'}
          </button>
        </div>
      </div>
    </div>
  );
}
