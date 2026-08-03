'use client';

import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import styles from '@/components/editor/editor.module.css';
import { ImageInsertDialog } from '@/components/editor/image-insert-dialog';
import { LinkInsertDialog } from '@/components/editor/link-insert-dialog';
import { htmlToMarkdown, markdownToHtml } from '@/components/editor/markdown-conversion';
import { TableInsertDialog } from '@/components/editor/table-insert-dialog';
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
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkInitialText, setLinkInitialText] = useState('');
  const wysiwygRef = useRef<HTMLDivElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const initializedRef = useRef(false);
  const savedRangeRef = useRef<Range | null>(null);

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

  const applyInlineCommand = useCallback(
    (command: string) => {
      wysiwygRef.current?.focus();
      document.execCommand(command);
      emitChange();
    },
    [emitChange]
  );

  const applyFormatBlock = useCallback(
    (tag: string) => {
      wysiwygRef.current?.focus();
      document.execCommand('formatBlock', false, tag);
      emitChange();
    },
    [emitChange]
  );

  const toggleFormatBlock = useCallback(
    (tag: string) => {
      wysiwygRef.current?.focus();
      const current = document.queryCommandValue('formatBlock').toUpperCase();
      document.execCommand('formatBlock', false, current === tag ? 'P' : tag);
      emitChange();
    },
    [emitChange]
  );

  const toggleInlineCode = useCallback(() => {
    if (!wysiwygRef.current) {
      return;
    }
    wysiwygRef.current.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !wysiwygRef.current.contains(selection.anchorNode)) {
      return;
    }
    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      return;
    }

    const startContainer =
      range.commonAncestorContainer instanceof Element
        ? range.commonAncestorContainer
        : range.commonAncestorContainer.parentElement;
    const existingCode = startContainer?.closest('code');

    if (existingCode && wysiwygRef.current.contains(existingCode)) {
      const text = document.createTextNode(existingCode.textContent ?? '');
      existingCode.replaceWith(text);
      const newRange = document.createRange();
      newRange.selectNode(text);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      const content = range.extractContents();
      const code = document.createElement('code');
      code.appendChild(content);
      range.insertNode(code);
      range.selectNode(code);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    emitChange();
  }, [emitChange]);

  const toggleList = useCallback(
    (ordered: boolean) => {
      wysiwygRef.current?.focus();
      document.execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList');
      emitChange();
    },
    [emitChange]
  );

  const closestListItem = (node: Node | null | undefined): HTMLLIElement | null => {
    const el = node instanceof Element ? node : (node?.parentElement ?? null);
    return el?.closest('li') ?? null;
  };

  const toggleTaskList = useCallback(() => {
    if (!wysiwygRef.current) {
      return;
    }
    wysiwygRef.current.focus();

    let selection = window.getSelection();
    let li = closestListItem(selection?.anchorNode);
    if (!li) {
      document.execCommand('insertUnorderedList');
      selection = window.getSelection();
      li = closestListItem(selection?.anchorNode);
    }
    if (!li || !wysiwygRef.current.contains(li)) {
      return;
    }

    const existingCheckbox = li.querySelector(':scope > input[type="checkbox"]');
    if (existingCheckbox) {
      existingCheckbox.remove();
    } else {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      li.insertBefore(checkbox, li.firstChild);
    }
    emitChange();
  }, [emitChange]);

  const normalizeListNesting = (root: HTMLElement) => {
    // execCommand('indent')는 목록을 <li> 안이 아니라 형제로 겹쳐 쌓을 때가 있어(ul > ul),
    // 마크다운 변환기가 li의 자식만 순회하다 내용을 잃어버린다. 항상 이전 <li> 안으로 옮겨 정규화한다.
    root.querySelectorAll('ul, ol').forEach((list) => {
      const parent = list.parentElement;
      if (!parent || (parent.tagName !== 'UL' && parent.tagName !== 'OL')) {
        return;
      }
      const previousLi = list.previousElementSibling;
      if (previousLi && previousLi.tagName === 'LI') {
        previousLi.appendChild(list);
      } else {
        list.replaceWith(...Array.from(list.children));
      }
    });

    // execCommand('outdent')는 하위 항목을 새 <ul>로 감싸지 않고 <li> 안에 <li>를 그대로 남길 때가 있어,
    // 마크다운 변환기가 이를 하나의 항목 텍스트로 이어붙여 버린다. 상위 <li>의 다음 형제로 꺼내 정규화한다.
    root.querySelectorAll('li').forEach((li) => {
      const parent = li.parentElement;
      if (parent && parent.tagName === 'LI') {
        parent.insertAdjacentElement('afterend', li);
      }
    });
  };

  const applyIndent = useCallback(
    (outdent: boolean) => {
      if (!wysiwygRef.current) {
        return;
      }
      wysiwygRef.current.focus();
      document.execCommand(outdent ? 'outdent' : 'indent');
      normalizeListNesting(wysiwygRef.current);
      emitChange();
    },
    [emitChange]
  );

  const insertHorizontalRule = useCallback(() => {
    if (!wysiwygRef.current) {
      return;
    }
    wysiwygRef.current.focus();

    const hr = document.createElement('hr');
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && wysiwygRef.current.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(hr);
      range.setStartAfter(hr);
      range.setEndAfter(hr);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      wysiwygRef.current.appendChild(hr);
    }
    emitChange();
  }, [emitChange]);

  const closestCell = (node: Node | null | undefined): HTMLTableCellElement | null => {
    const el = node instanceof Element ? node : (node?.parentElement ?? null);
    return el?.closest('td, th') ?? null;
  };

  const insertTable = useCallback(
    (rows: number, columns: number) => {
      if (!wysiwygRef.current) {
        return;
      }
      wysiwygRef.current.focus();

      const headerRow = `<tr>${'<th></th>'.repeat(columns)}</tr>`;
      const bodyRow = `<tr>${'<td></td>'.repeat(columns)}</tr>`;
      const table = document.createElement('table');
      table.innerHTML = `<thead>${headerRow}</thead><tbody>${bodyRow.repeat(Math.max(rows - 1, 0))}</tbody>`;

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && wysiwygRef.current.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(table);
        range.setStartAfter(table);
        range.setEndAfter(table);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        wysiwygRef.current.appendChild(table);
      }
      emitChange();
    },
    [emitChange]
  );

  const currentTableCell = (): {
    cell: HTMLTableCellElement;
    row: HTMLTableRowElement;
    table: HTMLTableElement;
  } | null => {
    if (!wysiwygRef.current) {
      return null;
    }
    const selection = window.getSelection();
    const cell = closestCell(selection?.anchorNode);
    const row = cell?.closest('tr');
    const table = row?.closest('table');
    if (!cell || !row || !table || !wysiwygRef.current.contains(table)) {
      return null;
    }
    return { cell, row, table };
  };

  const addTableRow = useCallback(() => {
    const context = currentTableCell();
    if (!context) {
      return;
    }
    const { row } = context;
    const columnCount = row.children.length;
    const newRow = document.createElement('tr');
    for (let i = 0; i < columnCount; i += 1) {
      newRow.appendChild(document.createElement('td'));
    }
    row.insertAdjacentElement('afterend', newRow);
    emitChange();
  }, [emitChange]);

  const removeTableRow = useCallback(() => {
    const context = currentTableCell();
    if (!context) {
      return;
    }
    const { row, table } = context;
    if (table.querySelectorAll('tr').length <= 1) {
      table.remove();
    } else {
      row.remove();
    }
    emitChange();
  }, [emitChange]);

  const addTableColumn = useCallback(() => {
    const context = currentTableCell();
    if (!context) {
      return;
    }
    const { cell, row, table } = context;
    const columnIndex = Array.from(row.children).indexOf(cell);
    table.querySelectorAll('tr').forEach((tr) => {
      const referenceCell = tr.children[columnIndex];
      const newCell = document.createElement(referenceCell?.tagName === 'TH' ? 'th' : 'td');
      if (referenceCell) {
        referenceCell.insertAdjacentElement('afterend', newCell);
      } else {
        tr.appendChild(newCell);
      }
    });
    emitChange();
  }, [emitChange]);

  const removeTableColumn = useCallback(() => {
    const context = currentTableCell();
    if (!context) {
      return;
    }
    const { cell, row, table } = context;
    const columnIndex = Array.from(row.children).indexOf(cell);
    if (row.children.length <= 1) {
      table.remove();
    } else {
      table.querySelectorAll('tr').forEach((tr) => {
        tr.children[columnIndex]?.remove();
      });
    }
    emitChange();
  }, [emitChange]);

  const moveToAdjacentCell = (cell: HTMLTableCellElement, backward: boolean) => {
    const row = cell.closest('tr');
    const table = row?.closest('table');
    if (!row || !table) {
      return;
    }

    const cellsInRow = Array.from(row.children) as HTMLTableCellElement[];
    const cellIndex = cellsInRow.indexOf(cell);
    const rows = Array.from(table.querySelectorAll('tr'));
    const rowIndex = rows.indexOf(row);

    const targetCell = backward
      ? (cellsInRow[cellIndex - 1] ?? (rows[rowIndex - 1]?.lastElementChild as HTMLTableCellElement | null))
      : (cellsInRow[cellIndex + 1] ?? (rows[rowIndex + 1]?.firstElementChild as HTMLTableCellElement | null));
    if (!targetCell) {
      return;
    }

    const range = document.createRange();
    range.selectNodeContents(targetCell);
    range.collapse(true);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const openLinkDialog = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && wysiwygRef.current?.contains(selection.anchorNode) && !selection.isCollapsed) {
      // 다이얼로그로 포커스가 넘어가면 이 selection은 사라지므로, 나중에 삽입할 때 쓸 수 있도록 미리 복제해 저장한다.
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
      setLinkInitialText(savedRangeRef.current.toString());
    } else {
      savedRangeRef.current = null;
      setLinkInitialText('');
    }
    setLinkDialogOpen(true);
  }, []);

  const insertLink = useCallback(
    (text: string, url: string) => {
      if (!wysiwygRef.current) {
        return;
      }
      wysiwygRef.current.focus();

      const anchor = document.createElement('a');
      anchor.setAttribute('href', url);
      anchor.textContent = text;

      const range = savedRangeRef.current;
      const selection = window.getSelection();
      if (range && wysiwygRef.current.contains(range.commonAncestorContainer)) {
        selection?.removeAllRanges();
        selection?.addRange(range);
        range.deleteContents();
        range.insertNode(anchor);
        range.setStartAfter(anchor);
        range.setEndAfter(anchor);
        selection?.removeAllRanges();
        selection?.addRange(range);
      } else if (selection && selection.rangeCount > 0 && wysiwygRef.current.contains(selection.anchorNode)) {
        const currentRange = selection.getRangeAt(0);
        currentRange.deleteContents();
        currentRange.insertNode(anchor);
        currentRange.setStartAfter(anchor);
        currentRange.setEndAfter(anchor);
        selection.removeAllRanges();
        selection.addRange(currentRange);
      } else {
        wysiwygRef.current.appendChild(anchor);
      }

      savedRangeRef.current = null;
      emitChange();
    },
    [emitChange]
  );

  const stopMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  useEffect(() => {
    const container = wysiwygRef.current;
    if (!container) {
      return;
    }

    // 할 일 목록 체크박스는 DOM에 직접 삽입되어 React onChange 델리게이션(체크박스 value tracking)을 타지 않으므로
    // 네이티브 리스너로 잡아 checked 속성을 동기화해야 직렬화된 HTML/마크다운에 상태가 반영된다.
    const handleCheckboxChange = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') {
        return;
      }
      if (target.checked) {
        target.setAttribute('checked', '');
      } else {
        target.removeAttribute('checked');
      }
      emitChange();
    };

    container.addEventListener('change', handleCheckboxChange);
    return () => container.removeEventListener('change', handleCheckboxChange);
  }, [emitChange]);

  const handleEditorKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      const selection = window.getSelection();
      const cell = closestCell(selection?.anchorNode);
      if (cell) {
        event.preventDefault();
        moveToAdjacentCell(cell, event.shiftKey);
        return;
      }
      if (closestListItem(selection?.anchorNode)) {
        event.preventDefault();
        applyIndent(event.shiftKey);
      }
      return;
    }

    if (!(event.metaKey || event.ctrlKey)) {
      return;
    }

    const key = event.key.toLowerCase();
    if (key === 'b') {
      event.preventDefault();
      applyInlineCommand('bold');
    } else if (key === 'i') {
      event.preventDefault();
      applyInlineCommand('italic');
    } else if (event.shiftKey && key === 'x') {
      event.preventDefault();
      applyInlineCommand('strikeThrough');
    } else if (key === 'e') {
      event.preventDefault();
      toggleInlineCode();
    } else if (key === 'k') {
      event.preventDefault();
      openLinkDialog();
    } else if (event.shiftKey && event.key === '9') {
      event.preventDefault();
      toggleFormatBlock('BLOCKQUOTE');
    } else if (event.shiftKey && key === 'c') {
      event.preventDefault();
      toggleFormatBlock('PRE');
    } else if (event.shiftKey && event.key === '8') {
      event.preventDefault();
      toggleList(false);
    } else if (event.shiftKey && event.key === '7') {
      event.preventDefault();
      toggleList(true);
    } else if (event.shiftKey && event.key === '0') {
      event.preventDefault();
      toggleTaskList();
    } else if (event.altKey && ['1', '2', '3'].includes(event.key)) {
      event.preventDefault();
      applyFormatBlock(`H${event.key}`);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <select
            aria-label="제목 스타일"
            className={styles.headingSelect}
            defaultValue=""
            onChange={(event) => {
              const tag = event.target.value;
              if (tag) {
                applyFormatBlock(tag);
              }
              event.target.value = '';
            }}
          >
            <option disabled value="">
              제목
            </option>
            <option value="H1">제목 1</option>
            <option value="H2">제목 2</option>
            <option value="H3">제목 3</option>
            <option value="P">본문</option>
          </select>
          <button
            className={styles.toolbarButton}
            title="굵게 (Ctrl+B)"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={() => applyInlineCommand('bold')}
          >
            <strong>B</strong>
          </button>
          <button
            className={styles.toolbarButton}
            title="기울임 (Ctrl+I)"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={() => applyInlineCommand('italic')}
          >
            <em>I</em>
          </button>
          <button
            className={styles.toolbarButton}
            title="취소선 (Ctrl+Shift+X)"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={() => applyInlineCommand('strikeThrough')}
          >
            <span style={{ textDecoration: 'line-through' }}>S</span>
          </button>
          <button
            className={styles.toolbarButton}
            title="인라인 코드 (Ctrl+E)"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={toggleInlineCode}
          >
            {'</>'}
          </button>
          <button
            className={styles.toolbarButton}
            title="링크 삽입 (Ctrl+K)"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={openLinkDialog}
          >
            🔗
          </button>
          <button
            className={styles.toolbarButton}
            title="인용구 (Ctrl+Shift+9)"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={() => toggleFormatBlock('BLOCKQUOTE')}
          >
            “”
          </button>
          <button
            className={styles.toolbarButton}
            title="코드 블록 (Ctrl+Shift+C)"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={() => toggleFormatBlock('PRE')}
          >
            {'{ }'}
          </button>
          <span aria-hidden="true" className={styles.toolbarDivider} />
          <button
            className={styles.toolbarButton}
            title="글머리 기호 목록 (Ctrl+Shift+8)"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={() => toggleList(false)}
          >
            •
          </button>
          <button
            className={styles.toolbarButton}
            title="번호 매기기 목록 (Ctrl+Shift+7)"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={() => toggleList(true)}
          >
            1.
          </button>
          <button
            className={styles.toolbarButton}
            title="할 일 목록 (Ctrl+Shift+0)"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={toggleTaskList}
          >
            ☑
          </button>
          <button
            className={styles.toolbarButton}
            title="내어쓰기 (Shift+Tab)"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={() => applyIndent(true)}
          >
            ←
          </button>
          <button
            className={styles.toolbarButton}
            title="들여쓰기 (Tab)"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={() => applyIndent(false)}
          >
            →
          </button>
          <button
            className={styles.toolbarButton}
            title="구분선"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={insertHorizontalRule}
          >
            ―
          </button>
          <span aria-hidden="true" className={styles.toolbarDivider} />
          <button
            className={styles.toolbarButton}
            title="표 삽입"
            type="button"
            onClick={() => setTableDialogOpen(true)}
          >
            표
          </button>
          <button
            className={styles.toolbarButton}
            title="행 추가"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={addTableRow}
          >
            행+
          </button>
          <button
            className={styles.toolbarButton}
            title="행 삭제"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={removeTableRow}
          >
            행-
          </button>
          <button
            className={styles.toolbarButton}
            title="열 추가"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={addTableColumn}
          >
            열+
          </button>
          <button
            className={styles.toolbarButton}
            title="열 삭제"
            type="button"
            onMouseDown={stopMouseDown}
            onClick={removeTableColumn}
          >
            열-
          </button>
          <span aria-hidden="true" className={styles.toolbarDivider} />
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
          onKeyDown={handleEditorKeyDown}
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

      <TableInsertDialog open={tableDialogOpen} onClose={() => setTableDialogOpen(false)} onInsert={insertTable} />

      <LinkInsertDialog
        initialText={linkInitialText}
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        onInsert={insertLink}
      />
    </div>
  );
}
