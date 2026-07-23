import type { ArticleResponse } from '@/types/article';
import type { BaseEntity } from '@/types/common';

export type EventStatus = 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';

export type RecurrenceFrequency =
  | 'SECONDLY'
  | 'MINUTELY'
  | 'HOURLY'
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'YEARLY';

export type Weekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type RecurrenceRule = Readonly<{
  freq?: RecurrenceFrequency | null;
  interval?: number | null;
  until?: string | null;
  count?: number | null;
  byDay?: string | null;
  byMonth?: string | null;
  byMonthDay?: string | null;
  wkst?: Weekday | null;
}>;

export type CreateEventRequest = Readonly<{
  dtStart: string;
  dtEnd: string;
  title: string;
  content: string;
  location?: string | null;
  status?: EventStatus | null;
  tzid?: string | null;
  categoryId: string;
  multipartFiles?: File[];
  inlineImages?: File[];
  multipartFilesSizeValid?: boolean | null;
  inlineImagesSizeValid?: boolean | null;
}>;

export type UpdateEventRequest = Readonly<{
  dtStart: string;
  dtEnd: string;
  title: string;
  content?: string | null;
  location?: string | null;
  status?: EventStatus | null;
  tzid?: string | null;
  categoryId?: string | null;
  multipartFiles?: File[];
  inlineImages?: File[];
  multipartFilesSizeValid?: boolean | null;
  inlineImagesSizeValid?: boolean | null;
}>;

export type SearchEventsRequest = Readonly<{
  categoryId: string;
  start?: string | null;
  end?: string | null;
  query?: string | null;
}>;

export type VEventResponse = Readonly<{
  id: string;
  createdBy?: string | null;
  createdIp?: string | null;
  createdDate?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedIp?: string | null;
  lastModifiedDate?: string | null;
  articleId?: string | null;
  article?: ArticleResponse | null;
  dtStart?: string | null;
  dtEnd?: string | null;
  title?: string | null;
  description?: string | null;
  location?: string | null;
  status?: EventStatus | null;
  rrule?: RecurrenceRule | null;
  tzid?: string | null;
  duration?: string | null;
  statusDescription?: string | null;
  baseModel?: BaseEntity | null;
}>;
