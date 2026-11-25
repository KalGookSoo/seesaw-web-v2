'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Loader2 } from 'lucide-react';

import { authorizedFetch } from '@/lib/api-fetch';
import { useAuth } from '@/hooks/use-auth';
import { useSiteContext } from '@/app/site-context-provider';

type ActivityType = 'articles' | 'replies' | 'likes';
type ActivityItem = Readonly<{
  id: string;
  type: 'ARTICLE' | 'REPLY';
  articleId: string;
  title: string;
  preview: string;
  categoryId: string;
  categoryName: string;
  articleType: string | null;
  createdDate: string;
}>;
type ActivityPage = Readonly<{
  content: ActivityItem[];
  page: { number: number; totalPages: number; totalElements: number };
}>;
const tabs: ReadonlyArray<{ id: ActivityType; label: string }> = [
  { id: 'articles', label: '작성한 글' },
  { id: 'replies', label: '작성한 댓글' },
  { id: 'likes', label: '좋아요' }
];

export function ActivityHistory() {
  const { SITE_CONTEXT } = useSiteContext();
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<ActivityType>('articles');
  const [page, setPage] = useState(0);
  const [data, setData] = useState<ActivityPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !SITE_CONTEXT.id) return;
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    setData(null);
    authorizedFetch(
      `/api/me/activity/${tab}?siteId=${encodeURIComponent(SITE_CONTEXT.id)}&page=${page}&size=10`,
      { signal: controller.signal }
    )
      .then((response) => {
        if (!response.ok) throw new Error('활동을 불러오지 못했습니다.');
        return response.json() as Promise<ActivityPage>;
      })
      .then(setData)
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [isAuthenticated, SITE_CONTEXT.id, tab, page, retry]);

  if (!isAuthenticated)
    return (
      <p className="border-default-separator bg-default-surface text-default-secondary-label border p-6 text-sm">
        활동 이력을 확인하려면 로그인해 주세요.
      </p>
    );

  return (
    <section
      className="border-default-separator bg-default-surface border"
      aria-label="활동 목록"
    >
      <nav
        className="border-default-separator flex overflow-x-auto border-b"
        aria-label="활동 유형"
      >
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-current={tab === item.id ? 'page' : undefined}
            onClick={() => {
              setTab(item.id);
              setPage(0);
            }}
            className={`min-h-12 shrink-0 border-b-2 px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-3px] ${tab === item.id ? 'border-default-primary text-default-primary' : 'text-default-secondary-label hover:bg-default-fill border-transparent'}`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      {loading ? (
        <p className="text-default-secondary-label flex justify-center gap-2 p-16 text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          불러오는 중입니다.
        </p>
      ) : error ? (
        <div className="p-12 text-center">
          <p className="text-default-secondary-label text-sm">
            활동 이력을 불러오지 못했습니다.
          </p>
          <button
            type="button"
            className="mt-4 text-sm underline"
            onClick={() => setRetry((value) => value + 1)}
          >
            다시 시도
          </button>
        </div>
      ) : data?.content.length ? (
        <ol>
          {data.content.map((item) => (
            <li
              key={`${item.type}-${item.id}`}
              className="border-default-separator border-b last:border-b-0"
            >
              <Link
                className="hover:bg-default-fill focus-visible:outline-default-primary flex gap-4 px-5 py-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:px-7"
                href={`/articles/${encodeURIComponent(item.articleId)}?categoryId=${encodeURIComponent(item.categoryId)}${item.type === 'REPLY' ? `#${encodeURIComponent(item.id)}` : ''}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-default-primary text-xs font-bold tracking-[0.1em]">
                    {item.categoryName} ·{' '}
                    {item.type === 'REPLY'
                      ? '댓글'
                      : item.articleType || '게시글'}
                  </p>
                  <h2 className="mt-2 text-base font-bold break-words sm:text-lg">
                    {item.title}
                  </h2>
                  {item.preview && (
                    <p className="text-default-secondary-label mt-2 line-clamp-2 text-sm break-words">
                      {item.preview}
                    </p>
                  )}
                  <time
                    className="text-default-tertiary-label mt-3 block text-xs"
                    dateTime={item.createdDate}
                  >
                    {item.createdDate?.slice(0, 10).replaceAll('-', '. ')}
                  </time>
                </div>
                <ArrowUpRight
                  aria-hidden
                  className="text-default-secondary-label size-4 shrink-0"
                />
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-default-secondary-label p-16 text-center text-sm">
          표시할 활동이 없습니다.
        </p>
      )}
      {data && data.page.totalPages > 1 && (
        <div className="border-default-separator flex items-center justify-center gap-4 border-t p-4 text-sm">
          <button
            type="button"
            className="border-default-separator hover:bg-default-fill border px-3 py-2 disabled:opacity-40"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            이전
          </button>
          <span>
            {page + 1} / {data.page.totalPages}
          </span>
          <button
            type="button"
            className="border-default-separator hover:bg-default-fill border px-3 py-2 disabled:opacity-40"
            disabled={page + 1 >= data.page.totalPages}
            onClick={() => setPage(page + 1)}
          >
            다음
          </button>
        </div>
      )}
    </section>
  );
}
