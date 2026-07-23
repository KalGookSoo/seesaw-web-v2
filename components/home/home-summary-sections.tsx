'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  MessageCircle,
  Newspaper
} from 'lucide-react';

import type { ArticleResponse } from '@/types/article';
import type { CategoryResponse } from '@/types/category';
import type { VEventResponse } from '@/types/event';
import {
  fetchMonthlyEvents,
  fetchRecentArticles,
  toAttachmentUrl
} from '@/lib/home-summary';
import { HorizontalCarousel } from '@/components/home/horizontal-carousel';

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

function bySiteExposedOrder(
  left: CategoryResponse,
  right: CategoryResponse
): number {
  return left.siteExposedOrder - right.siteExposedOrder;
}

function toCategoryHref(category: CategoryResponse): string {
  return `/articles?categoryId=${encodeURIComponent(category.id)}&categoryType=${encodeURIComponent(category.type ?? 'BOARD')}`;
}

function toArticleHref(article: ArticleResponse): string {
  return (
    article.url ??
    `/articles/${article.id}?categoryId=${encodeURIComponent(article.categoryId)}`
  );
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
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  const label = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long'
  }).format(now);

  return { start, end, label };
}

function Spinner() {
  return (
    <div className="border-default-separator bg-default-fill/70 flex min-h-32 items-center justify-center rounded-lg border border-dashed">
      <span
        className="border-default-gray-4 border-t-default-blue size-7 animate-spin rounded-full border-2"
        aria-label="로딩 중"
      />
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
      className="group border-default-separator relative flex min-h-80 flex-col justify-end overflow-hidden rounded-lg border bg-cover bg-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:min-h-96"
      style={
        thumbnail
          ? { backgroundImage: `url(${toAttachmentUrl(thumbnail.id)})` }
          : undefined
      }
    >
      {!thumbnail ? (
        <div className="from-default-blue-muted to-default-mint-soft absolute inset-0 bg-gradient-to-br" />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgb(0_0_0/0.15)_45%,rgb(0_0_0/0.82))]" />
      <div className="relative p-6 text-white sm:p-8">
        <p className="text-xs font-semibold tracking-[0.25em] text-white/75 uppercase">
          새 글
        </p>
        <h3 className="mt-3 line-clamp-3 text-2xl font-semibold text-balance sm:text-3xl">
          {article.title}
        </h3>
        <p className="mt-4 line-clamp-2 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
          {plainContent || '본문 미리보기가 없습니다.'}
        </p>
        <div className="mt-6 flex items-center justify-between gap-3 text-xs text-white/70">
          <span className="truncate">
            {article.maskedAuthor ?? article.createdBy ?? '익명'}
          </span>
          <span className="shrink-0">{formatDate(article.createdDate)}</span>
        </div>
      </div>
    </Link>
  );
}

function ArticleCarouselCard({
  article,
  index
}: Readonly<{ article: ArticleResponse; index: number }>) {
  const thumbnail = article.inlineImages?.[0];
  const plainContent = article.plainContent ?? toPlainText(article.content);

  return (
    <Link
      href={toArticleHref(article)}
      className="group border-default-separator bg-default-surface hover:border-default-blue-muted flex w-64 flex-col overflow-hidden rounded-lg border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:w-72"
    >
      {thumbnail ? (
        <img
          src={toAttachmentUrl(thumbnail.id)}
          alt={thumbnail.originalName ?? article.title}
          className="h-36 w-full object-cover"
        />
      ) : (
        <div className="from-default-blue-muted to-default-mint-soft text-default-tertiary-label flex h-36 items-center justify-center bg-gradient-to-br text-sm font-semibold">
          {String(index).padStart(2, '0')}
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-default-label group-hover:text-default-blue line-clamp-2 text-base font-semibold">
            {article.title}
          </h3>
          {article.replies?.length ? (
            <span className="bg-default-mint-soft text-default-mint-contrast inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium">
              <MessageCircle className="size-3.5" />
              {article.replies.length}
            </span>
          ) : null}
        </div>
        <p className="text-default-secondary-label mt-2 line-clamp-2 flex-1 text-sm leading-6">
          {plainContent || '본문 미리보기가 없습니다.'}
        </p>
        <div className="text-default-tertiary-label mt-3 flex items-center justify-between text-xs">
          <span className="truncate">
            {article.maskedAuthor ?? article.createdBy ?? '익명'}
          </span>
          <span className="shrink-0">{formatDate(article.createdDate)}</span>
        </div>
      </div>
    </Link>
  );
}

function ArticleStoryStack({
  articles
}: Readonly<{ articles: readonly ArticleResponse[] }>) {
  const [featuredArticle, ...otherArticles] = articles;

  return (
    <div className="space-y-4">
      <FeaturedArticle article={featuredArticle} />
      {otherArticles.length > 0 ? (
        <HorizontalCarousel>
          {otherArticles.map((article, index) => (
            <ArticleCarouselCard
              key={article.id}
              article={article}
              index={index + 1}
            />
          ))}
        </HorizontalCarousel>
      ) : null}
    </div>
  );
}

function BoardCategorySection({
  category
}: Readonly<{ category: CategoryResponse }>) {
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
          const message =
            error instanceof Error
              ? error.message
              : '최근 게시글을 조회하지 못했습니다.';
          setState({ status: 'error', data: null, message });
        }
      });

    return () => controller.abort();
  }, [category.id]);

  return (
    <section
      id={category.id}
      className="border-default-separator bg-default-surface/58 scroll-mt-20 rounded-lg border p-5 shadow-sm backdrop-blur sm:p-6"
    >
      <SectionHeader
        category={category}
        icon={<Newspaper className="size-5" />}
      />
      <div className="mt-4">
        {state.status === 'loading' ? <Spinner /> : null}
        {state.status === 'error' ? (
          <EmptyState message={state.message} />
        ) : null}
        {state.status === 'success' && state.data.length === 0 ? (
          <EmptyState message="아직 게시글이 없습니다." />
        ) : null}
        {state.status === 'success' && state.data.length > 0 ? (
          <ArticleStoryStack articles={state.data} />
        ) : null}
      </div>
    </section>
  );
}

