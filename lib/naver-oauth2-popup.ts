import type { JsonWebToken } from '@/types/auth';
import {
  NAVER_AUTHORIZATION_URI,
  NAVER_OAUTH2_PURPOSE_STORAGE_KEY,
  NAVER_OAUTH2_STATE_STORAGE_KEY,
  getNaverClientId,
  getNaverRedirectUri
} from '@/lib/naver-oauth2-config';

export const NAVER_OAUTH2_MESSAGE_TYPE = 'seesaw:naver-oauth2';
const POPUP_CLOSED_POLL_INTERVAL_MS = 500;

export type NaverOAuth2Purpose = 'login' | 'unlink';

export type NaverOAuth2Message =
  | Readonly<{ type: typeof NAVER_OAUTH2_MESSAGE_TYPE; purpose: 'login'; status: 'success'; accessToken: string; refreshToken: string; expiresIn: number }>
  | Readonly<{ type: typeof NAVER_OAUTH2_MESSAGE_TYPE; purpose: 'login'; status: 'error'; message: string }>
  | Readonly<{ type: typeof NAVER_OAUTH2_MESSAGE_TYPE; purpose: 'unlink'; status: 'success' }>
  | Readonly<{ type: typeof NAVER_OAUTH2_MESSAGE_TYPE; purpose: 'unlink'; status: 'error'; message: string }>;

function isNaverOAuth2Message(data: unknown): data is NaverOAuth2Message {
  return typeof data === 'object' && data !== null && (data as { type?: unknown }).type === NAVER_OAUTH2_MESSAGE_TYPE;
}

function buildAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: getNaverClientId(),
    redirect_uri: getNaverRedirectUri(),
    state
  });
  return `${NAVER_AUTHORIZATION_URI}?${params.toString()}`;
}

function openNaverOAuth2FlowPopup(purpose: NaverOAuth2Purpose): Promise<NaverOAuth2Message> {
  return new Promise((resolve, reject) => {
    const state = window.crypto.randomUUID();
    window.sessionStorage.setItem(NAVER_OAUTH2_STATE_STORAGE_KEY, state);
    window.sessionStorage.setItem(NAVER_OAUTH2_PURPOSE_STORAGE_KEY, purpose);

    const width = Math.min(480, window.innerWidth);
    const height = Math.min(640, window.innerHeight);
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      buildAuthorizationUrl(state),
      'seesaw-naver-oauth2',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
    );

    if (!popup) {
      reject(new Error('팝업이 차단되었습니다. 브라우저의 팝업 차단을 해제해주세요.'));
      return;
    }

    let settled = false;

    const cleanup = () => {
      window.removeEventListener('message', handleMessage);
      window.clearInterval(closedCheckInterval);
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== popup || !isNaverOAuth2Message(event.data) || event.data.purpose !== purpose) {
        return;
      }

      settled = true;
      cleanup();
      popup.close();
      resolve(event.data);
    };

    window.addEventListener('message', handleMessage);

    const closedCheckInterval = window.setInterval(() => {
      if (popup.closed) {
        cleanup();
        if (!settled) {
          reject(new Error('인증이 취소되었습니다.'));
        }
      }
    }, POPUP_CLOSED_POLL_INTERVAL_MS);
  });
}

export function openNaverOAuth2Popup(): Promise<JsonWebToken> {
  return openNaverOAuth2FlowPopup('login').then((message) => {
    if (message.purpose !== 'login') {
      throw new Error('예상치 못한 응답입니다.');
    }
    if (message.status === 'error') {
      throw new Error(message.message || '네이버 인증에 실패했습니다.');
    }
    return {
      accessToken: message.accessToken,
      refreshToken: message.refreshToken,
      expiresIn: message.expiresIn
    };
  });
}

export function openNaverOAuth2UnlinkPopup(): Promise<void> {
  return openNaverOAuth2FlowPopup('unlink').then((message) => {
    if (message.purpose !== 'unlink') {
      throw new Error('예상치 못한 응답입니다.');
    }
    if (message.status === 'error') {
      throw new Error(message.message || '네이버 연동 해제에 실패했습니다.');
    }
  });
}
