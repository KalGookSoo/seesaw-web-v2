import { CSRF_HEADER_NAME, getCsrfToken } from '@/lib/csrf';

const PROTECTED_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * 인증이 httpOnly 쿠키(SEESAW_ACCESS_TOKEN)로 이뤄지므로, 브라우저가 쿠키를 함께 보내도록
 * credentials: 'include'를 강제한다. 상태를 변경하는 요청에는 더블 서브밋 쿠키(XSRF-TOKEN)
 * 값을 X-XSRF-TOKEN 헤더로도 실어 CSRF를 방어한다.
 */
export function authorizedFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const method = (init.method ?? 'GET').toUpperCase();
  const headers = new Headers(init.headers);

  if (PROTECTED_METHODS.has(method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers.set(CSRF_HEADER_NAME, csrfToken);
    }
  }

  return fetch(url, { ...init, headers, credentials: 'include' });
}
