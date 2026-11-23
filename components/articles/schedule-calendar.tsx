'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clipboard, Clock3, Link2, MapPin } from 'lucide-react';

import { fetchMonthlyEvents } from '@/lib/home-summary';
import { APPLICATION_API_BASE_URL } from '@/lib/application-constants';
import type { VEventResponse } from '@/types/event';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

type ScheduleCalendarProps = Readonly<{
  categoryId: string;
  query?: string | null;
}>;

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function monthDays(month: Date): Date[] {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  firstDay.setDate(firstDay.getDate() - firstDay.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(firstDay);
    day.setDate(firstDay.getDate() + index);
    return day;
  });
}

function monthRange(month: Date): { start: Date; end: Date } {
  return {
    start: new Date(month.getFullYear(), month.getMonth(), 1, 0, 0, 0),
    end: new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59)
  };
}

function formatMonth(month: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long'
  }).format(month);
}

function formatSelectedDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(date);
}

function formatTime(value: string | null | undefined): string {
  if (!value) return '시간 미정';
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value));
}

function dayToneClass(dayOfWeek: number): string {
  if (dayOfWeek === 0) return 'text-default-red';
  if (dayOfWeek === 6) return 'text-default-blue';
  return 'text-default-tertiary-label';
}

function eventHref(event: VEventResponse): string | null {
  if (!event.articleId) return null;
  return `/articles/${encodeURIComponent(event.articleId)}`;
}

