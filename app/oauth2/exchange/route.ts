import { NextResponse } from 'next/server';

import { APPLICATION_API_BASE_URL } from '@/lib/application-constants';
import { NAVER_TOKEN_URI, getNaverRedirectUri } from '@/lib/naver-oauth2-config';

type NaverTokenResponse = Readonly<{
  access_token?: string;
}>;

export async function POST(request: Request) {
  const { code, siteId } = (await request.json()) as { code?: string; siteId?: string };

  if (!code || !siteId) {
    return NextResponse.json({ message: '네이버 인증 코드 또는 사이트 정보가 없습니다.' }, { status: 400 });
  }

  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json({ message: '네이버 로그인 설정이 누락되었습니다.' }, { status: 500 });
  }

  const tokenParams = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: getNaverRedirectUri()
  });

  const tokenResponse = await fetch(`${NAVER_TOKEN_URI}?${tokenParams.toString()}`);
  if (!tokenResponse.ok) {
    return NextResponse.json({ message: '네이버 액세스 토큰 발급에 실패했습니다.' }, { status: 502 });
  }

  const tokenBody = (await tokenResponse.json()) as NaverTokenResponse;
  if (!tokenBody.access_token) {
    return NextResponse.json({ message: '네이버 액세스 토큰을 받지 못했습니다.' }, { status: 502 });
  }

  const jwtResponse = await fetch(`${APPLICATION_API_BASE_URL}/oauth2/naver/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessToken: tokenBody.access_token, siteId })
  });

  const jwtBody = await jwtResponse.json();
  return NextResponse.json(jwtBody, { status: jwtResponse.status });
}
