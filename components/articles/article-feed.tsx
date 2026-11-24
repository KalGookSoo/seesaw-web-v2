'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Pin } from 'lucide-react';

import type { ArticleResponse } from '@/types/article';
import type { PagedModel } from '@/types/common';
import type { SearchArticlesParams } from '@/lib/articles';
import { toArticleHref } from '@/lib/articles';
import { toAttachmentUrl } from '@/lib/home-summary';
import { MonochromeImage, MonochromeImageFallback } from '@/components/ui/monochrome-image';

type ArticleFeedProps = Readonly<{
  fixedArticles: readonly ArticleResponse[];
  initialPage: PagedModel<ArticleResponse>;
  search: SearchArticlesParams;
}>;

function toPlainText(content: string | null | undefined): string {
  return (content ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(value));
}

function mergeArticles(
  current: readonly ArticleResponse[],
  incoming: readonly ArticleResponse[]
): ArticleResponse[] {
  return Array.from(
    new Map([...current, ...incoming].map((article) => [article.id, article])).values()
  );
}

function buildFeedQuery(search: SearchArticlesParams, page: number): string {
  const params = new URLSearchParams({
    categoryId: search.categoryId,
    categoryType: search.categoryType ?? 'BOARD',
    page: String(page),
    size: String(search.size ?? 9),
    sort: 'article.createdDate,desc'
  });

  if (search.keyField) {
    params.set('keyField', search.keyField);
  }
  if (search.keyWord) {
    params.set('keyWord', search.keyWord);
  }

  return params.toString();
}

function FeedArticle({ article }: Readonly<{ article: ArticleResponse }>) {
  const thumbnail = article.inlineImages?.[0];
  const content = article.plainContent ?? toPlainText(article.content);

  return (
    <article className="border-default-separator bg-default-surface overflow-hidden border">
      <Link href={toArticleHref(article)} className="group block">
        <div className="bg-default-fill aspect-[4/3] overflow-hidden sm:aspect-[16/9]">
          {thumbnail ? <MonochromeImage className="size-full" imageClassName="object-cover grayscale transition duration-700 group-hover:grayscale-0" src={toAttachmentUrl(thumbnail.id)} alt={thumbnail.originalName ?? article.title} /> : <MonochromeImageFallback className="border-0" label="NO IMAGE / ARTICLE" />}
        </div>
        <div className="border-t p-5 sm:p-7">
          <div className="flex items-center gap-2 text-xs text-default-tertiary-label">
            {article.fixed ? <Pin className="size-3.5" /> : null}
            <span className="font-semibold tracking-[0.16em] uppercase">{article.fixed ? '공지' : 'Feed'}</span>
            <span aria-hidden>·</span>
            <span>{formatDate(article.createdDate)}</span>
          </div>
          <h2 className="text-default-label group-hover:text-default-primary mt-3 line-clamp-3 text-2xl font-black tracking-[-0.05em] text-balance transition-colors sm:text-3xl">
            {article.title}
          </h2>
        </div>
      </Link>
      <div className="p-5 sm:p-7">
        <p className="text-default-secondary-label line-clamp-3 text-sm leading-7 sm:text-base">
          {content || '본문 미리보기가 없습니다.'}
        </p>
        <div className="text-default-tertiary-label mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span>{article.maskedAuthor ?? article.createdBy ?? '익명'}</span>
          <span aria-hidden>|</span>
          <span>{formatDate(article.createdDate)}</span>
          <span aria-hidden>|</span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="size-3.5" />
            {article.replies?.length ?? 0}
          </span>
        </div>
      </div>
    </article>
  );
}

export function ArticleFeed({ fixedArticles, initialPage, search }: ArticleFeedProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const [articles, setArticles] = useState(() => mergeArticles(fixedArticles, initialPage.content));
  const [nextPage, setNextPage] = useState((initialPage.page?.number ?? search.page ?? 0) + 1);
  const [hasMore, setHasMore] = useState((initialPage.page?.number ?? search.page ?? 0) + 1 < (initialPage.page?.totalPages ?? 1));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const totalPages = initialPage.page?.totalPages ?? 1;

  const feedLabel = useMemo(
    () => `${articles.length}개${hasMore ? '+' : ''}`,
    [articles.length, hasMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loadingRef.current) {
          return;
        }

        loadingRef.current = true;
        setLoading(true);
        setError(null);
        const pageToFetch = nextPage;

        fetch(`/api/articles?${buildFeedQuery(search, pageToFetch)}`, {
          headers: { Accept: 'application/json' }
        })
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(`피드를 불러오지 못했습니다. status=${response.status}`);
            }
            return (await response.json()) as PagedModel<ArticleResponse>;
          })
          .then((page) => {
            setArticles((current) => mergeArticles(current, page.content));
            const followingPage = page.page?.number ?? pageToFetch;
            const followingTotalPages = page.page?.totalPages ?? totalPages;
            setNextPage(followingPage + 1);
            setHasMore(followingPage + 1 < followingTotalPages);
          })
          .catch((fetchError: unknown) => {
            setError(fetchError instanceof Error ? fetchError.message : '피드를 불러오지 못했습니다.');
          })
          .finally(() => {
            loadingRef.current = false;
            setLoading(false);
          });
      },
      { rootMargin: '720px 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, nextPage, search, totalPages]);

  return (
    <section aria-label="게시글 피드">
      <header className="mb-5 flex items-end justify-between gap-4 border-b border-default-separator pb-4">
        <div>
          <p className="text-default-primary text-xs font-semibold tracking-[0.2em] uppercase">Visual feed</p>
          <h2 className="text-default-label mt-2 text-xl font-semibold tracking-tight">피드</h2>
        </div>
        <span className="text-default-tertiary-label text-xs">{feedLabel}</span>
      </header>
      <div className="w-full space-y-6">
        {articles.map((article) => <FeedArticle key={article.id} article={article} />)}
      </div>
      <div ref={sentinelRef} className="flex min-h-24 items-center justify-center" aria-live="polite">
        {loading ? <span className="border-default-fill-strong border-t-default-primary size-6 animate-spin border-2" aria-label="피드 불러오는 중" /> : null}
        {!loading && error ? <button className="text-default-secondary-label hover:text-default-label text-sm underline underline-offset-4" type="button" onClick={() => { setHasMore(true); setError(null); }}>다시 불러오기</button> : null}
        {!loading && !error && !hasMore ? <span className="text-default-tertiary-label text-xs">모든 게시글을 확인했습니다.</span> : null}
      </div>
    </section>
  );
}
