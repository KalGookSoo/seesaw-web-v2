import { NextResponse } from 'next/server';

import { NAVER_TOKEN_URI } from '@/lib/naver-oauth2-config';
import { exchangeNaverAuthorizationCode, getNaverServerCredentials } from '@/lib/naver-oauth2-server';

export async function POST(request: Request) {
  const { code } = (await request.json()) as { code?: string };

  if (!code) {
    return NextResponse.json({ message: '네이버 인증 코드가 없습니다.' }, { status: 400 });
  }

  const credentials = getNaverServerCredentials();
  if (!credentials) {
    return NextResponse.json({ message: '네이버 로그인 설정이 누락되었습니다.' }, { status: 500 });
  }

  const accessToken = await exchangeNaverAuthorizationCode(code, credentials);
  if (!accessToken) {
    return NextResponse.json({ message: '네이버 액세스 토큰 발급에 실패했습니다.' }, { status: 502 });
  }

  const unlinkParams = new URLSearchParams({
    grant_type: 'delete',
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    access_token: accessToken,
    service_provider: 'NAVER'
  });

  const unlinkResponse = await fetch(`${NAVER_TOKEN_URI}?${unlinkParams.toString()}`);
  if (!unlinkResponse.ok) {
    return NextResponse.json({ message: '네이버 연동 해제에 실패했습니다.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
