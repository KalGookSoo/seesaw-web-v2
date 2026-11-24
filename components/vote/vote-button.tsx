'use client';

import { useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';

import type { VoteSummaryResponse } from '@/types/vote';
import { authorizedFetch } from '@/lib/api-fetch';
import { useAuth } from '@/hooks/use-auth';
import { openNaverOAuth2Popup } from '@/lib/naver-oauth2-popup';
import { useToast } from '@/components/ui/toast';

const baseClassName =
  'inline-flex min-h-9 items-center gap-1.5 border px-2.5 text-xs font-semibold tabular-nums transition focus-visible:outline-default-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] disabled:cursor-wait disabled:opacity-60';

export function VoteButton({
  referenceId,
  className = ''
}: Readonly<{
  referenceId: string;
  className?: string;
}>) {
  const { isAuthenticated, login } = useAuth();
  const { showToast } = useToast();
  const [summary, setSummary] = useState<VoteSummaryResponse>({
    referenceId,
    count: 0,
    liked: false
  });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    authorizedFetch(`/api/votes?referenceId=${encodeURIComponent(referenceId)}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('좋아요 상태를 불러오지 못했습니다.');
        }
        return (await response.json()) as VoteSummaryResponse;
      })
      .then((nextSummary) => {
        if (!cancelled) {
          setSummary(nextSummary);
        }
      })
      .catch(() => {
        // 집계 조회 실패는 본문 읽기를 막지 않고 기본 상태를 유지한다.
      });

    return () => {
      cancelled = true;
    };
  }, [referenceId]);

  const toggleVote = async () => {
    setPending(true);
    try {
      let authenticated = isAuthenticated;
      if (!authenticated) {
        const tokens = await openNaverOAuth2Popup();
        await login(tokens);
        authenticated = true;
      }

      if (!authenticated) {
        return;
      }

      const response = await authorizedFetch(
        `/api/votes/${encodeURIComponent(referenceId)}`,
        { method: summary.liked ? 'DELETE' : 'PUT' }
      );
      if (!response.ok) {
        throw new Error('좋아요를 저장하지 못했습니다.');
      }
      setSummary((await response.json()) as VoteSummaryResponse);
    } catch (error) {
      showToast(error instanceof Error ? error.message : '좋아요를 저장하지 못했습니다.', 'error');
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      aria-busy={pending}
      aria-label={summary.liked ? '좋아요 취소' : '좋아요'}
      aria-pressed={summary.liked}
      className={`${baseClassName} ${summary.liked ? 'border-default-primary bg-default-primary-soft text-default-primary' : 'border-default-separator text-default-secondary-label hover:border-default-primary hover:bg-default-primary-soft hover:text-default-primary'} ${className}`}
      disabled={pending}
      title={summary.liked ? '좋아요 취소' : '좋아요'}
      type="button"
      onClick={toggleVote}
    >
      {pending ? (
        <Loader2 aria-hidden className="size-4 animate-spin" />
      ) : (
        <Heart aria-hidden className={`size-4 ${summary.liked ? 'fill-current' : ''}`} />
      )}
      <span aria-live="polite">{summary.count}</span>
    </button>
  );
}