function EventRow({ event }: Readonly<{ event: VEventResponse }>) {
  const href = eventHref(event);
  const content = (
    <div className="group border-default-separator bg-default-surface flex gap-3 border-b px-4 py-4 last:border-b-0">
      <div className="text-default-tertiary-label flex w-16 shrink-0 flex-col gap-1 text-xs">
        <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" />{formatTime(event.dtStart)}</span>
        {event.location ? <span className="inline-flex items-center gap-1 truncate"><MapPin className="size-3.5" />{event.location}</span> : null}
      </div>
      <div className="min-w-0">
        <p className="text-default-label group-hover:text-default-secondary-label line-clamp-2 text-sm font-semibold transition-colors">
          {event.title ?? '제목 없는 일정'}
        </p>
        {event.statusDescription ? <p className="text-default-tertiary-label mt-1 text-xs">{event.statusDescription}</p> : null}
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export function ScheduleCalendar({ categoryId, query }: ScheduleCalendarProps) {
  const { showToast } = useToast();
  const [month, setMonth] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState(() => dateKey(new Date()));
  const [events, setEvents] = useState<readonly VEventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const days = useMemo(() => monthDays(month), [month]);
  const eventsByDay = useMemo(() => {
    const grouped = new Map<string, VEventResponse[]>();
    events.forEach((event) => {
      if (!event.dtStart) return;
      const key = dateKey(new Date(event.dtStart));
      grouped.set(key, [...(grouped.get(key) ?? []), event]);
    });
    return grouped;
  }, [events]);
  const selectedDate = new Date(`${selectedDay}T00:00:00`);
  const selectedEvents = eventsByDay.get(selectedDay) ?? [];
  const subscriptionUrl = `${APPLICATION_API_BASE_URL}/calendars/categories/${encodeURIComponent(categoryId)}/events.ics`;

  useEffect(() => {
    const controller = new AbortController();
    const range = monthRange(month);
    setLoading(true);
    setError(null);

    fetchMonthlyEvents(categoryId, range.start, range.end, {
      query,
      signal: controller.signal
    })
      .then((nextEvents) => {
        if (!controller.signal.aborted) setEvents(nextEvents);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : '일정을 조회하지 못했습니다.');
          setEvents([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [categoryId, month, query]);

  function moveMonth(amount: number) {
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + amount, 1);
    setMonth(nextMonth);
    setSelectedDay(dateKey(nextMonth));
  }

  async function copySubscriptionUrl() {
    try {
      await navigator.clipboard.writeText(subscriptionUrl);
      setCopied(true);
      showToast('캘린더 구독 URL을 복사했습니다.', 'success');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('구독 URL을 복사하지 못했습니다.', 'error');
    }
  }

  return (
    <section className="border-default-separator bg-default-surface overflow-hidden border">
      <header className="border-default-separator flex flex-wrap items-center justify-between gap-4 border-b px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <CalendarDays className="text-default-secondary-label size-5" />
          <div>
            <p className="text-default-tertiary-label text-[0.65rem] font-semibold tracking-[0.18em] uppercase">Schedule / Calendar</p>
            <h2 className="text-default-label mt-1 text-lg font-semibold">{formatMonth(month)}</h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button className="border-default-separator text-default-secondary-label hover:bg-default-fill focus-visible:outline-default-label inline-flex h-9 items-center gap-1.5 border px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2" type="button" onClick={() => setSubscriptionOpen(true)}>
            <Link2 className="size-3.5" />
            구독 URL
          </button>
          <div className="flex items-center border border-default-separator">
            <button aria-label="이전 달" className="text-default-secondary-label hover:bg-default-fill focus-visible:outline-default-label p-2 transition focus-visible:outline-2 focus-visible:outline-offset-[-2px]" type="button" onClick={() => moveMonth(-1)}><ChevronLeft className="size-4" /></button>
            <button aria-label="다음 달" className="text-default-secondary-label hover:bg-default-fill focus-visible:outline-default-label border-l border-default-separator p-2 transition focus-visible:outline-2 focus-visible:outline-offset-[-2px]" type="button" onClick={() => moveMonth(1)}><ChevronRight className="size-4" /></button>
          </div>
        </div>
      </header>

      {error ? <p className="text-default-secondary-label px-4 py-10 text-center text-sm">{error}</p> : null}
      {!error ? (
        <div className="grid lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.8fr)]">
          <div className="min-w-0 p-3 sm:p-5">
            <div className="grid grid-cols-7 border-t border-l border-default-separator text-center text-[0.65rem] font-semibold tracking-[0.12em] text-default-tertiary-label uppercase">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => <span className={`border-r border-b border-default-separator py-2 ${dayToneClass(index)}`} key={day}>{day}</span>)}
            </div>
            <div className={`grid grid-cols-7 border-l border-default-separator ${loading ? 'opacity-50' : ''}`}>
              {days.map((day) => {
                const key = dateKey(day);
                const dayEvents = eventsByDay.get(key) ?? [];
                const currentMonth = day.getMonth() === month.getMonth();
                const selected = selectedDay === key;
                return (
                  <button
                    aria-label={`${key} 일정 ${dayEvents.length}개`}
                    aria-pressed={selected}
                    className={`min-h-20 border-r border-b border-default-separator p-2 text-left transition sm:min-h-28 ${currentMonth ? 'bg-default-surface' : 'bg-default-fill/45'} ${selected ? 'bg-default-fill ring-2 ring-inset ring-default-label' : 'hover:bg-default-fill'}`}
                    key={key}
                    type="button"
                    onClick={() => setSelectedDay(key)}
                  >
                    <span className={`text-xs font-medium ${dayToneClass(day.getDay())} ${currentMonth ? '' : 'opacity-45'}`}>{day.getDate()}</span>
                    <span className="mt-2 flex flex-wrap gap-1">
                      {dayEvents.slice(0, 3).map((event) => <span className="bg-default-label size-1.5" key={event.id} />)}
                      {dayEvents.length > 3 ? <span className="text-default-tertiary-label text-[0.6rem]">+{dayEvents.length - 3}</span> : null}
                    </span>
                    <span className="mt-2 hidden space-y-1 sm:block">
                      {dayEvents.slice(0, 2).map((event) => <span className="text-default-secondary-label block truncate border-l-2 border-default-label pl-1 text-[0.65rem]" key={event.id}>{event.title}</span>)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <aside className="border-default-separator border-t lg:border-t-0 lg:border-l">
            <div className="border-default-separator border-b px-4 py-4 sm:px-5">
              <p className="text-default-tertiary-label text-[0.65rem] font-semibold tracking-[0.16em] uppercase">Selected day</p>
              <h3 className="text-default-label mt-1 text-base font-semibold">{formatSelectedDate(selectedDate)}</h3>
            </div>
            {selectedEvents.length > 0 ? <div>{selectedEvents.map((event) => <EventRow event={event} key={event.id} />)}</div> : <p className="text-default-tertiary-label px-4 py-10 text-center text-sm sm:px-5">선택한 날짜에 일정이 없습니다.</p>}
          </aside>
        </div>
      ) : null}
      <Modal
        description="외부 캘린더 앱의 URL 구독 기능에 아래 주소를 등록하면 이 카테고리의 일정을 구독할 수 있습니다."
        footer={<button className="bg-default-label text-default-surface hover:bg-default-secondary-label focus-visible:outline-default-label inline-flex h-10 items-center px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2" type="button" onClick={() => setSubscriptionOpen(false)}>닫기</button>}
        open={subscriptionOpen}
        title="캘린더 구독 URL"
        variant="monochrome"
        onClose={() => setSubscriptionOpen(false)}
      >
        <label className="text-default-label block text-sm font-medium" htmlFor="schedule-subscription-url">구독 URL</label>
        <div className="mt-2 flex">
          <input id="schedule-subscription-url" className="border-default-separator bg-default-fill text-default-label min-w-0 flex-1 border px-3 text-xs outline-none" readOnly value={subscriptionUrl} />
          <button aria-label="구독 URL 복사" className="border-default-label bg-default-label text-default-surface inline-flex shrink-0 items-center gap-1.5 border px-3 text-xs font-semibold transition hover:bg-default-secondary-label focus-visible:outline-default-label focus-visible:outline-2 focus-visible:outline-offset-2" type="button" onClick={copySubscriptionUrl}>
            {copied ? <Check className="size-3.5" /> : <Clipboard className="size-3.5" />}
            {copied ? '복사됨' : '복사'}
          </button>
        </div>
        <p className="text-default-tertiary-label mt-3 text-xs leading-5">외부 캘린더의 반영 주기는 서비스 정책에 따라 지연될 수 있습니다.</p>
      </Modal>
    </section>
  );
}
