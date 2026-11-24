'use client';

import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';

import type { NotificationResponse } from '@/types/notification';
import { useAuth } from '@/hooks/use-auth';
import { useSiteContext } from '@/app/site-context-provider';
import { useToast } from '@/components/ui/toast';
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from '@/lib/notifications';
import { NotificationItem } from '@/components/notifications/notification-item';

export function NotificationInbox() {
  const { SITE_CONTEXT } = useSiteContext();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setNotifications(await fetchNotifications(SITE_CONTEXT.id, 20));
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : '알림을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      void load();
    } else {
      setLoading(false);
    }
    // 인증 상태가 확정된 뒤 한 번만 목록을 조회한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, SITE_CONTEXT.id]);

  const openNotification = async (notification: NotificationResponse) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(SITE_CONTEXT.id, notification.id);
        setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, read: true } : item));
      } catch (markError) {
        showToast(markError instanceof Error ? markError.message : '알림을 읽음 처리하지 못했습니다.', 'error');
      }
    }
    window.location.assign(notification.targetUrl || '/notifications');
  };

  const markAll = async () => {
    try {
      await markAllNotificationsAsRead(SITE_CONTEXT.id);
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
      showToast('알림을 모두 읽음 처리했습니다.', 'success');
    } catch (markError) {
      showToast(markError instanceof Error ? markError.message : '알림을 처리하지 못했습니다.', 'error');
    }
  };

  if (!isAuthenticated) {
    return <p className="text-default-secondary-label border-default-separator bg-default-surface border p-6 text-sm">알림을 확인하려면 로그인해 주세요.</p>;
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <section className="border-default-separator bg-default-surface border">
      <header className="border-default-separator flex flex-wrap items-end justify-between gap-4 border-b px-5 py-5 sm:px-7">
        <div>
          <p className="text-default-primary text-[0.65rem] font-bold tracking-[0.18em] uppercase">Activity inbox</p>
          <h2 className="text-default-label mt-2 text-2xl font-bold tracking-tight">알림</h2>
          <p className="text-default-secondary-label mt-2 text-sm">내 활동과 사이트의 중요한 소식을 한 곳에서 확인합니다.</p>
        </div>
        <button
          className="border-default-separator text-default-secondary-label hover:bg-default-fill hover:text-default-label inline-flex h-9 items-center gap-1.5 border px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
          disabled={unreadCount < 1}
          type="button"
          onClick={() => void markAll()}
        >
          <CheckCheck aria-hidden className="size-4" />
          모두 읽음
        </button>
      </header>

      {loading ? (
        <div className="text-default-tertiary-label flex items-center justify-center gap-2 px-5 py-16 text-sm">
          <Loader2 aria-hidden className="size-4 animate-spin" />
          알림을 불러오는 중입니다.
        </div>
      ) : error ? (
        <div className="px-5 py-16 text-center">
          <p className="text-default-danger text-sm">{error}</p>
          <button className="text-default-label mt-4 text-xs font-bold underline underline-offset-4" type="button" onClick={() => void load()}>다시 시도</button>
        </div>
      ) : notifications.length > 0 ? (
        <div>
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} onClick={() => void openNotification(notification)} />
          ))}
        </div>
      ) : (
        <div className="text-default-tertiary-label flex flex-col items-center gap-3 px-5 py-16 text-center text-sm">
          <Bell aria-hidden className="text-default-primary size-7" />
          새로운 알림이 없습니다.
        </div>
      )}
    </section>
  );
}
