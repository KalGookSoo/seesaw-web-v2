/**
 * 인증이 httpOnly 쿠키(SEESAW_ACCESS_TOKEN)로 이뤄지므로, 브라우저가 쿠키를 함께 보내도록
 * credentials: 'include'를 강제하는 fetch 래퍼.
 */
export function authorizedFetch(url: string, init: RequestInit = {}): Promise<Response> {
  return fetch(url, { ...init, credentials: 'include' });
}
