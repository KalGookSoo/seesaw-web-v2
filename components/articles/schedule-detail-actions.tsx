'use client';

import { CalendarPlus, Copy, Share2 } from 'lucide-react';
import type { VEventResponse } from '@/types/event';
import { createEventCalendar } from '@/lib/event-calendar';
import { useToast } from '@/components/ui/toast';

export function ScheduleDetailActions({ event, canonicalUrl }: Readonly<{ event: VEventResponse; canonicalUrl: string }>) {
  const { showToast } = useToast();

  function download() {
    try {
      const data = createEventCalendar(event, canonicalUrl);
      const url = URL.createObjectURL(new Blob([data], { type: 'text/calendar;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'seesaw-event.ics';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      showToast(error instanceof Error ? error.message : '일정을 저장하지 못했습니다.', 'error');
    }
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title || '일정', url: canonicalUrl });
      } else {
        await navigator.clipboard.writeText(canonicalUrl);
        showToast('일정 링크를 복사했습니다.', 'success');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      showToast('공유하지 못했습니다. 주소창의 링크를 복사해주세요.', 'error');
    }
  }

  async function copyLocation() {
    try {
      await navigator.clipboard.writeText(event.location!.trim());
      showToast('장소를 복사했습니다.', 'success');
    } catch {
      showToast('장소를 복사하지 못했습니다.', 'error');
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button className="bg-default-primary text-default-primary-contrast hover:bg-default-primary-muted inline-flex min-h-10 items-center gap-2 px-4 text-sm font-semibold transition" type="button" onClick={download}>
        <CalendarPlus aria-hidden className="size-4" /> 내 캘린더에 추가
      </button>
      <button className="border-default-separator text-default-label hover:bg-default-fill inline-flex min-h-10 items-center gap-2 border px-4 text-sm font-semibold transition" type="button" onClick={share}>
        <Share2 aria-hidden className="size-4" /> 일정 공유
      </button>
      {event.location?.trim() ? <button className="border-default-separator text-default-label hover:bg-default-fill inline-flex min-h-10 items-center gap-2 border px-4 text-sm font-semibold transition" type="button" onClick={copyLocation}><Copy aria-hidden className="size-4" /> 장소 복사</button> : null}
    </div>
  );
}
