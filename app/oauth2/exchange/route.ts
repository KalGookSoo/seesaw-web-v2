import { NextResponse } from 'next/server';

import { APPLICATION_API_BASE_URL } from '@/lib/application-constants';
import { exchangeNaverAuthorizationCode, getNaverServerCredentials } from '@/lib/naver-oauth2-server';

export async function POST(request: Request) {
  const { code, siteId } = (await request.json()) as { code?: string; siteId?: string };

  if (!code || !siteId) {
    return NextResponse.json({ message: '네이버 인증 코드 또는 사이트 정보가 없습니다.' }, { status: 400 });
  }

  const credentials = getNaverServerCredentials();
  if (!credentials) {
    return NextResponse.json({ message: '네이버 로그인 설정이 누락되었습니다.' }, { status: 500 });
  }

  const accessToken = await exchangeNaverAuthorizationCode(code, credentials);
  if (!accessToken) {
    return NextResponse.json({ message: '네이버 액세스 토큰 발급에 실패했습니다.' }, { status: 502 });
  }

  const jwtResponse = await fetch(`${APPLICATION_API_BASE_URL}/oauth2/naver/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessToken, siteId })
  });

  const jwtBody = await jwtResponse.json();
  const response = NextResponse.json(jwtBody, { status: jwtResponse.status });

  // seesaw-api가 이 응답에 실어 보낸 인증 쿠키(Set-Cookie)를 그대로 전달해야 브라우저가 받는다.
  // 이 fetch는 Next.js 서버가 대신 호출한 것이라, 그냥 두면 브라우저는 이 헤더를 볼 수 없다.
  jwtResponse.headers.getSetCookie().forEach((cookie) => {
    response.headers.append('Set-Cookie', cookie);
  });

  return response;
}
