'use client';

import { useEffect, useState } from 'react';
import { Check, Mail, Smartphone } from 'lucide-react';

import type {
  NotificationPreferenceResponse,
  NotificationType
} from '@/types/notification';
import { useAuth } from '@/hooks/use-auth';
import { useSiteContext } from '@/app/site-context-provider';
import { useToast } from '@/components/ui/toast';
import {
  fetchNotificationPreference,
  notificationTypeLabels,
  notificationTypes,
  updateNotificationPreference
} from '@/lib/notifications';

const notificationDescriptions: Readonly<Record<NotificationType, string>> = {
  ARTICLE_CREATED: '구독한 게시판에 새로운 글이 올라오면 알려드립니다.',
  REPLY_CREATED: '내 게시글에 새로운 댓글이 등록되면 알려드립니다.',
  REPORT_CREATED: '관리자에게 새 신고가 접수되면 알려드립니다.',
  INQUIRY_CREATED: '관리자에게 새 문의가 접수되면 알려드립니다.',
  ARTICLE_UPDATED: '관심 있는 게시글이 변경되면 알려드립니다.',
  ARTICLE_DELETED: '관심 있는 게시글이 삭제되면 알려드립니다.',
  SCHEDULE_UPDATED: '일정의 시간·장소·상태가 변경되면 알려드립니다.',
  SCHEDULE_REMINDER: '다가오는 일정이 있으면 알려드립니다.'
};

type PreferenceState = NotificationPreferenceResponse & Readonly<{ saving?: boolean; error?: string }>;

function PreferenceSwitch({
  checked,
  disabled,
  label,
  onChange
}: Readonly<{
  checked: boolean;
  disabled: boolean;
  label: string;
  onChange: () => void;
}>) {
  return (
    <button
      aria-checked={checked}
      aria-label={`${label} ${checked ? '끄기' : '켜기'}`}
      className={`relative inline-flex h-6 w-11 shrink-0 border p-0.5 transition focus-visible:outline-default-primary focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-50 ${checked ? 'border-default-primary bg-default-primary' : 'border-default-separator bg-default-fill'}`}
      disabled={disabled}
      role="switch"
      type="button"
      onClick={onChange}
    >
      <span className={`size-4 bg-default-surface transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export function NotificationSettings() {
  const { SITE_CONTEXT } = useSiteContext();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [preferences, setPreferences] = useState<Partial<Record<NotificationType, PreferenceState>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    Promise.all(notificationTypes.map((type) => fetchNotificationPreference(SITE_CONTEXT.id, type)))
      .then((items) => {
        if (!cancelled) {
          setPreferences(Object.fromEntries(items.map((item) => [item.type, item])));
        }
      })
      .catch(() => {
        if (!cancelled) {
          showToast('알림 설정을 불러오지 못했습니다.', 'error');
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
  }, [SITE_CONTEXT.id, isAuthenticated, showToast]);

  const toggle = async (type: NotificationType, channel: 'webPushEnabled' | 'emailEnabled') => {
    const current = preferences[type];
    if (!current || current.saving) {
      return;
    }

    const next = { ...current, [channel]: !current[channel], saving: true, error: undefined };
    setPreferences((all) => ({ ...all, [type]: next }));
    try {
      const saved = await updateNotificationPreference(SITE_CONTEXT.id, {
        type,
        webPushEnabled: next.webPushEnabled,
        emailEnabled: next.emailEnabled
      });
      setPreferences((all) => ({ ...all, [type]: saved }));
    } catch (error) {
      setPreferences((all) => ({ ...all, [type]: { ...current, error: error instanceof Error ? error.message : '저장하지 못했습니다.' } }));
      showToast(error instanceof Error ? error.message : '알림 설정을 저장하지 못했습니다.', 'error');
    }
  };

  if (!isAuthenticated) {
    return <p className="text-default-secondary-label border-default-separator bg-default-surface border p-6 text-sm">알림 설정을 확인하려면 로그인해 주세요.</p>;
  }

  return (
    <section className="border-default-separator bg-default-surface border">
      <header className="border-default-separator border-b px-5 py-5 sm:px-7">
        <p className="text-default-primary text-[0.65rem] font-bold tracking-[0.18em] uppercase">Notification policy</p>
        <h2 className="text-default-label mt-2 text-2xl font-bold tracking-tight">알림 설정</h2>
        <p className="text-default-secondary-label mt-2 text-sm leading-6">알림함은 항상 켜져 있습니다. 웹 푸시와 이메일 수신만 알림 유형별로 선택할 수 있습니다.</p>
      </header>

      <div className="divide-default-separator divide-y">
        {loading ? (
          <div className="text-default-tertiary-label px-5 py-16 text-center text-sm">알림 설정을 불러오는 중입니다.</div>
        ) : notificationTypes.map((type) => {
          const preference = preferences[type];
          if (!preference) {
            return null;
          }
          return (
            <article className="px-5 py-5 sm:px-7" key={type}>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <p className="text-default-label font-semibold">{notificationTypeLabels[type]} 알림</p>
                  <p className="text-default-secondary-label mt-1 text-sm leading-6">{notificationDescriptions[type]}</p>
                  {preference.error ? <p className="text-default-danger mt-2 text-xs">{preference.error}</p> : null}
                </div>
                <div className="grid shrink-0 grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-4">
                  <div className="border-default-separator flex min-w-20 items-center justify-between gap-2 border px-3 py-2">
                    <span className="text-default-secondary-label text-xs">알림함</span>
                    <Check aria-hidden className="text-default-primary size-4" />
                  </div>
                  <label className="border-default-separator flex min-w-20 items-center justify-between gap-2 border px-3 py-2">
                    <span className="text-default-secondary-label inline-flex items-center gap-1.5 text-xs"><Smartphone aria-hidden className="size-3.5" />웹</span>
                    <PreferenceSwitch checked={preference.webPushEnabled} disabled={preference.saving === true} label="웹 푸시 알림" onChange={() => void toggle(type, 'webPushEnabled')} />
                  </label>
                  <label className="border-default-separator flex min-w-20 items-center justify-between gap-2 border px-3 py-2">
                    <span className="text-default-secondary-label inline-flex items-center gap-1.5 text-xs"><Mail aria-hidden className="size-3.5" />메일</span>
                    <PreferenceSwitch checked={preference.emailEnabled} disabled={preference.saving === true} label="이메일 알림" onChange={() => void toggle(type, 'emailEnabled')} />
                  </label>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
