'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
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

type ScheduleView = 'upcoming' | 'monthly';

function getScheduleRange(
  view: ScheduleView,
  month: Date
): Readonly<{ start: Date; end: Date; label: string }> {
  const now = new Date();
  if (view === 'upcoming') {
    const end = new Date(now);
    end.setDate(end.getDate() + 30);
    return { start: now, end, label: '앞으로 30일' };
  }

  const start = new Date(month.getFullYear(), month.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999);
  const label = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' }).format(start);
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
  category
}: Readonly<{
  category: CategoryResponse;
}>) {
  const [view, setView] = useState<ScheduleView>('upcoming');
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const scheduleRange = useMemo(() => getScheduleRange(view, month), [month, view]);
  const [state, setState] = useState<LoadState<readonly VEventResponse[]>>({
    status: 'loading',
    data: null,
    message: null
  });

  useEffect(() => {
    const controller = new AbortController();

    fetchMonthlyEvents(category.id, scheduleRange.start, scheduleRange.end, {
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
              : '일정을 조회하지 못했습니다.';
          setState({ status: 'error', data: null, message });
        }
      });

    return () => controller.abort();
  }, [category.id, scheduleRange.end, scheduleRange.start]);

  return (
    <section
      id={category.id}
      className="border-default-separator bg-default-surface/58 scroll-mt-20 border p-5 backdrop-blur sm:p-6"
    >
      <SectionHeader
        category={category}
        icon={<CalendarDays className="size-5" />}
        suffix={scheduleRange.label}
      />
      <ScheduleViewTabs value={view} onChange={setView} />
      {view === 'monthly' ? <MonthlyMonthNavigator month={month} onChange={setMonth} /> : null}
      <div className="mt-4">
        {state.status === 'loading' ? <Spinner /> : null}
        {state.status === 'error' ? (
          <EmptyState message={state.message} />
        ) : null}
        {state.status === 'success' && view === 'upcoming' ? <UpcomingScheduleList events={state.data} /> : null}
        {state.status === 'success' && view === 'monthly' ? <MonthlyDotCalendar events={state.data} month={scheduleRange.start} /> : null}
      </div>
    </section>
  );
}

