'use client';

import { useEffect } from 'react';

import { NAVER_OAUTH2_MESSAGE_TYPE, type NaverOAuth2Message } from '@/lib/naver-oauth2-popup';
import type { JsonWebToken } from '@/types/auth';

function postResultToOpener(message: NaverOAuth2Message) {
  window.opener?.postMessage(message, '*');
  window.close();
}

async function relayNaverOAuth2Result() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');
  const error = params.get('error');
  const errorDescription = params.get('error_description');

  if (error) {
    postResultToOpener({
      type: NAVER_OAUTH2_MESSAGE_TYPE,
      status: 'error',
      message: errorDescription ?? '네이버 계정 인증이 취소되었습니다.'
    });
    return;
  }

  if (!code || !state) {
    postResultToOpener({
      type: NAVER_OAUTH2_MESSAGE_TYPE,
      status: 'error',
      message: '네이버 인증 코드 또는 state가 없습니다.'
    });
    return;
  }

  try {
    const response = await fetch(
      `/api/oauth2/code/naver?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
      { credentials: 'include' }
    );
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(body?.message ?? '네이버 인증에 실패했습니다.');
    }

    const tokens = (await response.json()) as JsonWebToken;
    postResultToOpener({
      type: NAVER_OAUTH2_MESSAGE_TYPE,
      status: 'success',
      accessToken: tokens.accessToken ?? '',
      refreshToken: tokens.refreshToken ?? '',
      expiresIn: tokens.expiresIn ?? 0
    });
  } catch (relayError) {
    postResultToOpener({
      type: NAVER_OAUTH2_MESSAGE_TYPE,
      status: 'error',
      message: relayError instanceof Error ? relayError.message : '네이버 인증에 실패했습니다.'
    });
  }
}

export default function NaverOAuth2CallbackPage() {
  useEffect(() => {
    void relayNaverOAuth2Result();
  }, []);

  return <p className="p-6 text-sm text-default-secondary-label">네이버 로그인을 완료하는 중입니다…</p>;
}
