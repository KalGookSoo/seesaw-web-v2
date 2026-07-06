'use client';

import { useEffect, useState } from 'react';
import { Bell, Download, Smartphone, X } from 'lucide-react';

type ServiceWorkerRegistrationProps = Readonly<{
  siteId: string;
  siteName: string;
  themeColor: string;
  authenticated: boolean;
}>;

type BeforeInstallPromptEvent = Event &
  Readonly<{
    prompt: () => Promise<void>;
    userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
  }>;

type VapidPublicKeyResponse = Readonly<{
  publicKey: string;
}>;

type PushSubscriptionJson = Readonly<{
  endpoint?: string;
  keys?: {
    p256dh?: string;
    auth?: string;
  };
}>;

function getInstallPromptDismissedKey(siteId: string): string {
  return `seesaw:${siteId}:install-prompt-dismissed`;
}

function isStandalone(): boolean {
  const currentNavigator = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || currentNavigator.standalone === true;
}

function isInstallPromptDismissed(siteId: string): boolean {
  return window.localStorage.getItem(getInstallPromptDismissedKey(siteId)) === 'true';
}

function dismissInstallPrompt(siteId: string): void {
  window.localStorage.setItem(getInstallPromptDismissedKey(siteId), 'true');
}

async function getVapidPublicKey(): Promise<string> {
  const response = await fetch('/api/push/vapid-public-key', {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`VAPID 공개 키를 조회할 수 없습니다. status=${response.status}`);
  }

  const data = (await response.json()) as VapidPublicKeyResponse;
  return data.publicKey;
}

function urlBase64ToArrayBuffer(base64UrlString: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64UrlString.length % 4)) % 4);
  const base64 = (base64UrlString + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputBuffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(outputBuffer);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputBuffer;
}

async function savePushSubscription(siteId: string, subscription: PushSubscription): Promise<void> {
  const subscriptionJson = subscription.toJSON() as PushSubscriptionJson;
  const endpoint = subscriptionJson.endpoint;
  const p256dh = subscriptionJson.keys?.p256dh;
  const auth = subscriptionJson.keys?.auth;

  if (!endpoint || !p256dh || !auth) {
    throw new Error('푸시 구독 정보가 올바르지 않습니다.');
  }

  const response = await fetch('/api/push/subscriptions', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      siteId,
      endpoint,
      keys: {
        p256dh,
        auth
      }
    })
  });

  if (!response.ok) {
    throw new Error(`푸시 구독 정보를 저장할 수 없습니다. status=${response.status}`);
  }
}

async function subscribePushNotification(
  siteId: string,
  registration: globalThis.ServiceWorkerRegistration,
  requestPermission: boolean
): Promise<PushSubscription | null> {
  if (!('Notification' in window) || !('PushManager' in window) || !('serviceWorker' in navigator)) {
    throw new Error('이 브라우저는 Web Push를 지원하지 않습니다.');
  }

  const permission = requestPermission ? await Notification.requestPermission() : Notification.permission;
  if (permission !== 'granted') {
    return null;
  }

  const currentSubscription = await registration.pushManager.getSubscription();
  if (currentSubscription) {
    await savePushSubscription(siteId, currentSubscription);
    window.dispatchEvent(new CustomEvent('seesaw:push-subscribed', { detail: currentSubscription.toJSON() }));
    return currentSubscription;
  }

  const publicKey = await getVapidPublicKey();
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToArrayBuffer(publicKey)
  });

  await savePushSubscription(siteId, subscription);
  window.dispatchEvent(new CustomEvent('seesaw:push-subscribed', { detail: subscription.toJSON() }));
  return subscription;
}

export function ServiceWorkerRegistration({ siteId, siteName, themeColor, authenticated }: ServiceWorkerRegistrationProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installPromptVisible, setInstallPromptVisible] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register(`/sw.js?siteId=${siteId}`, { scope: '/' })
      .then(async (registration) => {
        if (authenticated && 'Notification' in window && Notification.permission === 'granted') {
          await subscribePushNotification(siteId, registration, false);
        }
      })
      .catch((error: unknown) => {
        console.debug('Service worker registration failed.', error);
      });
  }, [authenticated, siteId]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      if (isStandalone() || isInstallPromptDismissed(siteId)) {
        return;
      }

      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setInstallPromptVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [siteId]);

  const closeInstallPrompt = () => {
    dismissInstallPrompt(siteId);
    setDeferredPrompt(null);
    setInstallPromptVisible(false);
  };

  const installApplication = async () => {
    if (!deferredPrompt) {
      return;
    }

    setInstalling(true);
    setSubscriptionMessage(null);

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      dismissInstallPrompt(siteId);
      setDeferredPrompt(null);
      setInstallPromptVisible(false);

      if (choice.outcome === 'accepted' && authenticated) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await subscribePushNotification(siteId, registration, true);
        setSubscriptionMessage(subscription ? '알림 구독이 완료되었습니다.' : null);
      }
    } catch (error) {
      console.debug('PWA install or push subscription failed.', error);
      setSubscriptionMessage('알림 구독을 완료하지 못했습니다.');
    } finally {
      setInstalling(false);
    }
  };

  if (!installPromptVisible || !deferredPrompt) {
    return subscriptionMessage ? (
      <div className="border-default-separator bg-default-surface text-default-secondary-label fixed right-4 bottom-4 z-50 max-w-sm rounded-lg border px-4 py-3 text-sm shadow-xl">
        {subscriptionMessage}
      </div>
    ) : null;
  }

  return (
    <aside className="border-default-separator bg-default-surface/95 text-default-label fixed right-4 bottom-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-xl border p-4 shadow-2xl shadow-black/15 backdrop-blur">
      <div className="flex items-start gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
          style={{ backgroundColor: themeColor || `var(--default-blue)` }}
        >
          <Smartphone className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{siteName} 앱으로 열기</p>
              <p className="text-default-secondary-label mt-1 text-sm leading-6">
                홈 화면에 추가하면 브라우저 주소창 없이 빠르게 사용할 수 있습니다.
              </p>
            </div>
            <button
              type="button"
              className="text-default-tertiary-label hover:bg-default-fill hover:text-default-label rounded-full p-1 transition"
              aria-label="설치 제안 닫기"
              onClick={closeInstallPrompt}
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: themeColor || `var(--default-blue)` }}
              disabled={installing}
              onClick={installApplication}
            >
              <Download className="size-4" />
              {installing ? '처리 중' : '추가하기'}
            </button>
            {authenticated ? (
              <span className="text-default-tertiary-label inline-flex items-center gap-1.5 text-xs">
                <Bell className="size-3.5" />
                설치 후 알림 구독을 이어서 설정합니다.
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