function ScheduleViewTabs({
  value,
  onChange
}: Readonly<{
  value: ScheduleView;
  onChange: (value: ScheduleView) => void;
}>) {
  const tabs: ReadonlyArray<Readonly<{ value: ScheduleView; label: string }>> = [
    { value: 'upcoming', label: '다가오는 일정' },
    { value: 'monthly', label: '월별 일정' }
  ];

  return (
    <div className="border-default-separator bg-default-fill/45 mt-4 grid grid-cols-2 gap-1 border p-1" role="tablist" aria-label="일정 보기 방식">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          className={`min-w-0 px-2 py-2 text-xs font-semibold transition sm:text-sm ${value === tab.value ? 'bg-default-surface text-default-label shadow-sm' : 'text-default-tertiary-label hover:text-default-label'}`}
          onClick={() => onChange(tab.value)}
        >
          <span className="block truncate">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

function MonthlyMonthNavigator({
  month,
  onChange
}: Readonly<{
  month: Date;
  onChange: (month: Date) => void;
}>) {
  const label = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' }).format(month);

  return (
    <div className="mt-3 flex items-center justify-between gap-3">
      <button
        type="button"
        className="border-default-separator text-default-secondary-label hover:bg-default-fill hover:text-default-label border p-2 transition"
        aria-label="이전 달"
        onClick={() => onChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
      >
        <ChevronLeft className="size-4" />
      </button>
      <p className="text-default-label text-sm font-semibold">{label}</p>
      <button
        type="button"
        className="border-default-separator text-default-secondary-label hover:bg-default-fill hover:text-default-label border p-2 transition"
        aria-label="다음 달"
        onClick={() => onChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

function UpcomingScheduleList({ events }: Readonly<{ events: readonly VEventResponse[] }>) {
  const upcomingEvents = events
    .filter((event) => event.status !== 'CANCELLED')
    .filter((event) => event.dtStart)
    .sort((left, right) => new Date(left.dtStart ?? 0).getTime() - new Date(right.dtStart ?? 0).getTime())
    .slice(0, 4);

  if (upcomingEvents.length === 0) {
    return <EmptyState message="다가오는 일정이 없습니다." />;
  }

  return (
    <div className="divide-default-separator border-default-separator divide-y border-y">
      {upcomingEvents.map((event) => {
        const start = event.dtStart ? new Date(event.dtStart) : null;
        const dateLabel = start
          ? new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' }).format(start)
          : '일정 미정';

        return (
          <Link
            key={event.id}
            href={event.articleId ? `/articles/${event.articleId}` : '#'}
            className="group grid gap-2 px-1 py-4 transition hover:bg-default-fill/60 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4"
          >
            <time className="text-default-secondary-label text-xs font-semibold tracking-wide uppercase">
              {dateLabel}
            </time>
            <span className="min-w-0">
              <span className="text-default-label block truncate text-sm font-semibold group-hover:underline">
                {event.title || '제목 없는 일정'}
              </span>
              <span className="text-default-tertiary-label mt-1 block truncate text-xs">
                {[formatDateTime(event.dtStart), event.location].filter(Boolean).join(' · ') || '상세 정보 보기'}
              </span>
            </span>
            <ArrowRight className="text-default-tertiary-label hidden size-4 shrink-0 transition-transform group-hover:translate-x-1 sm:block" />
          </Link>
        );
      })}
    </div>
  );
}

function calendarDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function getCalendarDays(month: Date): Date[] {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  firstDay.setDate(firstDay.getDate() - firstDay.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + index);
    return date;
  });
}

function MonthlyDotCalendar({
  events,
  month
}: Readonly<{ events: readonly VEventResponse[]; month: Date }>) {
  const days = getCalendarDays(month);
  const eventDays = new Map<string, number>();
  events
    .filter((event) => event.status !== 'CANCELLED' && event.dtStart)
    .forEach((event) => {
      const key = calendarDateKey(new Date(event.dtStart ?? 0));
      eventDays.set(key, (eventDays.get(key) ?? 0) + 1);
    });

  return (
    <div className="border-default-separator border-t">
      <div className="grid grid-cols-7 border-l border-default-separator text-center text-[0.65rem] font-semibold tracking-[0.12em] uppercase">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <span key={day} className={`border-r border-b border-default-separator py-2 ${index === 0 ? 'text-red-700 dark:text-red-300' : index === 6 ? 'text-blue-700 dark:text-blue-300' : 'text-default-tertiary-label'}`}>
            {day}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 border-l border-default-separator">
        {days.map((day) => {
          const eventCount = eventDays.get(calendarDateKey(day)) ?? 0;
          const currentMonth = day.getMonth() === month.getMonth();
          const today = new Date();
          const isToday = calendarDateKey(day) === calendarDateKey(today);
          const weekendClass = day.getDay() === 0 ? 'text-red-700 dark:text-red-300' : day.getDay() === 6 ? 'text-blue-700 dark:text-blue-300' : 'text-default-label';

          return (
            <div
              key={calendarDateKey(day)}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 border-r border-b border-default-separator p-1.5 sm:min-h-14 ${currentMonth ? 'bg-default-surface' : 'bg-default-fill/35'}`}
              aria-label={`${day.getMonth() + 1}월 ${day.getDate()}일${eventCount > 0 ? ` 일정 ${eventCount}건` : ''}`}
            >
              <span className={`flex size-6 items-center justify-center text-xs ${currentMonth ? weekendClass : 'text-default-tertiary-label'} ${isToday ? 'bg-default-label text-default-surface rounded-full font-bold' : ''}`}>
                {day.getDate()}
              </span>
              <span className={`size-1.5 rounded-full ${eventCount > 0 && currentMonth ? 'bg-default-label' : 'bg-transparent'}`} aria-hidden="true" />
            </div>
          );
        })}
      </div>
      {eventDays.size === 0 ? <p className="text-default-tertiary-label pt-3 text-xs">표시할 일정이 없습니다.</p> : null}
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
          />
        ))}
      </div>
    </div>
  );
}
