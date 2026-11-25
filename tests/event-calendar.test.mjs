import assert from 'node:assert/strict';
import test from 'node:test';
import { createEventCalendar } from '../lib/event-calendar.ts';

const event = {
  id: 'event-1',
  title: '책, 이야기; 모임',
  dtStart: '2026-09-19T01:30:00',
  dtEnd: '2026-09-19T03:00:00',
  location: '대전\n서구',
  rrule: { freq: 'WEEKLY', byDay: 'SA', until: '2026-10-10T01:30:00' }
};

test('서울 시간과 반복 요일을 유지하고 텍스트를 이스케이프한다', () => {
  const calendar = createEventCalendar(event, 'https://example.com/articles/event-1');
  assert.match(calendar, /DTSTART;TZID=Asia\/Seoul:20260919T013000/);
  assert.match(calendar, /RRULE:FREQ=WEEKLY;UNTIL=20261009T163000Z;BYDAY=SA/);
  assert.match(calendar, /SUMMARY:책\\, 이야기\\; 모임/);
  assert.match(calendar, /LOCATION:대전\\n서구/);
  assert.ok(calendar.endsWith('END:VCALENDAR\r\n'));
});

test('UTF-8 바이트 기준으로 긴 줄을 접는다', () => {
  const calendar = createEventCalendar({ ...event, title: '가'.repeat(90) }, 'https://example.com/');
  for (const line of calendar.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75);
});

test('지원하지 않는 시간대와 잘못된 날짜를 거절한다', () => {
  assert.throws(() => createEventCalendar({ ...event, tzid: 'America/New_York' }, 'https://example.com/'));
  assert.throws(() => createEventCalendar({ ...event, dtStart: '2026-02-30T10:00:00' }, 'https://example.com/'));
});
