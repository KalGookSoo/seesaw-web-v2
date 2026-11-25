import type { VEventResponse } from '@/types/event';

function escapeText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

function foldLine(line: string): string {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = '';
  let limit = 75;
  for (const character of line) {
    if (encoder.encode(current + character).length > limit) {
      parts.push(current);
      current = '';
      limit = 74;
    }
    current += character;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

function seoulUtc(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/.exec(value);
  if (!match || Number(match[1]) < 1989) throw new Error('일정 날짜를 캘린더에 추가할 수 없습니다.');
  const [, year, month, day, hour, minute, second = '0'] = match;
  const local = Date.UTC(+year, +month - 1, +day, +hour, +minute, +second);
  const check = new Date(local);
  if (check.getUTCFullYear() !== +year || check.getUTCMonth() !== +month - 1 || check.getUTCDate() !== +day || +hour > 23 || +minute > 59 || +second > 59) {
    throw new Error('일정 날짜를 캘린더에 추가할 수 없습니다.');
  }
  return new Date(local - 9 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

export function createEventCalendar(event: VEventResponse, url: string): string {
  if (event.tzid && event.tzid !== 'Asia/Seoul') throw new Error('이 시간대의 일정은 아직 캘린더에 추가할 수 없습니다.');
  if (!event.dtStart) throw new Error('시작 시간이 없어 캘린더에 추가할 수 없습니다.');

  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Seesaw//Schedule//KO', 'CALSCALE:GREGORIAN',
    'BEGIN:VTIMEZONE', 'TZID:Asia/Seoul', 'BEGIN:STANDARD', 'DTSTART:19890101T000000', 'TZOFFSETFROM:+0900', 'TZOFFSETTO:+0900', 'TZNAME:KST', 'END:STANDARD', 'END:VTIMEZONE', 'BEGIN:VEVENT',
    `UID:${escapeText(event.id)}@seesaw.me.kr`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`,
    `DTSTART;TZID=Asia/Seoul:${localDateTime(event.dtStart)}`];
  if (event.dtEnd) lines.push(`DTEND;TZID=Asia/Seoul:${localDateTime(event.dtEnd)}`);
  else if (event.duration && /^P(?:\d+W|\d+D(?:T(?:\d+H)?(?:\d+M)?(?:\d+S)?)?|T(?:\d+H)?(?:\d+M)?(?:\d+S)?)$/.test(event.duration)) lines.push(`DURATION:${event.duration}`);
  lines.push(`SUMMARY:${escapeText(event.title || '제목 없는 일정')}`);
  if (event.description) lines.push(`DESCRIPTION:${escapeText(event.description)}`);
  if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`);
  if (event.status) lines.push(`STATUS:${event.status}`);
  lines.push(`URL:${url}`);

  const rule = event.rrule;
  if (rule?.freq) {
    if (!['SECONDLY', 'MINUTELY', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].includes(rule.freq) ||
        (rule.interval != null && (!Number.isInteger(rule.interval) || rule.interval < 1)) ||
        (rule.count != null && (!Number.isInteger(rule.count) || rule.count < 1)) ||
        (rule.until && rule.count) ||
        (rule.byDay && !/^(?:[+-]?\d{0,2}(?:MO|TU|WE|TH|FR|SA|SU))(?:,[+-]?\d{0,2}(?:MO|TU|WE|TH|FR|SA|SU))*$/.test(rule.byDay)) ||
        (rule.byMonth && !/^[\d,]+$/.test(rule.byMonth)) ||
        (rule.byMonthDay && !/^[\d,+-]+$/.test(rule.byMonthDay))) {
      throw new Error('반복 규칙을 캘린더에 추가할 수 없습니다.');
    }
    const parts = [`FREQ=${rule.freq}`];
    if (rule.interval) parts.push(`INTERVAL=${rule.interval}`);
    if (rule.until) parts.push(`UNTIL=${seoulUtc(rule.until)}`);
    if (rule.count && !rule.until) parts.push(`COUNT=${rule.count}`);
    if (rule.byDay) parts.push(`BYDAY=${rule.byDay}`);
    if (rule.byMonth) parts.push(`BYMONTH=${rule.byMonth}`);
    if (rule.byMonthDay) parts.push(`BYMONTHDAY=${rule.byMonthDay}`);
    if (rule.wkst) parts.push(`WKST=${{ MONDAY: 'MO', TUESDAY: 'TU', WEDNESDAY: 'WE', THURSDAY: 'TH', FRIDAY: 'FR', SATURDAY: 'SA', SUNDAY: 'SU' }[rule.wkst]}`);
    lines.push(`RRULE:${parts.join(';')}`);
  }
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}

function localDateTime(value: string): string {
  seoulUtc(value);
  const [date, time] = value.split('T');
  const parts = time.split('.')[0].split(':');
  return `${date.replace(/-/g, '')}T${parts[0]}${parts[1]}${parts[2] ?? '00'}`;
}
