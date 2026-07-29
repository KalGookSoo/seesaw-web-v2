'use client';

import { useRef, useState } from 'react';
import { File as FileIcon, Trash2, Upload } from 'lucide-react';

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function AttachmentUpload({
  files,
  onChange
}: Readonly<{
  files: readonly File[];
  onChange: (files: File[]) => void;
}>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [oversizeError, setOversizeError] = useState<string | null>(null);

  const addFiles = (incoming: FileList | File[]) => {
    const accepted: File[] = [];
    let rejected = false;

    Array.from(incoming).forEach((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        rejected = true;
        return;
      }
      accepted.push(file);
    });

    setOversizeError(
      rejected ? '50MB를 초과하는 파일은 첨부할 수 없습니다.' : null
    );
    if (accepted.length > 0) {
      onChange([...files, ...accepted]);
    }
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition ${
          dragging
            ? 'border-default-blue bg-default-blue-soft'
            : 'border-default-separator bg-default-fill/40 hover:bg-default-fill'
        }`}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        <Upload aria-hidden className="text-default-tertiary-label size-6" />
        <p className="text-default-secondary-label text-sm">
          파일을 드래그하거나 클릭하여 첨부하세요
        </p>
        <p className="text-default-tertiary-label text-xs">
          여러 파일을 한 번에 추가할 수 있습니다.
        </p>
        <input
          ref={inputRef}
          className="sr-only"
          multiple
          type="file"
          onChange={(event) => {
            if (event.target.files) {
              addFiles(event.target.files);
            }
            event.target.value = '';
          }}
        />
      </div>

      {oversizeError ? (
        <p className="text-default-red text-xs">{oversizeError}</p>
      ) : null}

      {files.length > 0 ? (
        <ul className="border-default-separator overflow-hidden rounded-lg border">
          {files.map((file, index) => (
            <li
              className="border-default-separator flex items-center justify-between gap-3 border-b px-4 py-2.5 last:border-b-0"
              key={`${file.name}-${file.size}-${index}`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <FileIcon
                  aria-hidden
                  className="text-default-secondary-label size-4 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-default-label truncate text-sm font-medium">
                    {file.name}
                  </p>
                  <p className="text-default-tertiary-label text-xs">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                aria-label={`${file.name} 제거`}
                className="text-default-tertiary-label hover:bg-default-fill hover:text-default-red shrink-0 rounded-full p-1.5 transition"
                type="button"
                onClick={() => removeFile(index)}
              >
                <Trash2 aria-hidden className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
