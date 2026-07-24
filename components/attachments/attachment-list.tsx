'use client';

import { useState } from 'react';
import {
  Download,
  Eye,
  File,
  FileArchive,
  FileAudio,
  FileCode2,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType2,
  FileVideo,
  Presentation
} from 'lucide-react';

import type { AttachmentResponse } from '@/types/attachment';
import { Modal } from '@/components/ui/modal';

const actionClassName =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-md border px-3 text-sm font-semibold transition';

function toPreviewUrl(id: string): string {
  return `/api/attachments/${encodeURIComponent(id)}`;
}

function toDownloadUrl(id: string): string {
  return `/api/attachments/${encodeURIComponent(id)}/download`;
}

function AttachmentIcon({
  mimeType
}: Readonly<{
  mimeType: string | null | undefined;
}>) {
  const className = 'size-5';

  if (!mimeType) {
    return <File aria-hidden className={className} />;
  }
  if (mimeType.startsWith('image/')) {
    return <FileImage aria-hidden className={className} />;
  }
  if (mimeType.startsWith('video/')) {
    return <FileVideo aria-hidden className={className} />;
  }
  if (mimeType.startsWith('audio/')) {
    return <FileAudio aria-hidden className={className} />;
  }
  if (
    mimeType.includes('zip') ||
    mimeType.includes('archive') ||
    mimeType.includes('compressed')
  ) {
    return <FileArchive aria-hidden className={className} />;
  }
  if (mimeType.includes('spreadsheet') || mimeType.includes('ms-excel')) {
    return <FileSpreadsheet aria-hidden className={className} />;
  }
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
    return <Presentation aria-hidden className={className} />;
  }
  if (mimeType.includes('word') || mimeType === 'application/pdf') {
    return <FileType2 aria-hidden className={className} />;
  }
  if (
    mimeType.includes('javascript') ||
    mimeType.includes('json') ||
    mimeType.includes('xml') ||
    mimeType === 'text/html' ||
    mimeType === 'text/css'
  ) {
    return <FileCode2 aria-hidden className={className} />;
  }
  if (mimeType.startsWith('text/')) {
    return <FileText aria-hidden className={className} />;
  }

  return <File aria-hidden className={className} />;
}

function AttachmentPreview({
  attachment
}: Readonly<{
  attachment: AttachmentResponse;
}>) {
  const previewUrl = toPreviewUrl(attachment.id);
  const name = attachment.originalName ?? attachment.name ?? '첨부파일';

  if (attachment.mimeType?.startsWith('image/')) {
    return (
      <div className="bg-default-fill flex min-h-64 items-center justify-center rounded-lg p-3">
        <img
          alt={name}
          className="max-h-[70vh] max-w-full rounded-md object-contain"
          src={previewUrl}
        />
      </div>
    );
  }

  return (
    <iframe
      className="border-default-separator h-[70vh] w-full rounded-lg border bg-white"
      src={previewUrl}
      title={`${name} 미리보기`}
      sandbox=""
    />
  );
}

export function AttachmentList({
  articleId,
  attachments
}: Readonly<{
  articleId: string;
  attachments: readonly AttachmentResponse[];
}>) {
  const [previewAttachment, setPreviewAttachment] =
    useState<AttachmentResponse | null>(null);

  if (attachments.length === 0) {
    return null;
  }

  return (
    <section className="border-default-separator border-t px-5 py-6 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <FileText aria-hidden className="size-4" />
          첨부파일
          <span className="text-default-tertiary-label">
            {attachments.length}
          </span>
        </h2>
        <a
          className={`${actionClassName} border-default-separator bg-default-surface text-default-blue hover:border-default-blue-muted hover:bg-default-blue-soft`}
          href={`/api/attachments/download-zip?articleId=${encodeURIComponent(articleId)}`}
        >
          <FileArchive aria-hidden className="size-4" />
          전체 다운로드
        </a>
      </div>

      <ul className="border-default-separator mt-4 overflow-hidden rounded-lg border">
        {attachments.map((attachment) => {
          const name = attachment.originalName ?? attachment.name ?? '첨부파일';

          return (
            <li
              className="border-default-separator bg-default-surface flex flex-col gap-3 border-b px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              key={attachment.id}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="bg-default-blue-soft text-default-blue-contrast flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <AttachmentIcon mimeType={attachment.mimeType} />
                </span>
                <div className="min-w-0">
                  <p className="text-default-label truncate text-sm font-medium">
                    {name}
                  </p>
                  <p className="text-default-tertiary-label mt-0.5 text-xs">
                    {attachment.formattedSize ?? attachment.mimeType ?? '파일'}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 justify-end gap-2">
                {attachment.previewable ? (
                  <button
                    className={`${actionClassName} border-default-green-muted text-default-green-contrast hover:bg-default-green-soft`}
                    type="button"
                    onClick={() => setPreviewAttachment(attachment)}
                  >
                    <Eye aria-hidden className="size-4" />
                    미리보기
                  </button>
                ) : null}
                <a
                  className={`${actionClassName} border-default-blue-muted text-default-blue hover:bg-default-blue-soft`}
                  href={toDownloadUrl(attachment.id)}
                >
                  <Download aria-hidden className="size-4" />
                  다운로드
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      <Modal
        description={
          previewAttachment?.formattedSize ??
          previewAttachment?.mimeType ??
          undefined
        }
        footer={
          previewAttachment ? (
            <>
              <button
                className={`${actionClassName} border-default-separator text-default-secondary-label hover:bg-default-fill`}
                type="button"
                onClick={() => setPreviewAttachment(null)}
              >
                닫기
              </button>
              <a
                className={`${actionClassName} border-default-blue bg-default-blue text-white hover:brightness-95`}
                href={toDownloadUrl(previewAttachment.id)}
              >
                <Download aria-hidden className="size-4" />
                다운로드
              </a>
            </>
          ) : null
        }
        onClose={() => setPreviewAttachment(null)}
        open={previewAttachment !== null}
        size="lg"
        title={
          previewAttachment?.originalName ??
          previewAttachment?.name ??
          '첨부파일 미리보기'
        }
      >
        {previewAttachment ? (
          <AttachmentPreview attachment={previewAttachment} />
        ) : null}
      </Modal>
    </section>
  );
}
