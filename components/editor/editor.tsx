'use client';

import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

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

const modeButtonClassName = (active: boolean) =>
  `inline-flex h-8 items-center rounded px-3 text-xs font-semibold transition ${
    active ? 'bg-default-label text-default-background' : 'text-default-secondary-label hover:bg-default-fill'
  }`;

export function Editor({
  ref,
  initialValue = '',
  initialEditType = 'wysiwyg',
  height = '400px',
  hideModeSwitch = false,
  onChange
}: EditorProps) {
  const [mode, setMode] = useState<EditorMode>(initialEditType);
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
  };

  return (
    <div className="border-default-separator bg-default-surface flex flex-col overflow-hidden rounded-lg border">
      {!hideModeSwitch ? (
        <div className="border-default-separator flex gap-1 border-b p-1.5">
          <button
            aria-pressed={mode === 'wysiwyg'}
            className={modeButtonClassName(mode === 'wysiwyg')}
            type="button"
            onClick={() => switchMode('wysiwyg')}
          >
            위지윅
          </button>
          <button
            aria-pressed={mode === 'markdown'}
            className={modeButtonClassName(mode === 'markdown')}
            type="button"
            onClick={() => switchMode('markdown')}
          >
            마크다운
          </button>
        </div>
      ) : null}

      <div className="relative" style={{ height }}>
        <div
          className="h-full overflow-y-auto p-4 text-sm leading-7 outline-none [&_img]:max-w-full [&_img]:rounded-md [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-current/20 [&_td]:p-2 [&_th]:border [&_th]:border-current/20 [&_th]:p-2"
          contentEditable
          hidden={mode !== 'wysiwyg'}
          ref={wysiwygRef}
          suppressContentEditableWarning
          onInput={emitChange}
        />
        <textarea
          className="h-full w-full resize-none p-4 font-mono text-sm outline-none"
          hidden={mode !== 'markdown'}
          ref={markdownRef}
          onChange={emitChange}
        />
      </div>
    </div>
  );
}
