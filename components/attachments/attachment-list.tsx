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
import { MonochromeImage } from '@/components/ui/monochrome-image';

const actionClassName =
  'inline-flex h-9 items-center justify-center gap-1.5 border px-3 text-sm font-semibold transition focus-visible:outline-default-label focus-visible:outline-2 focus-visible:outline-offset-[-2px]';

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
      <div className="bg-default-fill flex min-h-64 items-center justify-center border border-default-separator p-3">
        <MonochromeImage
          alt={name}
          className="flex min-h-48 max-h-[70vh] max-w-full items-center justify-center"
          imageClassName="max-h-[70vh] max-w-full object-contain"
          src={previewUrl}
        />
      </div>
    );
  }

  if (attachment.mimeType?.startsWith('video/')) {
    return (
      <div className="bg-default-fill flex min-h-64 items-center justify-center border border-default-separator p-3">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          aria-label={name}
          className="max-h-[70vh] max-w-full"
          controls
          preload="metadata"
          src={previewUrl}
        />
      </div>
    );
  }

  if (attachment.mimeType?.startsWith('audio/')) {
    return (
      <div className="bg-default-fill flex min-h-24 items-center justify-center border border-default-separator p-6">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio aria-label={name} className="w-full" controls src={previewUrl} />
      </div>
    );
  }

  return (
    <iframe
      className="border-default-separator h-[70vh] w-full border bg-default-surface"
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
    <section className="border-default-separator bg-default-surface border px-5 py-5 sm:px-8 sm:py-6" aria-labelledby="article-attachment-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p id="article-attachment-title" className="text-default-primary text-[0.65rem] font-bold tracking-[0.18em] uppercase">첨부파일</p>
          <p className="text-default-tertiary-label text-xs">파일을 선택해 미리보거나 다운로드할 수 있습니다.</p>
        </div>
        <span className="text-default-secondary-label text-xs">{attachments.length}개 첨부</span>
      </div>

      <div className="mt-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            className={`${actionClassName} border-default-separator bg-default-surface text-default-label hover:bg-default-fill w-full sm:w-auto`}
            href={`/api/attachments/download-zip?articleId=${encodeURIComponent(articleId)}`}
          >
            <FileArchive aria-hidden className="size-4" />
            전체 다운로드
          </a>
        </div>

        <ul className="border-default-separator bg-default-surface mt-4 overflow-hidden border">
        {attachments.map((attachment) => {
          const name = attachment.originalName ?? attachment.name ?? '첨부파일';

          return (
            <li
              className="border-default-separator hover:bg-default-fill/45 flex flex-col gap-3 border-b px-3.5 py-3.5 transition-colors last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-4"
              key={attachment.id}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="border-default-separator bg-default-fill text-default-secondary-label flex size-10 shrink-0 items-center justify-center border">
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
                    className={`${actionClassName} border-default-separator text-default-secondary-label hover:bg-default-fill w-full sm:w-auto`}
                    type="button"
                    onClick={() => setPreviewAttachment(attachment)}
                  >
                    <Eye aria-hidden className="size-4" />
                    미리보기
                  </button>
                ) : null}
                <a
                  className={`${actionClassName} border-default-separator text-default-label hover:bg-default-fill w-full sm:w-auto`}
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
      </div>

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
                className={`${actionClassName} border-default-separator bg-default-surface text-default-secondary-label hover:bg-default-fill`}
                type="button"
                onClick={() => setPreviewAttachment(null)}
              >
                닫기
              </button>
              <a
                className={`${actionClassName} border-default-primary bg-default-primary text-white hover:bg-default-primary-muted`}
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
        variant="editorial"
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
