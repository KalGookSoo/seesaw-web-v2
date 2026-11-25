'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Loader2, Trash2, X } from 'lucide-react';

import type { AttachmentResponse } from '@/types/attachment';
import type { EventStatus, VEventResponse } from '@/types/event';
import { deleteAttachment } from '@/lib/attachments';
import { createEvent, EVENT_STATUSES, toDateTimeLocal, updateEvent } from '@/lib/events';
import { AttachmentUpload } from '@/components/articles/attachment-upload';
import { useToast } from '@/components/ui/toast';
import { ArticleEditor } from '@/components/articles/article-editor';
import { Confirm } from '@/components/ui/confirm';
import { DropdownSelect } from '@/components/ui/dropdown-select';
import { AddressSearchModal } from '@/components/articles/address-search-modal';

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
  const [addressSearchOpen, setAddressSearchOpen] = useState(false);
  const [locationDetail, setLocationDetail] = useState(initialEvent?.locationDetail ?? '');
  const [status, setStatus] = useState<EventStatus>(initialEvent?.status ?? 'CONFIRMED');
  const [content, setContent] = useState(initialEvent?.description ?? initialEvent?.article?.content ?? '');
  const [files, setFiles] = useState<File[]>([]);
  const [inlineImages, setInlineImages] = useState<InlineFile[]>([]);
  const [inlineVideos, setInlineVideos] = useState<InlineFile[]>([]);
  const [attachments, setAttachments] = useState<readonly AttachmentResponse[]>(initialAttachments);
  const [attachmentToDelete, setAttachmentToDelete] = useState<AttachmentResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const bodyCharacterCount = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().length;
  const scheduleDetailsReady = Boolean(title.trim() && dtStart && dtEnd);

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
      locationDetail,
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
    <form className="min-w-0 space-y-6" onSubmit={handleSubmit}>
      <header className="border-default-separator space-y-5 border-b pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-default-primary text-[0.65rem] font-bold tracking-[0.22em] uppercase">
            일정 · {mode === 'create' ? '새 일정' : '일정 수정'}
          </p>
          <span className="text-default-tertiary-label text-[0.65rem] font-semibold tracking-[0.18em] uppercase">{categoryName}</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-end">
          <div>
            <h1 className="text-default-label text-xl font-black tracking-[-0.05em] sm:text-2xl">{mode === 'create' ? '새 일정 작성' : '일정 수정'}</h1>
            <p className="text-default-secondary-label mt-4 max-w-xl text-sm leading-7">모임의 시간과 장소, 함께 볼 내용을 작성해주세요.</p>
          </div>
          <span className="border-default-separator border-l pl-4 text-xs text-default-tertiary-label">일정 정보</span>
        </div>
      </header>

      <section className="space-y-4">
        <section className="border-default-separator bg-default-surface border px-5 py-5 sm:px-7" aria-labelledby="schedule-info-title">
          <p id="schedule-info-title" className="text-default-tertiary-label text-[0.65rem] font-bold tracking-[0.18em] uppercase">01 · 일정 정보</p>
          <label className="mt-5 block" htmlFor="schedule-title">
            <input id="schedule-title" className="form-control border-x-0 border-t-0 border-b px-0 text-3xl font-black tracking-[-0.04em] sm:text-4xl" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="일정 제목을 입력하세요" required />
          </label>
          <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2">
            <label className="text-default-label text-sm font-medium" htmlFor="schedule-start">시작 일시<input id="schedule-start" className="form-control mt-2 text-base" type="datetime-local" value={dtStart} onChange={(event) => setDtStart(event.target.value)} required /></label>
            <label className="text-default-label text-sm font-medium" htmlFor="schedule-end">종료 일시<input id="schedule-end" className="form-control mt-2 text-base" type="datetime-local" value={dtEnd} onChange={(event) => setDtEnd(event.target.value)} required /></label>
            <div className="min-w-0"><label className="text-default-label text-sm font-medium" htmlFor="schedule-location">장소</label><div className="mt-2 flex gap-2"><input id="schedule-location" className="form-control min-w-0 flex-1 text-base" value={location} readOnly placeholder="주소를 검색해 선택하세요" /><button className="border-default-separator text-default-label hover:bg-default-fill shrink-0 border px-4 text-sm font-semibold" type="button" onClick={() => setAddressSearchOpen(true)}>주소 검색</button>{location ? <button className="border-default-separator text-default-secondary-label hover:bg-default-fill shrink-0 border px-3 text-sm" type="button" onClick={() => setLocation('')} aria-label="장소 지우기">지우기</button> : null}</div></div>
            <label className="text-default-label text-sm font-medium" htmlFor="schedule-location-detail">상세 장소<input id="schedule-location-detail" className="form-control mt-2 text-base" value={locationDetail} onChange={(event) => setLocationDetail(event.target.value)} maxLength={255} placeholder="층, 호수 등 상세 장소를 입력하세요" /></label>
            <label className="text-default-label text-sm font-medium">상태<DropdownSelect className="mt-2" options={EVENT_STATUSES} value={status} onValueChange={(value) => setStatus(value as EventStatus)} /></label>
          </div>
        </section>

        <section className="border-default-separator bg-default-surface border" aria-labelledby="schedule-body-title">
          <div className="border-default-separator flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-7">
            <span id="schedule-body-title" className="text-default-tertiary-label text-[0.65rem] font-bold tracking-[0.18em] uppercase">02 · 본문</span>
            <span className="text-default-tertiary-label text-xs">일정에 대한 자세한 내용을 작성합니다</span>
          </div>
          <div className="px-5 py-5 sm:px-7 sm:py-7"><ArticleEditor initialContent={content} onChange={setContent} onInlineImage={(file, src) => setInlineImages((current) => [...current, { file, src }])} onInlineVideo={(file, src) => setInlineVideos((current) => [...current, { file, src }])} onImageError={(message) => showToast(message, 'error')} /></div>
          <div className="text-default-tertiary-label flex justify-end px-5 pb-5 text-xs sm:px-7 sm:pb-7">{bodyCharacterCount.toLocaleString('ko-KR')}자</div>
        </section>

        <section className="border-default-separator bg-default-surface border px-5 py-5 sm:px-7 sm:py-6" aria-labelledby="schedule-attachment-title">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><p id="schedule-attachment-title" className="text-default-tertiary-label text-[0.65rem] font-bold tracking-[0.18em] uppercase">03 · 첨부파일</p><p className="text-default-label mt-2 text-sm font-semibold">일정과 함께 제공할 파일을 추가하세요</p><p className="text-default-tertiary-label mt-1 text-xs">이미지와 참고 파일을 일정에 연결할 수 있습니다.</p></div>
            <span className="text-default-secondary-label text-xs">{files.length + attachments.length}개 첨부</span>
          </div>
          <div className="mt-5"><AttachmentUpload files={files} onChange={setFiles} /></div>
          {attachments.length > 0 ? <ul className="border-default-separator mt-5 overflow-hidden border">{attachments.map((attachment) => <li className="border-default-separator flex items-center justify-between gap-3 border-b px-4 py-3 last:border-b-0" key={attachment.id}><span className="text-default-label truncate text-sm">{attachment.originalName ?? attachment.name}</span><button aria-label={`${attachment.originalName ?? attachment.name ?? '첨부파일'} 삭제`} className="text-default-tertiary-label hover:bg-default-fill hover:text-default-red focus-visible:outline-default-label shrink-0 p-1.5 transition focus-visible:outline-2 focus-visible:outline-offset-[-2px]" type="button" onClick={() => setAttachmentToDelete(attachment)}><Trash2 aria-hidden className="size-4" /></button></li>)}</ul> : null}
        </section>
      </section>

      <section className="border-default-separator bg-default-surface grid gap-5 border px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-start sm:px-7" aria-labelledby="schedule-check-title">
        <div><p id="schedule-check-title" className="text-default-primary text-[0.65rem] font-bold tracking-[0.18em] uppercase">04 · 등록 전 확인</p><p className="text-default-secondary-label mt-2 max-w-xl text-sm leading-6">일정의 기본 요소를 한 번 더 확인하세요.</p></div>
        <ul className="grid gap-2 text-xs sm:min-w-56"><li className="text-default-label flex justify-between gap-4"><span>일정 정보</span><span className={scheduleDetailsReady ? 'text-default-primary font-semibold' : 'text-default-red font-semibold'}>{scheduleDetailsReady ? '완료' : '필요'}</span></li><li className="text-default-label flex justify-between gap-4"><span>본문</span><span className={bodyCharacterCount > 0 ? 'text-default-primary font-semibold' : 'text-default-secondary-label'}>{bodyCharacterCount > 0 ? '완료' : '선택 사항'}</span></li><li className="text-default-label flex justify-between gap-4"><span>첨부파일</span><span className={files.length + attachments.length > 0 ? 'text-default-primary font-semibold' : 'text-default-secondary-label'}>{files.length + attachments.length > 0 ? '첨부됨' : '선택 사항'}</span></li></ul>
      </section>

      <div className="border-default-separator flex flex-col-reverse justify-end gap-3 border-t pt-5 sm:flex-row"><Link className="border-default-separator bg-default-surface text-default-secondary-label hover:bg-default-fill inline-flex h-11 items-center justify-center gap-1.5 border px-5 text-sm font-semibold" href={cancelHref}><X aria-hidden className="size-4" />취소</Link><button className="bg-default-primary text-white hover:bg-default-primary-muted focus-visible:outline-default-label inline-flex h-11 items-center justify-center gap-1.5 px-5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-[-2px] disabled:opacity-50" type="submit" disabled={submitting}>{submitting ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Check aria-hidden className="size-4" />}저장</button></div>

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
      <AddressSearchModal open={addressSearchOpen} onClose={() => setAddressSearchOpen(false)} onSelect={setLocation} />
    </form>
  );
}
