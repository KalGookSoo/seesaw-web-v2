'use client';

import { useEffect } from 'react';

import { NAVER_OAUTH2_MESSAGE_TYPE, type NaverOAuth2Message } from '@/lib/naver-oauth2-popup';

function postResultToOpener(message: NaverOAuth2Message) {
  window.opener?.postMessage(message, '*');
  window.close();
}

function relayNaverOAuth2Result() {
  const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const status = fragment.get('status');

  if (status === 'success') {
    postResultToOpener({
      type: NAVER_OAUTH2_MESSAGE_TYPE,
      status: 'success',
      accessToken: fragment.get('accessToken') ?? '',
      refreshToken: fragment.get('refreshToken') ?? '',
      expiresIn: Number(fragment.get('expiresIn') ?? 0)
    });
    return;
  }

  postResultToOpener({
    type: NAVER_OAUTH2_MESSAGE_TYPE,
    status: 'error',
    message: fragment.get('message') ?? '네이버 인증에 실패했습니다.'
  });
}

export default function NaverOAuth2CallbackPage() {
  useEffect(() => {
    relayNaverOAuth2Result();
  }, []);

  return <p className="p-6 text-sm text-default-secondary-label">네이버 로그인을 완료하는 중입니다…</p>;
}
