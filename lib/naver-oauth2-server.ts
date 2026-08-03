import { NAVER_TOKEN_URI, getNaverRedirectUri } from '@/lib/naver-oauth2-config';

export type NaverServerCredentials = Readonly<{
  clientId: string;
  clientSecret: string;
}>;

export function getNaverServerCredentials(): NaverServerCredentials | null {
  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return null;
  }
  return { clientId, clientSecret };
}

export async function exchangeNaverAuthorizationCode(
  code: string,
  credentials: NaverServerCredentials
): Promise<string | null> {
  const tokenParams = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    code,
    redirect_uri: getNaverRedirectUri()
  });

  const tokenResponse = await fetch(`${NAVER_TOKEN_URI}?${tokenParams.toString()}`);
  if (!tokenResponse.ok) {
    return null;
  }

  const tokenBody = (await tokenResponse.json()) as { access_token?: string };
  return tokenBody.access_token ?? null;
}
