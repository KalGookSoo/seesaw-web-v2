import { CalendarDays, Clock3, MapPin, Repeat2 } from 'lucide-react';
import type { VEventResponse } from '@/types/event';
import { ScheduleDetailActions, ScheduleLocationCopy } from '@/components/articles/schedule-detail-actions';
import { ScheduleLocationMap } from '@/components/articles/schedule-location-map';
import { formatEventLocation } from '@/lib/event-location';

function dateParts(value: string | null | undefined): { date: string; time: string } | null {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  const date = new Date(Date.UTC(+year, +month - 1, +day));
  return {
    date: new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: 'UTC' }).format(date),
    time: `${+hour < 12 ? '오전' : '오후'} ${+hour % 12 || 12}:${minute}`
  };
}

export function ScheduleDetail({ event, canonicalUrl, description }: Readonly<{ event: VEventResponse; canonicalUrl: string; description: string }>) {
  const start = dateParts(event.dtStart);
  const end = dateParts(event.dtEnd);
  const sameDay = event.dtStart?.slice(0, 10) === event.dtEnd?.slice(0, 10);
  const status = event.status === 'CONFIRMED' ? '확정' : event.status === 'TENTATIVE' ? '잠정' : event.status === 'CANCELLED' ? '취소' : null;
  const { id, title, dtStart, dtEnd, location, locationDetail, rrule, tzid, duration } = event;
  const calendarEvent = { id, title, dtStart, dtEnd, location, locationDetail, rrule, tzid, duration, description, status: event.status };
  const displayLocation = formatEventLocation(location, locationDetail);

  return (
    <section className="border-default-separator bg-default-surface border" aria-labelledby="schedule-detail-title">
      <div className="border-default-separator flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-7">
        <h2 id="schedule-detail-title" className="text-default-primary text-xs font-bold tracking-[0.16em] uppercase">Schedule · 일정 정보</h2>
        {status ? <span className={`border px-2.5 py-1 text-xs font-semibold ${event.status === 'CANCELLED' ? 'border-default-danger text-default-danger' : 'border-default-separator text-default-secondary-label'}`}>{status}</span> : null}
      </div>
      <div className="border-default-separator border-b px-5 py-6 sm:px-7">
        <h3 className="text-default-tertiary-label text-xs font-semibold">일시</h3>
        {start && end && !sameDay ? (
          <ol className="mt-4">
            {[{ label: '시작', value: start }, { label: '종료', value: end }].map(({ label, value }, index) => (
              <li className="grid grid-cols-[2rem_1rem_minmax(0,1fr)] gap-x-3" key={label}>
                <span className="text-default-secondary-label pt-0.5 text-sm font-semibold">{label}</span>
                <span className="relative flex justify-center" aria-hidden="true">
                  <span className="bg-default-primary z-10 mt-2 size-2 shrink-0 rounded-full" />
                  {index === 0 ? <span className="bg-default-separator absolute top-3 bottom-0 w-px" /> : null}
                </span>
                <div className={index === 0 ? 'pb-5' : ''}>
                  <p className="text-default-label text-base font-bold sm:text-lg">{value.date}</p>
                  <p className="text-default-secondary-label mt-1 text-sm">{value.time}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-4 flex items-start gap-3">
            <CalendarDays aria-hidden className="text-default-primary mt-1 size-5 shrink-0" />
            <div><p className="text-default-label text-base font-bold sm:text-lg">{start?.date ?? '일정 미정'}</p>
              {start ? <p className="text-default-secondary-label mt-1 flex flex-wrap items-center gap-1.5 text-sm"><Clock3 aria-hidden className="size-4" />{start.time}{end ? ` – ${end.time}` : ''}</p> : null}</div>
          </div>
        )}
        {event.rrule?.freq ? <p className="text-default-secondary-label mt-4 flex items-center gap-2 text-sm"><Repeat2 aria-hidden className="size-4 shrink-0" /> 반복 일정</p> : null}
      </div>
      <div className="min-w-0 px-5 py-6 sm:px-7">
        <h3 className="text-default-tertiary-label text-xs font-semibold">장소</h3>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-default-label flex min-w-0 items-start gap-2 text-sm leading-6"><MapPin aria-hidden className="text-default-primary mt-1 size-4 shrink-0" /><span className="min-w-0 [overflow-wrap:anywhere]">{displayLocation || '장소 미정'}</span></p>
          {displayLocation ? <ScheduleLocationCopy location={displayLocation} /> : null}
        </div>
        {event.location?.trim() ? <ScheduleLocationMap location={event.location.trim()} /> : null}
      </div>
      <div className="border-default-separator border-t px-5 py-5 sm:px-7">
        <ScheduleDetailActions event={calendarEvent} canonicalUrl={canonicalUrl} />
        <p className="text-default-tertiary-label mt-3 text-xs leading-5">캘린더에 추가한 일정은 변경 사항이 자동으로 반영되지 않습니다.</p>
      </div>
    </section>
  );
}