function ScheduleCategorySection({
  category,
  monthRange
}: Readonly<{
  category: CategoryResponse;
  monthRange: ReturnType<typeof getMonthRange>;
}>) {
  const [state, setState] = useState<LoadState<readonly VEventResponse[]>>({
    status: 'loading',
    data: null,
    message: null
  });

  useEffect(() => {
    const controller = new AbortController();

    fetchMonthlyEvents(category.id, monthRange.start, monthRange.end, {
      signal: controller.signal
    })
      .then((events) => {
        if (!controller.signal.aborted) {
          setState({ status: 'success', data: events, message: null });
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          const message =
            error instanceof Error
              ? error.message
              : '월간 일정을 조회하지 못했습니다.';
          setState({ status: 'error', data: null, message });
        }
      });

    return () => controller.abort();
  }, [category.id, monthRange.end, monthRange.start]);

  return (
    <section
      id={category.id}
      className="border-default-separator bg-default-surface/58 scroll-mt-20 rounded-lg border p-5 shadow-sm backdrop-blur sm:p-6"
    >
      <SectionHeader
        category={category}
        icon={<CalendarDays className="size-5" />}
        suffix={monthRange.label}
      />
      <div className="mt-4">
        {state.status === 'loading' ? <Spinner /> : null}
        {state.status === 'error' ? (
          <EmptyState message={state.message} />
        ) : null}
        {state.status === 'success' && state.data.length === 0 ? (
          <EmptyState message="이번 달 등록된 일정이 없습니다." />
        ) : null}
        {state.status === 'success' && state.data.length > 0 ? (
          <MonthlyEventList events={state.data} />
        ) : null}
      </div>
    </section>
  );
}

function EventTicketCard({ event }: Readonly<{ event: VEventResponse }>) {
  const start = event.dtStart ? new Date(event.dtStart) : null;
  const day = start ? String(start.getDate()) : '--';
  const month = start
    ? new Intl.DateTimeFormat('ko-KR', { month: 'short' }).format(start)
    : '';

  return (
    <Link
      href={
        event.articleId
          ? `/articles/${event.articleId}?categoryId=${encodeURIComponent(event.article?.categoryId ?? '')}`
          : '#'
      }
      className="group border-default-separator bg-default-surface hover:border-default-blue-muted flex w-56 flex-col overflow-hidden rounded-lg border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="bg-default-blue-soft text-default-blue-contrast flex items-baseline gap-1 px-4 py-3">
        <span className="text-sm font-semibold">{month}</span>
        <span className="text-2xl leading-none font-bold">{day}</span>
        <span className="text-sm font-semibold">일</span>
      </div>
      <div className="flex-1 space-y-2 p-4">
        <p className="text-default-tertiary-label text-xs font-semibold">
          {formatDateTime(event.dtStart)}
        </p>
        <p className="text-default-label group-hover:text-default-blue line-clamp-2 text-sm font-semibold">
          {event.title}
        </p>
        {event.location ? (
          <p className="text-default-secondary-label truncate text-xs">
            {event.location}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function MonthlyEventList({
  events
}: Readonly<{ events: readonly VEventResponse[] }>) {
  return (
    <HorizontalCarousel>
      {events.map((event) => (
        <EventTicketCard key={event.id} event={event} />
      ))}
    </HorizontalCarousel>
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
          <h2 className="text-default-label truncate text-xl font-semibold">
            {category.name}
          </h2>
        </div>
        {suffix ? (
          <p className="text-default-secondary-label mt-1 text-sm">{suffix}</p>
        ) : null}
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
    .filter(
      (category) =>
        isChildCategory(category) &&
        category.siteExposed &&
        category.type === 'BOARD'
    )
    .sort(bySiteExposedOrder);
  const scheduleCategories = [...categories]
    .filter(
      (category) =>
        isChildCategory(category) &&
        category.siteExposed &&
        category.type === 'SCHEDULE'
    )
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
          <ScheduleCategorySection
            key={category.id}
            category={category}
            monthRange={monthRange}
          />
        ))}
      </div>
    </div>
  );
}
