'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, MessageCircle, Newspaper } from 'lucide-react';

import type { ArticleResponse, CategoryResponse, VEventResponse } from '@/types/site';
import { fetchMonthlyEvents, fetchRecentArticles, toAttachmentUrl } from '@/lib/home-summary';

type LoadState<T> =
  | Readonly<{
      status: 'loading';
      data: null;
      message: null;
    }>
  | Readonly<{
      status: 'success';
      data: T;
      message: null;
    }>
  | Readonly<{
      status: 'error';
      data: null;
      message: string;
    }>;

type HomeSummarySectionsProps = Readonly<{
  categories: readonly CategoryResponse[];
}>;

function isChildCategory(category: CategoryResponse): boolean {
  return Boolean(category.parentId);
}

function bySiteExposedOrder(left: CategoryResponse, right: CategoryResponse): number {
  return left.siteExposedOrder - right.siteExposedOrder;
}

function toCategoryHref(category: CategoryResponse): string {
  return `/articles?categoryId=${encodeURIComponent(category.id)}&categoryType=${encodeURIComponent(category.type ?? 'BOARD')}`;
}

function toArticleHref(article: ArticleResponse): string {
  return article.url ?? `/articles/${article.id}?categoryId=${encodeURIComponent(article.categoryId)}`;
}

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

function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function getMonthRange(): Readonly<{ start: Date; end: Date; label: string }> {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const label = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long'
  }).format(now);

  return { start, end, label };
}

function Spinner() {
  return (
    <div className="border-default-separator bg-default-fill/70 flex min-h-32 items-center justify-center rounded-lg border border-dashed">
      <span className="border-default-gray-4 border-t-default-blue size-7 animate-spin rounded-full border-2" aria-label="로딩 중" />
    </div>
  );
}

function EmptyState({ message }: Readonly<{ message: string }>) {
  return (
    <div className="border-default-separator bg-default-fill/70 text-default-secondary-label rounded-lg border border-dashed px-5 py-8 text-center text-sm">
      {message}
    </div>
  );
}

function FeaturedArticle({ article }: Readonly<{ article: ArticleResponse }>) {
  const thumbnail = article.inlineImages?.[0];
  const plainContent = article.plainContent ?? toPlainText(article.content);

  return (
    <Link
      href={toArticleHref(article)}
      className="group border-default-separator bg-default-surface hover:border-default-blue-muted grid min-h-72 overflow-hidden rounded-lg border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:grid-cols-[minmax(0,1fr)_13rem]"
    >
      <div className="flex flex-col justify-between p-5 sm:p-6">
        <div>
          <p className="text-default-blue text-sm font-semibold">새 글</p>
          <h3 className="text-default-label group-hover:text-default-blue mt-3 line-clamp-3 text-2xl font-semibold text-balance">
            {article.title}
          </h3>
          <p className="text-default-secondary-label mt-4 line-clamp-4 text-sm leading-7">{plainContent || '본문 미리보기가 없습니다.'}</p>
        </div>
        <div className="text-default-tertiary-label mt-8 flex items-center justify-between gap-3 text-xs">
          <span className="truncate">{article.maskedAuthor ?? article.createdBy ?? '익명'}</span>
          <span className="shrink-0">{formatDate(article.createdDate)}</span>
        </div>
      </div>
      {thumbnail ? (
        <img
          src={toAttachmentUrl(thumbnail.id)}
          alt={thumbnail.originalName ?? article.title}
          className="h-48 w-full object-cover lg:h-full"
        />
      ) : (
        <div className="from-default-blue-muted to-default-mint-soft hidden bg-gradient-to-br lg:block" />
      )}
    </Link>
  );
}

function ArticleListItem({ article, index }: Readonly<{ article: ArticleResponse; index: number }>) {
  const thumbnail = article.inlineImages?.[0];
  const plainContent = article.plainContent ?? toPlainText(article.content);

  return (
    <Link
      href={toArticleHref(article)}
      className="group border-default-separator hover:border-default-blue-muted grid gap-4 rounded-lg border bg-white/35 p-4 transition hover:bg-white/55 sm:grid-cols-[4.5rem_1fr]"
    >
      {thumbnail ? (
        <img
          src={toAttachmentUrl(thumbnail.id)}
          alt={thumbnail.originalName ?? article.title}
          className="size-[4.5rem] rounded-md object-cover"
        />
      ) : (
        <div className="bg-default-fill text-default-secondary-label flex size-[4.5rem] items-center justify-center rounded-md text-sm font-semibold">
          {String(index + 1).padStart(2, '0')}
        </div>
      )}
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-default-label group-hover:text-default-blue line-clamp-2 text-base font-semibold">{article.title}</h3>
          {article.replies?.length ? (
            <span className="bg-default-mint-soft text-default-mint-contrast inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium">
              <MessageCircle className="size-3.5" />
              {article.replies.length}
            </span>
          ) : null}
        </div>
        <p className="text-default-secondary-label mt-2 line-clamp-2 text-sm leading-6">{plainContent || '본문 미리보기가 없습니다.'}</p>
        <div className="text-default-tertiary-label mt-3 flex items-center justify-between text-xs">
          <span className="truncate">{article.maskedAuthor ?? article.createdBy ?? '익명'}</span>
          <span className="shrink-0">{formatDate(article.createdDate)}</span>
        </div>
      </div>
    </Link>
  );
}

