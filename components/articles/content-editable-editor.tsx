'use client';

import { useEffect, useImperativeHandle, useRef } from 'react';

export type ContentEditableEditorHandle = Readonly<{
  getHtml: () => string;
  getInlineImageFiles: () => File[];
}>;

type ContentEditableEditorProps = Readonly<{
  ref: React.Ref<ContentEditableEditorHandle>;
  initialHtml?: string;
  onChange?: (html: string) => void;
}>;

function isImageFile(file: File | null): file is File {
  return file !== null && file.type.startsWith('image/');
}

export function ContentEditableEditor({
  ref,
  initialHtml,
  onChange
}: ContentEditableEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<Map<string, File>>(new Map());
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current && editorRef.current) {
      editorRef.current.innerHTML = initialHtml ?? '';
      initializedRef.current = true;
    }
    // 최초 마운트에서만 초기값을 채운다 - 이후 initialHtml 변경은 무시한다(입력 중 커서 튐 방지).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emitChange = () => {
    onChange?.(editorRef.current?.innerHTML ?? '');
  };

  const insertImageFile = (file: File) => {
    const url = URL.createObjectURL(file);
    blobsRef.current.set(url, file);

    const image = document.createElement('img');
    image.src = url;
    image.alt = file.name;

    const selection = window.getSelection();
    if (
      selection &&
      selection.rangeCount > 0 &&
      editorRef.current?.contains(selection.anchorNode)
    ) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(image);
      range.setStartAfter(image);
      range.setEndAfter(image);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      editorRef.current?.appendChild(image);
    }

    emitChange();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData?.items;
    if (!items) {
      return;
    }

    const imageFiles = Array.from(items)
      .filter((item) => item.kind === 'file')
      .map((item) => item.getAsFile())
      .filter(isImageFile);

    if (imageFiles.length > 0) {
      event.preventDefault();
      imageFiles.forEach(insertImageFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const imageFiles = Array.from(event.dataTransfer?.files ?? []).filter(
      (file) => file.type.startsWith('image/')
    );

    if (imageFiles.length > 0) {
      event.preventDefault();
      imageFiles.forEach(insertImageFile);
    }
  };

  useImperativeHandle(ref, () => ({
    getHtml: () => editorRef.current?.innerHTML ?? '',
    getInlineImageFiles: () => {
      const html = editorRef.current?.innerHTML ?? '';
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const blobUrls = Array.from(
        doc.querySelectorAll('img[src^="blob:"]')
      ).map((image) => image.getAttribute('src') ?? '');

      return blobUrls
        .filter((url) => blobsRef.current.has(url))
        .map((url) => blobsRef.current.get(url)!);
    }
  }));

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      className="border-default-separator bg-default-surface text-default-label focus:border-default-blue min-h-[320px] w-full rounded-lg border p-4 text-sm leading-7 outline-none [&_img]:max-w-full [&_img]:rounded-md"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      onInput={emitChange}
      onPaste={handlePaste}
    />
  );
}
