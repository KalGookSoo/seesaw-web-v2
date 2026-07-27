import type { JsonWebToken } from '@/types/auth';

const MESSAGE_TYPE = 'seesaw:naver-oauth2';
const POPUP_CLOSED_POLL_INTERVAL_MS = 500;

type NaverOAuth2Message =
  | Readonly<{ type: typeof MESSAGE_TYPE; status: 'success'; accessToken: string; refreshToken: string; expiresIn: number }>
  | Readonly<{ type: typeof MESSAGE_TYPE; status: 'error'; message: string }>;

function isNaverOAuth2Message(data: unknown): data is NaverOAuth2Message {
  return typeof data === 'object' && data !== null && (data as { type?: unknown }).type === MESSAGE_TYPE;
}

export function openNaverOAuth2Popup(authorizationUrl: string): Promise<JsonWebToken> {
  return new Promise((resolve, reject) => {
    const popup = window.open(
      authorizationUrl,
      'seesaw-naver-oauth2',
      'width=480,height=640,menubar=no,toolbar=no,location=no,status=no'
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
      if (event.source !== popup || !isNaverOAuth2Message(event.data)) {
        return;
      }

      settled = true;
      cleanup();
      popup.close();

      if (event.data.status === 'success') {
        resolve({
          accessToken: event.data.accessToken,
          refreshToken: event.data.refreshToken,
          expiresIn: event.data.expiresIn
        });
      } else {
        reject(new Error(event.data.message || '네이버 인증에 실패했습니다.'));
      }
    };

    window.addEventListener('message', handleMessage);

    const closedCheckInterval = window.setInterval(() => {
      if (popup.closed) {
        cleanup();
        if (!settled) {
          reject(new Error('로그인이 취소되었습니다.'));
        }
      }
    }, POPUP_CLOSED_POLL_INTERVAL_MS);
  });
}
