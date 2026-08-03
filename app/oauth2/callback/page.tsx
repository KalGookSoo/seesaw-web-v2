'use client';

import { useEffect } from 'react';

import { useSiteContext } from '@/app/site-context-provider';
import { NAVER_OAUTH2_PURPOSE_STORAGE_KEY, NAVER_OAUTH2_STATE_STORAGE_KEY } from '@/lib/naver-oauth2-config';
import { NAVER_OAUTH2_MESSAGE_TYPE, type NaverOAuth2Message, type NaverOAuth2Purpose } from '@/lib/naver-oauth2-popup';
import type { JsonWebToken } from '@/types/auth';

function postResultToOpener(message: NaverOAuth2Message) {
  window.opener?.postMessage(message, '*');
  window.close();
}

async function exchangeCodeForToken(code: string, siteId: string): Promise<JsonWebToken> {
  const response = await fetch('/oauth2/exchange', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, siteId })
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? '네이버 인증에 실패했습니다.');
  }

  return (await response.json()) as JsonWebToken;
}

async function unlinkNaverAccount(code: string): Promise<void> {
  const response = await fetch('/oauth2/unlink', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? '네이버 연동 해제에 실패했습니다.');
  }
}

export default function NaverOAuth2CallbackPage() {
  const { SITE_CONTEXT } = useSiteContext();

  useEffect(() => {
    void relay();

    async function relay() {
      const purpose = (window.sessionStorage.getItem(NAVER_OAUTH2_PURPOSE_STORAGE_KEY) ?? 'login') as NaverOAuth2Purpose;
      window.sessionStorage.removeItem(NAVER_OAUTH2_PURPOSE_STORAGE_KEY);

      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      if (error) {
        postResultToOpener({
          type: NAVER_OAUTH2_MESSAGE_TYPE,
          purpose,
          status: 'error',
          message: errorDescription ?? '네이버 계정 인증이 취소되었습니다.'
        } as NaverOAuth2Message);
        return;
      }

      const expectedState = window.sessionStorage.getItem(NAVER_OAUTH2_STATE_STORAGE_KEY);
      window.sessionStorage.removeItem(NAVER_OAUTH2_STATE_STORAGE_KEY);

      if (!code || !state || !expectedState || state !== expectedState) {
        postResultToOpener({
          type: NAVER_OAUTH2_MESSAGE_TYPE,
          purpose,
          status: 'error',
          message: '네이버 인증 요청이 유효하지 않습니다.'
        } as NaverOAuth2Message);
        return;
      }

      if (purpose === 'unlink') {
        try {
          await unlinkNaverAccount(code);
          postResultToOpener({ type: NAVER_OAUTH2_MESSAGE_TYPE, purpose: 'unlink', status: 'success' });
        } catch (unlinkError) {
          postResultToOpener({
            type: NAVER_OAUTH2_MESSAGE_TYPE,
            purpose: 'unlink',
            status: 'error',
            message: unlinkError instanceof Error ? unlinkError.message : '네이버 연동 해제에 실패했습니다.'
          });
        }
        return;
      }

      try {
        const tokens = await exchangeCodeForToken(code, SITE_CONTEXT.id);
        postResultToOpener({
          type: NAVER_OAUTH2_MESSAGE_TYPE,
          purpose: 'login',
          status: 'success',
          accessToken: tokens.accessToken ?? '',
          refreshToken: tokens.refreshToken ?? '',
          expiresIn: tokens.expiresIn ?? 0
        });
      } catch (relayError) {
        postResultToOpener({
          type: NAVER_OAUTH2_MESSAGE_TYPE,
          purpose: 'login',
          status: 'error',
          message: relayError instanceof Error ? relayError.message : '네이버 인증에 실패했습니다.'
        });
      }
    }
  }, [SITE_CONTEXT.id]);

  return <p className="p-6 text-sm text-default-secondary-label">네이버 인증을 완료하는 중입니다…</p>;
}
