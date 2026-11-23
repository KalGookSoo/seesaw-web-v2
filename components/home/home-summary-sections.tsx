'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
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
    `/articles/${article.id}`
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
    <div className="border-default-separator bg-default-fill/70 flex min-h-32 items-center justify-center border border-dashed">
      <span
        className="border-default-gray-4 border-t-default-blue size-7 animate-spin rounded-full border-2"
        aria-label="로딩 중"
      />
    </div>
  );
}

function EmptyState({ message }: Readonly<{ message: string }>) {
  return (
    <div className="border-default-separator bg-default-fill/70 text-default-secondary-label border border-dashed px-5 py-8 text-center text-sm">
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

function ArticleStoryStack({
  articles
}: Readonly<{ articles: readonly ArticleResponse[] }>) {
  const [featuredArticle, ...otherArticles] = articles;

  return (
    <div className="space-y-4">
      <FeaturedArticle article={featuredArticle} />
      {otherArticles.length > 0 ? (
        <div className="divide-y divide-default-separator border-y border-default-separator">
          {otherArticles.map((article, index) => (
            <ArticleListRow key={article.id} article={article} index={index + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ArticleListRow({
  article,
  index
}: Readonly<{ article: ArticleResponse; index: number }>) {
  const plainContent = article.plainContent ?? toPlainText(article.content);

  return (
    <Link href={toArticleHref(article)} className="group grid gap-2 px-1 py-4 transition-colors hover:bg-default-fill sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
      <span className="text-xs text-default-tertiary-label">{String(index).padStart(2, '0')}</span>
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-default-label group-hover:text-default-blue">{article.title}</h3>
        <p className="mt-1 line-clamp-1 text-xs leading-5 text-default-secondary-label">{plainContent || '본문 미리보기가 없습니다.'}</p>
      </div>
      <div className="flex gap-3 text-xs text-default-tertiary-label sm:flex-col sm:items-end sm:gap-1">
        <span>{article.maskedAuthor ?? article.createdBy ?? '익명'}</span>
        <span>{formatDate(article.createdDate)}</span>
      </div>
    </Link>
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
      className="border-default-separator bg-default-surface/58 scroll-mt-20 border p-5 backdrop-blur sm:p-6"
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
      className="border-default-separator bg-default-surface/58 scroll-mt-20 border p-5 backdrop-blur sm:p-6"
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
          <MonthlyCalendar events={state.data} month={monthRange.start} />
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
          ? `/articles/${event.articleId}`
          : '#'
      }
      className="group border-default-separator bg-default-surface hover:border-default-blue-muted flex w-full flex-col overflow-hidden border transition"
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

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function monthDays(date: Date): Date[] {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function MonthlyCalendar({
  events,
  month
}: Readonly<{ events: readonly VEventResponse[]; month: Date }>) {
  const days = monthDays(month);
  const eventsByDay = new Map<string, VEventResponse[]>();
  events.forEach((event) => {
    if (!event.dtStart) return;
    const key = dateKey(new Date(event.dtStart));
    eventsByDay.set(key, [...(eventsByDay.get(key) ?? []), event]);
  });

  return (
    <div>
      <div className="grid grid-cols-7 border-t border-l border-default-separator text-center text-[0.65rem] font-semibold tracking-[0.12em] text-default-tertiary-label uppercase">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => <span key={day} className="border-r border-b border-default-separator py-2">{day}</span>)}
      </div>
      <div className="hidden grid-cols-7 border-l border-default-separator sm:grid">
        {days.map((day) => {
          const dayEvents = eventsByDay.get(dateKey(day)) ?? [];
          const currentMonth = day.getMonth() === month.getMonth();
          return (
            <div key={dateKey(day)} className={`min-h-24 border-r border-b border-default-separator p-2 ${currentMonth ? 'bg-default-surface' : 'bg-default-fill/45'}`}>
              <span className={`text-xs ${currentMonth ? 'text-default-label' : 'text-default-tertiary-label'}`}>{day.getDate()}</span>
              <div className="mt-2 space-y-1">
                {dayEvents.slice(0, 2).map((event) => <a key={event.id} href={event.articleId ? `/articles/${event.articleId}` : '#'} className="block truncate border-l-2 border-default-blue bg-default-blue-soft px-1.5 py-1 text-left text-[0.65rem] font-medium text-default-blue-contrast hover:bg-default-fill">{event.title}</a>)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="space-y-2 pt-3 sm:hidden">{events.map((event) => <EventTicketCard key={event.id} event={event} />)}</div>
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
        className="border-default-separator bg-default-surface text-default-secondary-label hover:border-default-blue-muted hover:text-default-blue inline-flex shrink-0 items-center gap-1 border px-3 py-1.5 text-sm font-medium transition"
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
