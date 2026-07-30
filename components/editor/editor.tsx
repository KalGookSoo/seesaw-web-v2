'use client';

import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import styles from '@/components/editor/editor.module.css';
import { ImageInsertDialog } from '@/components/editor/image-insert-dialog';
import { htmlToMarkdown, markdownToHtml } from '@/components/editor/markdown-conversion';
import type { EditorHandle, EditorHooks, EditorMode } from '@/components/editor/types';

type EditorProps = Readonly<{
  ref?: React.Ref<EditorHandle>;
  initialValue?: string;
  initialEditType?: EditorMode;
  height?: string;
  hideModeSwitch?: boolean;
  previewStyle?: 'vertical' | 'tab';
  onChange?: (html: string) => void;
  hooks?: EditorHooks;
}>;

function toolbarButtonClassName(active: boolean): string {
  return active ? `${styles.toolbarButton} ${styles.toolbarButtonActive}` : styles.toolbarButton;
}

export function Editor({
  ref,
  initialValue = '',
  initialEditType = 'wysiwyg',
  height = '400px',
  hideModeSwitch = false,
  onChange,
  hooks
}: EditorProps) {
  const [mode, setMode] = useState<EditorMode>(initialEditType);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const wysiwygRef = useRef<HTMLDivElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }
    initializedRef.current = true;

    if (initialEditType === 'markdown') {
      if (markdownRef.current) {
        markdownRef.current.value = htmlToMarkdown(initialValue);
      }
      if (wysiwygRef.current) {
        wysiwygRef.current.innerHTML = initialValue;
      }
      return;
    }

    if (wysiwygRef.current) {
      wysiwygRef.current.innerHTML = initialValue;
    }
    if (markdownRef.current) {
      markdownRef.current.value = htmlToMarkdown(initialValue);
    }
    // 최초 마운트에서만 초기값을 채운다 - 이후 initialValue 변경은 무시한다(입력 중 커서 튐 방지).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getHTML = useCallback((): string => {
    if (mode === 'markdown') {
      return markdownToHtml(markdownRef.current?.value ?? '');
    }
    return wysiwygRef.current?.innerHTML ?? '';
  }, [mode]);

  const getMarkdown = useCallback((): string => {
    if (mode === 'wysiwyg') {
      return htmlToMarkdown(wysiwygRef.current?.innerHTML ?? '');
    }
    return markdownRef.current?.value ?? '';
  }, [mode]);

  const emitChange = useCallback(() => {
    onChange?.(getHTML());
  }, [getHTML, onChange]);

  const setHTML = useCallback(
    (html: string) => {
      if (wysiwygRef.current) {
        wysiwygRef.current.innerHTML = html;
      }
      if (markdownRef.current) {
        markdownRef.current.value = htmlToMarkdown(html);
      }
      onChange?.(html);
    },
    [onChange]
  );

  const insertText = useCallback(
    (text: string) => {
      if (mode === 'markdown' && markdownRef.current) {
        const el = markdownRef.current;
        const start = el.selectionStart ?? el.value.length;
        const end = el.selectionEnd ?? el.value.length;
        el.value = el.value.slice(0, start) + text + el.value.slice(end);
        el.selectionStart = el.selectionEnd = start + text.length;
        emitChange();
        return;
      }

      if (mode === 'wysiwyg' && wysiwygRef.current) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && wysiwygRef.current.contains(selection.anchorNode)) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          const textNode = document.createTextNode(text);
          range.insertNode(textNode);
          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          wysiwygRef.current.appendChild(document.createTextNode(text));
        }
        emitChange();
      }
    },
    [mode, emitChange]
  );

  useImperativeHandle(ref, () => ({ getHTML, getMarkdown, setHTML, insertText }), [
    getHTML,
    getMarkdown,
    setHTML,
    insertText
  ]);

  const switchMode = (nextMode: EditorMode) => {
    if (nextMode === mode) {
      return;
    }

    if (nextMode === 'markdown' && markdownRef.current) {
      markdownRef.current.value = htmlToMarkdown(wysiwygRef.current?.innerHTML ?? '');
    } else if (nextMode === 'wysiwyg' && wysiwygRef.current) {
      wysiwygRef.current.innerHTML = markdownToHtml(markdownRef.current?.value ?? '');
    }
    setMode(nextMode);
    hooks?.onModeChange?.(nextMode);
  };

  const insertMediaElement = useCallback(
    (tagName: 'img' | 'video', url: string, label: string) => {
      if (!wysiwygRef.current) {
        return;
      }

      const element = document.createElement(tagName);
      element.setAttribute('src', url);
      if (tagName === 'img') {
        element.setAttribute('alt', label);
      } else {
        element.setAttribute('controls', '');
        element.setAttribute('aria-label', label);
      }

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && wysiwygRef.current.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(element);
        range.setStartAfter(element);
        range.setEndAfter(element);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        wysiwygRef.current.appendChild(element);
      }
      emitChange();
    },
    [emitChange]
  );

  const handleMediaFile = useCallback(
    (file: File, description?: string) => {
      const isVideo = file.type.startsWith('video/');
      const tagName = isVideo ? 'video' : 'img';
      const hook = isVideo ? hooks?.addVideoBlobHook : hooks?.addImageBlobHook;
      const fallbackLabel = description || file.name;

      if (hook) {
        hook(file, (url, altText) => insertMediaElement(tagName, url, altText ?? fallbackLabel));
        return;
      }
      insertMediaElement(tagName, URL.createObjectURL(file), fallbackLabel);
    },
    [hooks, insertMediaElement]
  );

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData?.items;
    if (!items) {
      return;
    }

    const mediaFiles = Array.from(items)
      .filter((item) => item.kind === 'file')
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null && (file.type.startsWith('image/') || file.type.startsWith('video/')));

    if (mediaFiles.length === 0) {
      return;
    }
    event.preventDefault();
    mediaFiles.forEach((file) => handleMediaFile(file));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const mediaFiles = Array.from(event.dataTransfer?.files ?? []).filter(
      (file) => file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (mediaFiles.length === 0) {
      return;
    }
    event.preventDefault();
    mediaFiles.forEach((file) => handleMediaFile(file));
  };

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <button className={styles.toolbarButton} type="button" onClick={() => setImageDialogOpen(true)}>
            이미지
          </button>
        </div>

        {!hideModeSwitch ? (
          <div className={styles.toolbarGroup}>
            <button
              aria-pressed={mode === 'wysiwyg'}
              className={toolbarButtonClassName(mode === 'wysiwyg')}
              type="button"
              onClick={() => switchMode('wysiwyg')}
            >
              위지윅
            </button>
            <button
              aria-pressed={mode === 'markdown'}
              className={toolbarButtonClassName(mode === 'markdown')}
              type="button"
              onClick={() => switchMode('markdown')}
            >
              마크다운
            </button>
          </div>
        ) : null}
      </div>

      <div className={styles.body} style={{ height }}>
        <div
          className={mode === 'wysiwyg' ? styles.wysiwyg : `${styles.wysiwyg} ${styles.hidden}`}
          contentEditable
          ref={wysiwygRef}
          suppressContentEditableWarning
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          onInput={emitChange}
          onPaste={handlePaste}
        />
        <textarea
          className={mode === 'markdown' ? styles.markdown : `${styles.markdown} ${styles.hidden}`}
          ref={markdownRef}
          onChange={emitChange}
        />
      </div>

      <ImageInsertDialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onInsertFile={handleMediaFile}
        onInsertUrl={(url, description) => insertMediaElement('img', url, description || url)}
      />
    </div>
  );
}
