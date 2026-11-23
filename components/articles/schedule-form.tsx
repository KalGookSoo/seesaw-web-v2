'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, FileText, Trash2, X } from 'lucide-react';

import type { AttachmentResponse } from '@/types/attachment';
import type { EventStatus, VEventResponse } from '@/types/event';
import { deleteAttachment } from '@/lib/attachments';
import { createEvent, EVENT_STATUSES, toDateTimeLocal, updateEvent } from '@/lib/events';
import { AttachmentUpload } from '@/components/articles/attachment-upload';
import { useToast } from '@/components/ui/toast';
import { ArticleEditor } from '@/components/articles/article-editor';
import { Confirm } from '@/components/ui/confirm';

type InlineFile = Readonly<{
  file: File;
  src: string;
}>;

function collectBlobSources(content: string, selector: string): Set<string> {
  const document = new DOMParser().parseFromString(content, 'text/html');
  return new Set(
    Array.from(document.querySelectorAll<HTMLImageElement | HTMLVideoElement>(selector))
      .map((element) => element.src)
      .filter((src) => src.startsWith('blob:'))
  );
}

type ScheduleFormProps = Readonly<{
  mode: 'create' | 'edit';
  categoryId: string;
  categoryName: string;
  cancelHref: string;
  successHref: string;
  eventId?: string;
  initialEvent?: VEventResponse;
  initialAttachments?: readonly AttachmentResponse[];
}>;

