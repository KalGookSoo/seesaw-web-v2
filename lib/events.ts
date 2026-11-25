import type {
  CreateEventRequest,
  EventStatus,
  UpdateEventRequest,
  VEventResponse
} from '@/types/event';
import { authorizedFetch } from '@/lib/api-fetch';
import { APPLICATION_API_BASE_URL } from '@/lib/application-constants';

export type EventMutationResult =
  | Readonly<{ ok: true }>
  | Readonly<{ ok: false; status: number; message: string }>;

function buildEventFormData(
  command: CreateEventRequest | UpdateEventRequest
): FormData {
  const formData = new FormData();
  formData.set('categoryId', command.categoryId ?? '');
  formData.set('dtStart', command.dtStart);
  formData.set('dtEnd', command.dtEnd);
  formData.set('title', command.title);
  formData.set('content', command.content ?? '');
  formData.set('location', command.location ?? '');
  if (command.status) formData.set('status', command.status);
  if (command.tzid) formData.set('tzid', command.tzid);
  (command.multipartFiles ?? []).forEach((file) => formData.append('multipartFiles', file));
  (command.inlineImages ?? []).forEach((file) => formData.append('inlineImages', file));
  (command.inlineVideos ?? []).forEach((file) => formData.append('inlineVideos', file));
  return formData;
}

async function toMutationResult(response: Response): Promise<EventMutationResult> {
  if (response.ok) return { ok: true };

  const body = (await response.json().catch(() => null)) as { message?: unknown } | null;
  return {
    ok: false,
    status: response.status,
    message: typeof body?.message === 'string' ? body.message : '일정을 저장하지 못했습니다.'
  };
}

export async function fetchEventsByCategory(categoryId: string): Promise<VEventResponse[]> {
  const response = await fetch(`${APPLICATION_API_BASE_URL}/events?categoryId=${encodeURIComponent(categoryId)}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store'
  });
  if (!response.ok) throw new Error('일정 정보를 조회하지 못했습니다.');
  return response.json();
}

export async function fetchEvent(id: string): Promise<VEventResponse> {
  const response = await fetch(`${APPLICATION_API_BASE_URL}/events/${encodeURIComponent(id)}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store'
  });
  if (!response.ok) throw new Error('일정 정보를 조회하지 못했습니다.');
  return response.json();
}

export async function createEvent(command: CreateEventRequest): Promise<EventMutationResult> {
  return toMutationResult(await authorizedFetch('/api/events', {
    method: 'POST',
    body: buildEventFormData(command)
  }));
}

export async function updateEvent(id: string, command: UpdateEventRequest): Promise<EventMutationResult> {
  return toMutationResult(await authorizedFetch(`/api/events/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: buildEventFormData(command)
  }));
}

export function toDateTimeLocal(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 16);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export const EVENT_STATUSES: readonly { value: EventStatus; label: string }[] = [
  { value: 'CONFIRMED', label: '확정' },
  { value: 'TENTATIVE', label: '예정' },
  { value: 'CANCELLED', label: '취소' }
];
