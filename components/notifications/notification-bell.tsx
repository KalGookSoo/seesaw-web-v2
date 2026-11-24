'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';

import type { NotificationResponse } from '@/types/notification';
import { useSiteContext } from '@/app/site-context-provider';
import { useToast } from '@/components/ui/toast';
import {
  fetchNotificationCount,
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from '@/lib/notifications';
import { NotificationItem } from '@/components/notifications/notification-item';

export function NotificationBell({
  isAuthenticated
}: Readonly<{ isAuthenticated: boolean }>) {
  const { SITE_CONTEXT } = useSiteContext();
  const { showToast } = useToast();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setCount(0);
      return;
    }

    let cancelled = false;
    const refreshCount = async () => {
      try {
        const nextCount = await fetchNotificationCount(SITE_CONTEXT.id);
        if (!cancelled) {
          setCount(nextCount);
        }
      } catch {
        // 알림 벨은 읽기 화면을 막지 않으므로 조회 실패를 조용히 처리한다.
      }
    };

    void refreshCount();
    const intervalId = window.setInterval(refreshCount, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [SITE_CONTEXT.id, isAuthenticated]);

  useEffect(() => {
    if (!open || !isAuthenticated) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchNotifications(SITE_CONTEXT.id, 8)
      .then((items) => {
        if (!cancelled) {
          setNotifications(items);
        }
      })
      .catch((fetchError: unknown) => {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : '알림을 불러오지 못했습니다.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [SITE_CONTEXT.id, isAuthenticated, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  if (!isAuthenticated) {
    return null;
  }

  const openNotification = async (notification: NotificationResponse) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(SITE_CONTEXT.id, notification.id);
        setNotifications((current) =>
          current.map((item) => item.id === notification.id ? { ...item, read: true } : item)
        );
        setCount((current) => Math.max(0, current - 1));
      } catch {
        // 이동은 읽음 처리 실패와 무관하게 허용한다.
      }
    }

    window.location.assign(notification.targetUrl || '/notifications');
  };

  const markAll = async () => {
    if (count < 1) {
      return;
    }
    try {
      await markAllNotificationsAsRead(SITE_CONTEXT.id);
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
      setCount(0);
      showToast('알림을 모두 읽음 처리했습니다.', 'success');
    } catch (markError) {
      showToast(markError instanceof Error ? markError.message : '알림을 처리하지 못했습니다.', 'error');
    }
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={count > 0 ? `알림, 읽지 않은 알림 ${count}개` : '알림'}
        className="border-default-separator bg-default-background text-default-secondary-label hover:bg-default-fill hover:text-default-label inline-flex size-10 items-center justify-center border transition focus-visible:outline-default-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <Bell aria-hidden className="size-[18px]" />
        {count > 0 ? (
          <span className="border-default-background bg-default-primary text-default-primary-contrast absolute top-0 right-0 inline-flex min-w-4 translate-x-1/4 -translate-y-1/4 items-center justify-center border px-1 text-[0.6rem] font-bold leading-4">
            {count > 99 ? '99+' : count}
          </span>
        ) : null}
      </button>

      {open ? (
        <section
          aria-label="최근 알림"
          className="border-default-label bg-default-surface absolute top-[calc(100%+0.75rem)] right-0 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden border"
          role="dialog"
        >
          <header className="border-default-separator flex items-start justify-between gap-4 border-b px-4 py-4">
            <div>
              <p className="text-default-primary text-[0.65rem] font-bold tracking-[0.18em] uppercase">Activity</p>
              <h2 className="text-default-label mt-1 text-lg font-bold tracking-tight">알림</h2>
            </div>
            <button
              className="text-default-secondary-label hover:text-default-primary inline-flex items-center gap-1 text-xs font-semibold transition disabled:opacity-40"
              disabled={count < 1}
              type="button"
              onClick={() => void markAll()}
            >
              <CheckCheck aria-hidden className="size-3.5" />
              모두 읽음
            </button>
          </header>

          <div className="max-h-[min(28rem,60vh)] overflow-y-auto">
            {loading ? (
              <div className="text-default-tertiary-label flex items-center justify-center gap-2 px-4 py-10 text-sm">
                <Loader2 aria-hidden className="size-4 animate-spin" />
                알림을 불러오는 중입니다.
              </div>
            ) : error ? (
              <p className="text-default-danger px-4 py-10 text-center text-sm">{error}</p>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => void openNotification(notification)}
                />
              ))
            ) : (
              <p className="text-default-tertiary-label px-4 py-10 text-center text-sm">새로운 알림이 없습니다.</p>
            )}
          </div>

          <footer className="border-default-separator border-t px-4 py-3 text-right">
            <Link className="text-default-label hover:text-default-primary text-xs font-bold transition" href="/notifications" onClick={() => setOpen(false)}>
              모든 알림 보기 <span aria-hidden>→</span>
            </Link>
          </footer>
        </section>
      ) : null}
    </div>
  );
}