export function ScheduleForm({
  mode,
  categoryId,
  categoryName,
  cancelHref,
  successHref,
  eventId,
  initialEvent,
  initialAttachments = []
}: ScheduleFormProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState(initialEvent?.title ?? '');
  const [dtStart, setDtStart] = useState(toDateTimeLocal(initialEvent?.dtStart));
  const [dtEnd, setDtEnd] = useState(toDateTimeLocal(initialEvent?.dtEnd));
  const [location, setLocation] = useState(initialEvent?.location ?? '');
  const [status, setStatus] = useState<EventStatus>(initialEvent?.status ?? 'CONFIRMED');
  const [content, setContent] = useState(initialEvent?.description ?? initialEvent?.article?.content ?? '');
  const [files, setFiles] = useState<File[]>([]);
  const [inlineImages, setInlineImages] = useState<InlineFile[]>([]);
  const [inlineVideos, setInlineVideos] = useState<InlineFile[]>([]);
  const [attachments, setAttachments] = useState<readonly AttachmentResponse[]>(initialAttachments);
  const [attachmentToDelete, setAttachmentToDelete] = useState<AttachmentResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !dtStart || !dtEnd) {
      showToast('제목과 시작·종료 일시를 입력해주세요.', 'error');
      return;
    }
    if (new Date(dtEnd) < new Date(dtStart)) {
      showToast('종료 일시는 시작 일시 이후여야 합니다.', 'error');
      return;
    }

    setSubmitting(true);
    const inlineImageSources = collectBlobSources(content, 'img[src]');
    const inlineVideoSources = collectBlobSources(content, 'video[src]');
    const command = {
      categoryId,
      dtStart,
      dtEnd,
      title,
      content,
      location,
      status,
      multipartFiles: files,
      inlineImages: inlineImages
        .filter((inlineFile) => inlineImageSources.has(inlineFile.src))
        .map((inlineFile) => inlineFile.file),
      inlineVideos: inlineVideos
        .filter((inlineFile) => inlineVideoSources.has(inlineFile.src))
        .map((inlineFile) => inlineFile.file)
    };
    const result = mode === 'create'
      ? await createEvent(command)
      : await updateEvent(eventId ?? '', command);
    setSubmitting(false);

    if ('message' in result) {
      showToast(result.message, 'error');
      return;
    }
    showToast(mode === 'create' ? '일정을 등록했습니다.' : '일정을 수정했습니다.', 'success');
    window.location.href = successHref;
  }

  async function handleDeleteAttachment() {
    if (!attachmentToDelete) {
      return;
    }

    try {
      await deleteAttachment(attachmentToDelete.id);
      setAttachments((current) =>
        current.filter((attachment) => attachment.id !== attachmentToDelete.id)
      );
      showToast('첨부파일을 삭제했습니다.', 'success');
    } catch {
      showToast('첨부파일을 삭제하지 못했습니다.', 'error');
    } finally {
      setAttachmentToDelete(null);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <header className="space-y-3">
        <p className="text-default-tertiary-label text-[0.65rem] font-semibold tracking-[0.2em] uppercase">
          {mode === 'create' ? 'New schedule' : 'Edit schedule'}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-default-label text-2xl font-semibold tracking-tight">
              {mode === 'create' ? '새 일정 작성' : '일정 수정'}
            </h1>
            <p className="text-default-secondary-label mt-2 text-sm">{categoryName}</p>
          </div>
        </div>
      </header>

      <section className="border-default-separator bg-default-surface overflow-hidden border">
        <div className="border-default-separator border-b px-5 py-5 sm:px-7">
          <label className="text-default-label block text-sm font-semibold" htmlFor="schedule-title">일정 제목</label>
          <input id="schedule-title" className="border-default-separator bg-default-surface text-default-label placeholder:text-default-tertiary-label mt-3 h-12 w-full border-x-0 border-t-0 border-b px-0 text-xl font-semibold outline-none focus:border-default-label" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="일정 제목을 입력하세요" required />
        </div>
        <div className="grid gap-4 border-b border-default-separator px-5 py-5 sm:grid-cols-2 sm:px-7">
          <label className="text-default-label text-sm font-medium" htmlFor="schedule-start">시작 일시<input id="schedule-start" className="border-default-separator bg-default-fill text-default-label mt-2 h-11 w-full border px-3 text-base" type="datetime-local" value={dtStart} onChange={(event) => setDtStart(event.target.value)} required /></label>
          <label className="text-default-label text-sm font-medium" htmlFor="schedule-end">종료 일시<input id="schedule-end" className="border-default-separator bg-default-fill text-default-label mt-2 h-11 w-full border px-3 text-base" type="datetime-local" value={dtEnd} onChange={(event) => setDtEnd(event.target.value)} required /></label>
          <label className="text-default-label text-sm font-medium" htmlFor="schedule-location">장소<input id="schedule-location" className="border-default-separator bg-default-fill text-default-label mt-2 h-11 w-full border px-3 text-base" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="장소를 입력하세요" /></label>
          <label className="text-default-label text-sm font-medium" htmlFor="schedule-status">상태<select id="schedule-status" className="border-default-separator bg-default-fill text-default-label mt-2 h-11 w-full border px-3 text-base" value={status} onChange={(event) => setStatus(event.target.value as EventStatus)}>{EVENT_STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        </div>
        <details className="group border-default-separator border-b">
          <summary className="text-default-label hover:bg-default-fill flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold transition [&::-webkit-details-marker]:hidden sm:px-7">
            <span className="flex min-w-0 items-center gap-2">
              <FileText aria-hidden className="size-4 shrink-0" />
              <span>첨부파일</span>
              <span className="text-default-tertiary-label">{files.length + attachments.length}</span>
            </span>
            <ChevronDown aria-hidden className="text-default-tertiary-label size-4 shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-default-separator space-y-3 border-t px-5 py-5 sm:px-7">
            <div>
              <p className="text-default-label text-sm font-medium">파일 추가</p>
              <p className="text-default-tertiary-label mt-1 text-xs">일정과 함께 제공할 파일을 추가합니다.</p>
            </div>
            <AttachmentUpload files={files} onChange={setFiles} />
            {attachments.length > 0 ? (
              <div className="space-y-2">
                <p className="text-default-secondary-label text-xs font-semibold">기존 첨부파일</p>
                <ul className="border-default-separator overflow-hidden border">
                  {attachments.map((attachment) => (
                    <li className="border-default-separator flex items-center justify-between gap-3 border-b px-4 py-2.5 last:border-b-0" key={attachment.id}>
                      <span className="text-default-label truncate text-sm">{attachment.originalName ?? attachment.name}</span>
                      <button
                        aria-label={`${attachment.originalName ?? attachment.name ?? '첨부파일'} 삭제`}
                        className="text-default-tertiary-label hover:bg-default-fill hover:text-default-red focus-visible:outline-default-label shrink-0 p-1.5 transition focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                        type="button"
                        onClick={() => setAttachmentToDelete(attachment)}
                      >
                        <Trash2 aria-hidden className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </details>
        <div className="border-default-separator border-t">
          <div className="bg-default-fill border-default-separator border-b px-5 py-3 sm:px-7"><span className="text-default-label text-sm font-semibold">일정 상세</span></div>
          <div className="px-5 py-5 sm:px-7 sm:py-7"><ArticleEditor initialContent={content} onChange={setContent} onInlineImage={(file, src) => setInlineImages((current) => [...current, { file, src }])} onInlineVideo={(file, src) => setInlineVideos((current) => [...current, { file, src }])} onImageError={(message) => showToast(message, 'error')} /></div>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Link className="border-default-separator bg-default-surface text-default-secondary-label inline-flex h-11 items-center border px-5 text-sm font-semibold" href={cancelHref}>취소</Link>
        <button className="bg-default-label text-default-surface inline-flex h-11 items-center px-5 text-sm font-semibold disabled:opacity-50" type="submit" disabled={submitting}>{submitting ? '저장 중...' : '저장'}</button>
      </div>

      <Confirm
        confirmLabel="삭제"
        onCancel={() => setAttachmentToDelete(null)}
        onConfirm={handleDeleteAttachment}
        open={attachmentToDelete !== null}
        title="첨부파일을 삭제할까요?"
        tone="danger"
      >
        삭제한 첨부파일은 복구할 수 없습니다.
      </Confirm>
    </form>
  );
}
