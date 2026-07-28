export const NAVER_AUTHORIZATION_URI = 'https://nid.naver.com/oauth2.0/authorize';

export const NAVER_TOKEN_URI = 'https://nid.naver.com/oauth2.0/token';

export const NAVER_OAUTH2_STATE_STORAGE_KEY = 'seesaw:naver-oauth2-state';

export function getNaverClientId(): string {
  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  if (!clientId) {
    throw new Error('NEXT_PUBLIC_NAVER_CLIENT_ID가 설정되지 않았습니다.');
  }
  return clientId;
}

export function getNaverRedirectUri(): string {
  const redirectUri = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;
  if (!redirectUri) {
    throw new Error('NEXT_PUBLIC_NAVER_REDIRECT_URI가 설정되지 않았습니다.');
  }
  return redirectUri;
}