function ArticleStoryStack({ articles }: Readonly<{ articles: readonly ArticleResponse[] }>) {
  const [featuredArticle, ...otherArticles] = articles;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)]">
      <FeaturedArticle article={featuredArticle} />
      {otherArticles.length > 0 ? (
        <div className="flex flex-col gap-4 xl:pt-10">
          {otherArticles.map((article, index) => (
            <ArticleListItem key={article.id} article={article} index={index + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function BoardCategorySection({ category }: Readonly<{ category: CategoryResponse }>) {
  const [state, setState] = useState<LoadState<readonly ArticleResponse[]>>({
    status: 'loading',
    data: null,
    message: null
  });

  useEffect(() => {
    const controller = new AbortController();

    fetchRecentArticles(category.id, { signal: controller.signal })
      .then((page) => {
        if (!controller.signal.aborted) {
          setState({ status: 'success', data: page.content, message: null });
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          const message = error instanceof Error ? error.message : '최근 게시글을 조회하지 못했습니다.';
          setState({ status: 'error', data: null, message });
        }
      });

    return () => controller.abort();
  }, [category.id]);

  return (
    <section className="border-default-separator bg-default-surface/58 rounded-lg border p-5 shadow-sm backdrop-blur sm:p-6">
      <SectionHeader category={category} icon={<Newspaper className="size-5" />} />
      <div className="mt-4">
        {state.status === 'loading' ? <Spinner /> : null}
        {state.status === 'error' ? <EmptyState message={state.message} /> : null}
        {state.status === 'success' && state.data.length === 0 ? <EmptyState message="아직 게시글이 없습니다." /> : null}
        {state.status === 'success' && state.data.length > 0 ? <ArticleStoryStack articles={state.data} /> : null}
      </div>
    </section>
  );
}

function ScheduleCategorySection({
  category,
  monthRange
}: Readonly<{ category: CategoryResponse; monthRange: ReturnType<typeof getMonthRange> }>) {
  const [state, setState] = useState<LoadState<readonly VEventResponse[]>>({
    status: 'loading',
    data: null,
    message: null
  });

  useEffect(() => {
    const controller = new AbortController();

    fetchMonthlyEvents(category.id, monthRange.start, monthRange.end, { signal: controller.signal })
      .then((events) => {
        if (!controller.signal.aborted) {
          setState({ status: 'success', data: events, message: null });
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          const message = error instanceof Error ? error.message : '월간 일정을 조회하지 못했습니다.';
          setState({ status: 'error', data: null, message });
        }
      });

    return () => controller.abort();
  }, [category.id, monthRange.end, monthRange.start]);

  return (
    <section className="border-default-separator bg-default-surface/58 rounded-lg border p-5 shadow-sm backdrop-blur sm:p-6">
      <SectionHeader category={category} icon={<CalendarDays className="size-5" />} suffix={monthRange.label} />
      <div className="mt-4">
        {state.status === 'loading' ? <Spinner /> : null}
        {state.status === 'error' ? <EmptyState message={state.message} /> : null}
        {state.status === 'success' && state.data.length === 0 ? <EmptyState message="이번 달 등록된 일정이 없습니다." /> : null}
        {state.status === 'success' && state.data.length > 0 ? <MonthlyEventList events={state.data} /> : null}
      </div>
    </section>
  );
}

function MonthlyEventList({ events }: Readonly<{ events: readonly VEventResponse[] }>) {
  return (
    <div className="border-default-separator bg-default-surface overflow-hidden rounded-lg border shadow-sm">
      <ul className="divide-default-separator divide-y">
        {events.map((event) => (
          <li key={event.id} className="grid gap-3 px-4 py-4 sm:grid-cols-[8.5rem_1fr]">
            <time className="text-default-blue text-sm font-semibold">{formatDateTime(event.dtStart)}</time>
            <div className="min-w-0 space-y-1">
              <Link
                href={
                  event.articleId ? `/articles/${event.articleId}?categoryId=${encodeURIComponent(event.article?.categoryId ?? '')}` : '#'
                }
                className="text-default-label hover:text-default-blue block truncate text-base font-semibold"
              >
                {event.title}
              </Link>
              {event.location ? <p className="text-default-secondary-label truncate text-sm">{event.location}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionHeader({
  category,
  icon,
  suffix
}: Readonly<{
  category: CategoryResponse;
  icon: React.ReactNode;
  suffix?: string;
}>) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-default-blue flex items-center gap-2">
          {icon}
          <h2 className="text-default-label truncate text-xl font-semibold">{category.name}</h2>
        </div>
        {suffix ? <p className="text-default-secondary-label mt-1 text-sm">{suffix}</p> : null}
      </div>
      <Link
        href={toCategoryHref(category)}
        className="border-default-separator bg-default-surface text-default-secondary-label hover:border-default-blue-muted hover:text-default-blue inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition"
      >
        더보기
        <ArrowRight className="size-4" />
      </Link>
    </header>
  );
}

export function HomeSummarySections({ categories }: HomeSummarySectionsProps) {
  const monthRange = useMemo(() => getMonthRange(), []);
  const boardCategories = [...categories]
    .filter((category) => isChildCategory(category) && category.siteExposed && category.type === 'BOARD')
    .sort(bySiteExposedOrder);
  const scheduleCategories = [...categories]
    .filter((category) => isChildCategory(category) && category.siteExposed && category.type === 'SCHEDULE')
    .sort(bySiteExposedOrder);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.72fr)] xl:items-start">
      <div className="space-y-8">
        {boardCategories.map((category) => (
          <BoardCategorySection key={category.id} category={category} />
        ))}
      </div>
      <div className="space-y-8 xl:sticky xl:top-6 xl:pt-16">
        {scheduleCategories.map((category) => (
          <ScheduleCategorySection key={category.id} category={category} monthRange={monthRange} />
        ))}
      </div>
    </div>
  );
}
