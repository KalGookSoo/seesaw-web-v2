import { authorizedFetch } from '@/lib/api-fetch';
import type {
  NotificationPageResponse,
  NotificationPreferenceRequest,
  NotificationPreferenceResponse,
  NotificationResponse,
  NotificationType
} from '@/types/notification';

export const notificationTypeLabels: Readonly<Record<NotificationType, string>> = {
  ARTICLE_CREATED: '새 게시글',
  REPLY_CREATED: '새 댓글',
  REPORT_CREATED: '새 신고',
  INQUIRY_CREATED: '새 문의',
  ARTICLE_UPDATED: '게시글 변경',
  ARTICLE_DELETED: '게시글 삭제',
  SCHEDULE_UPDATED: '일정 변경',
  SCHEDULE_REMINDER: '일정 알림'
};

export const notificationTypes: readonly NotificationType[] = [
  'ARTICLE_CREATED',
  'REPLY_CREATED',
  'REPORT_CREATED',
  'INQUIRY_CREATED',
  'ARTICLE_UPDATED',
  'ARTICLE_DELETED',
  'SCHEDULE_UPDATED',
  'SCHEDULE_REMINDER'
];

export function getNotificationItems(
  payload: NotificationPageResponse
): NotificationResponse[] {
  if (payload.content) {
    return payload.content;
  }

  const embedded = payload._embedded;
  if (!embedded) {
    return [];
  }

  return Object.values(embedded).find((items) => Array.isArray(items)) ?? [];
}

export function formatNotificationDate(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

export async function fetchNotificationCount(siteId: string): Promise<number> {
  const response = await authorizedFetch(
    `/api/notifications/unread-count?siteId=${encodeURIComponent(siteId)}`
  );
  if (!response.ok) {
    throw new Error('읽지 않은 알림 수를 불러오지 못했습니다.');
  }
  return Number(await response.json());
}

export async function fetchNotifications(
  siteId: string,
  size = 20
): Promise<NotificationResponse[]> {
  const response = await authorizedFetch(
    `/api/notifications?siteId=${encodeURIComponent(siteId)}&page=0&size=${size}&sort=createdDate,desc`
  );
  if (!response.ok) {
    throw new Error('알림을 불러오지 못했습니다.');
  }
  return getNotificationItems((await response.json()) as NotificationPageResponse);
}

export async function markNotificationAsRead(
  siteId: string,
  notificationId: string
): Promise<NotificationResponse> {
  const response = await authorizedFetch(
    `/api/notifications/${encodeURIComponent(notificationId)}/read?siteId=${encodeURIComponent(siteId)}`,
    { method: 'PATCH' }
  );
  if (!response.ok) {
    throw new Error('알림을 읽음 처리하지 못했습니다.');
  }
  return (await response.json()) as NotificationResponse;
}

export async function markAllNotificationsAsRead(siteId: string): Promise<void> {
  const response = await authorizedFetch(
    `/api/notifications/read-all?siteId=${encodeURIComponent(siteId)}`,
    { method: 'POST' }
  );
  if (!response.ok) {
    throw new Error('알림을 모두 읽음 처리하지 못했습니다.');
  }
}

export async function fetchNotificationPreference(
  siteId: string,
  type: NotificationType
): Promise<NotificationPreferenceResponse> {
  const response = await authorizedFetch(
    `/api/notification-preferences?siteId=${encodeURIComponent(siteId)}&type=${type}`
  );
  if (!response.ok) {
    throw new Error('알림 설정을 불러오지 못했습니다.');
  }
  return (await response.json()) as NotificationPreferenceResponse;
}

export async function updateNotificationPreference(
  siteId: string,
  preference: NotificationPreferenceRequest
): Promise<NotificationPreferenceResponse> {
  const response = await authorizedFetch(
    `/api/notification-preferences?siteId=${encodeURIComponent(siteId)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preference)
    }
  );
  if (!response.ok) {
    throw new Error('알림 설정을 저장하지 못했습니다.');
  }
  return (await response.json()) as NotificationPreferenceResponse;
}
