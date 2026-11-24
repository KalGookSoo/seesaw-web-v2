import type { BaseEntity, PagedModel } from '@/types/common';

export type NotificationType =
  | 'ARTICLE_CREATED'
  | 'REPLY_CREATED'
  | 'REPORT_CREATED'
  | 'INQUIRY_CREATED'
  | 'ARTICLE_UPDATED'
  | 'ARTICLE_DELETED'
  | 'SCHEDULE_UPDATED'
  | 'SCHEDULE_REMINDER';

export type NotificationTargetType =
  | 'ARTICLE'
  | 'REPLY'
  | 'CATEGORY'
  | 'REPORT'
  | 'INQUIRY'
  | 'SCHEDULE';

export type NotificationResponse = Readonly<{
  id: string;
  createdBy?: string | null;
  createdDate?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  targetType?: NotificationTargetType | null;
  targetId?: string | null;
  targetUrl?: string | null;
  actorUsername?: string | null;
  read: boolean;
  readAt?: string | null;
  expiresAt?: string | null;
  baseModel?: BaseEntity | null;
}>;

export type NotificationPageResponse = PagedModel<NotificationResponse> & Readonly<{
  _embedded?: Readonly<Record<string, NotificationResponse[]>>;
}>;

export type NotificationPreferenceResponse = Readonly<{
  type: NotificationType;
  inAppEnabled: boolean;
  webPushEnabled: boolean;
  emailEnabled: boolean;
}>;

export type NotificationPreferenceRequest = Readonly<{
  type: NotificationType;
  webPushEnabled: boolean;
  emailEnabled: boolean;
}>;
