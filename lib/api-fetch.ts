/**
 * 인증이 httpOnly 쿠키(SEESAW_ACCESS_TOKEN)로 이뤄지므로, 브라우저가 쿠키를 함께 보내도록
 * credentials: 'include'를 강제하는 fetch 래퍼.
 */
export async function authorizedFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, { ...init, credentials: 'include' });
  if (response.status === 401 && typeof window !== 'undefined') {
    window.dispatchEvent(new Event('seesaw:authentication-expired'));
  }
  return response;
}
