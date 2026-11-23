'use client';

import { useState } from 'react';
import Link from 'next/link';

import type { EventStatus, VEventResponse } from '@/types/event';
import { createEvent, EVENT_STATUSES, toDateTimeLocal, updateEvent } from '@/lib/events';
import { useToast } from '@/components/ui/toast';
import { ArticleEditor } from '@/components/articles/article-editor';

type ScheduleFormProps = Readonly<{
  mode: 'create' | 'edit';
  categoryId: string;
  categoryName: string;
  cancelHref: string;
  successHref: string;
  eventId?: string;
  initialEvent?: VEventResponse;
}>;

export function ScheduleForm({
  mode,
  categoryId,
  categoryName,
  cancelHref,
  successHref,
  eventId,
  initialEvent
}: ScheduleFormProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState(initialEvent?.title ?? '');
  const [dtStart, setDtStart] = useState(toDateTimeLocal(initialEvent?.dtStart));
  const [dtEnd, setDtEnd] = useState(toDateTimeLocal(initialEvent?.dtEnd));
  const [location, setLocation] = useState(initialEvent?.location ?? '');
  const [status, setStatus] = useState<EventStatus>(initialEvent?.status ?? 'CONFIRMED');
  const [content, setContent] = useState(initialEvent?.description ?? initialEvent?.article?.content ?? '');
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
    const result = mode === 'create'
      ? await createEvent({ categoryId, dtStart, dtEnd, title, content, location, status })
      : await updateEvent(eventId ?? '', { categoryId, dtStart, dtEnd, title, content, location, status });
    setSubmitting(false);

    if ('message' in result) {
      showToast(result.message, 'error');
      return;
    }
    showToast(mode === 'create' ? '일정을 등록했습니다.' : '일정을 수정했습니다.', 'success');
    window.location.href = successHref;
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
        <div className="border-default-separator border-t">
          <div className="bg-default-fill border-default-separator border-b px-5 py-3 sm:px-7"><span className="text-default-label text-sm font-semibold">일정 상세</span></div>
          <div className="px-5 py-5 sm:px-7 sm:py-7"><ArticleEditor initialContent={content} onChange={setContent} onInlineImage={() => undefined} onInlineVideo={() => undefined} /></div>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Link className="border-default-separator bg-default-surface text-default-secondary-label inline-flex h-11 items-center border px-5 text-sm font-semibold" href={cancelHref}>취소</Link>
        <button className="bg-default-label text-default-surface inline-flex h-11 items-center px-5 text-sm font-semibold disabled:opacity-50" type="submit" disabled={submitting}>{submitting ? '저장 중...' : '저장'}</button>
      </div>
    </form>
  );
}
