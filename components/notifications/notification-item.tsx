'use client';

import type { ReactNode } from 'react';
import {
  Bell,
  CalendarClock,
  FilePlus2,
  FileText,
  Flag,
  HelpCircle,
  MessageCircle,
  Pencil,
  Trash2
} from 'lucide-react';

import type { NotificationResponse } from '@/types/notification';
import {
  formatNotificationDate,
  notificationTypeLabels
} from '@/lib/notifications';

const notificationIcons: Readonly<Record<NotificationResponse['type'], ReactNode>> = {
  ARTICLE_CREATED: <FilePlus2 aria-hidden className="size-4" />,
  REPLY_CREATED: <MessageCircle aria-hidden className="size-4" />,
  REPORT_CREATED: <Flag aria-hidden className="size-4" />,
  INQUIRY_CREATED: <HelpCircle aria-hidden className="size-4" />,
  ARTICLE_UPDATED: <Pencil aria-hidden className="size-4" />,
  ARTICLE_DELETED: <Trash2 aria-hidden className="size-4" />,
  SCHEDULE_UPDATED: <CalendarClock aria-hidden className="size-4" />,
  SCHEDULE_REMINDER: <Bell aria-hidden className="size-4" />
};

export function NotificationItem({
  notification,
  onClick
}: Readonly<{
  notification: NotificationResponse;
  onClick: () => void;
}>) {
  return (
    <button
      className={`group grid w-full grid-cols-[2rem_minmax(0,1fr)_auto] gap-3 border-b px-4 py-4 text-left transition last:border-b-0 focus-visible:outline-default-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] ${notification.read ? 'text-default-label hover:bg-default-fill/55' : 'bg-default-primary-soft/45 text-default-label hover:bg-default-primary-soft'}`}
      type="button"
      onClick={onClick}
    >
      <span className="border-default-separator text-default-primary flex size-8 items-center justify-center border">
        {notificationIcons[notification.type] ?? <FileText aria-hidden className="size-4" />}
      </span>
      <span className="grid min-w-0 gap-1">
        <span className="text-default-tertiary-label truncate text-[0.65rem] font-semibold tracking-[0.12em] uppercase">
          {notificationTypeLabels[notification.type] ?? '활동'} · {formatNotificationDate(notification.createdDate)}
        </span>
        <strong className="truncate text-sm font-semibold">{notification.title}</strong>
        <span className="text-default-secondary-label truncate text-xs leading-5">
          {notification.message}
        </span>
      </span>
      {!notification.read ? (
        <span className="text-default-primary self-start whitespace-nowrap text-[0.65rem] font-bold">
          새 알림
        </span>
      ) : null}
    </button>
  );
}
