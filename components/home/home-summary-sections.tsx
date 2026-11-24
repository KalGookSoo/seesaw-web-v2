'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import type { ArticleResponse } from '@/types/article';
import type { CategoryResponse } from '@/types/category';
import type { VEventResponse } from '@/types/event';
import {
  fetchMonthlyEvents,
  fetchRecentArticles,
  toAttachmentUrl
} from '@/lib/home-summary';
import { MonochromeImage } from '@/components/ui/monochrome-image';
import editorial from '@/app/style-guide/editorial/editorial.module.css';

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
        className="border-default-gray-4 border-t-default-primary size-7 animate-spin rounded-full border-2"
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

type MagazinePattern = 'lead-left' | 'lead-right' | 'split' | 'diagonal';

const magazinePatterns: readonly MagazinePattern[] = [
  'lead-left',
  'lead-right',
  'split',
  'diagonal'
];

function getRandomMagazinePattern(): MagazinePattern {
  return magazinePatterns[Math.floor(Math.random() * magazinePatterns.length)];
}

function getMagazineTileClass(pattern: MagazinePattern, index: number): string {
  const patternClasses: Record<MagazinePattern, readonly string[]> = {
    'lead-left': [
      'sm:col-span-2 sm:min-h-[28rem]',
      'sm:col-span-1',
      'sm:col-span-1',
      'sm:col-span-2',
      'sm:col-span-2'
    ],
    'lead-right': [
      'sm:col-span-2 sm:min-h-[28rem] sm:order-2',
      'sm:col-span-2 sm:order-1',
      'sm:col-span-1 sm:order-3',
      'sm:col-span-1 sm:order-4',
      'sm:col-span-2 sm:order-5'
    ],
    split: [
      'sm:col-span-2',
      'sm:col-span-2',
      'sm:col-span-2',
      'sm:col-span-2',
      'sm:col-span-4'
    ],
    diagonal: [
      'sm:col-span-1 sm:min-h-[28rem]',
      'sm:col-span-3',
      'sm:col-span-1',
      'sm:col-span-3',
      'sm:col-span-4'
    ]
  };

  return patternClasses[pattern][index] ?? 'sm:col-span-1';
}

function MagazineArticleTile({
  article,
  index,
  pattern
}: Readonly<{
  article: ArticleResponse;
  index: number;
  pattern: MagazinePattern;
}>) {
  const thumbnail = article.inlineImages?.find((image) => Boolean(image.id));
  const plainContent = article.plainContent ?? toPlainText(article.content);
  const hasImage = Boolean(thumbnail);

  return (
    <Link
      href={toArticleHref(article)}
      className={`group relative flex min-h-64 overflow-hidden transition-colors sm:min-h-56 ${getMagazineTileClass(pattern, index)} ${hasImage ? 'bg-default-label text-white' : 'bg-default-surface text-default-label hover:bg-default-primary-soft'}`}
    >
      {thumbnail ? (
        <div className="absolute inset-0">
          <MonochromeImage
            className="size-full"
            imageClassName="image-filter-transition object-cover"
            src={toAttachmentUrl(thumbnail.id)}
            alt={thumbnail.originalName ?? article.title ?? '게시글 이미지'}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgb(0_0_0/0.78))] transition-colors group-hover:bg-[linear-gradient(180deg,rgb(95_111_97/0.08),rgb(0_0_0/0.72))]" />
        </div>
      ) : null}
      <div className={`relative flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-6 ${hasImage ? 'min-h-64 sm:min-h-full' : ''}`}>
        <div className="flex items-center justify-between gap-3">
          <span className={`text-[0.65rem] font-bold tracking-[0.18em] uppercase ${hasImage ? 'text-white/70' : 'text-default-primary'}`}>
            {String(index + 1).padStart(2, '0')} · 기록
          </span>
          {hasImage ? <span className="text-[0.65rem] tracking-[0.16em] text-white/60 uppercase">Image</span> : <span className="text-[0.65rem] tracking-[0.16em] text-default-tertiary-label uppercase">Text</span>}
        </div>
        <div className="mt-12">
          <h3 className={`line-clamp-3 text-xl font-bold tracking-tight text-balance sm:text-2xl ${hasImage ? 'text-white' : 'text-default-label group-hover:text-default-primary'}`}>
            {article.title || '제목 없는 게시글'}
          </h3>
          <p className={`mt-3 line-clamp-3 text-sm leading-6 ${hasImage ? 'text-white/80' : 'text-default-secondary-label'}`}>
            {plainContent || '본문 미리보기가 없습니다.'}
          </p>
          <div className={`mt-6 flex flex-wrap items-center justify-between gap-2 text-xs ${hasImage ? 'text-white/65' : 'text-default-tertiary-label'}`}>
            <span className="truncate">{article.maskedAuthor ?? article.createdBy ?? '익명'}</span>
            <span className="shrink-0">{formatDate(article.createdDate)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ArticleMagazineGrid({
  articles
}: Readonly<{ articles: readonly ArticleResponse[] }>) {
  const [pattern, setPattern] = useState<MagazinePattern>('lead-left');

  useEffect(() => {
    setPattern(getRandomMagazinePattern());
  }, []);

  return (
    <div className="border-default-separator grid grid-cols-1 gap-px overflow-hidden border bg-default-separator sm:grid-cols-4">
      {articles.map((article, index) => (
        <MagazineArticleTile
          key={article.id}
          article={article}
          index={index}
          pattern={pattern}
        />
      ))}
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
      className="scroll-mt-24"
    >
      <SectionHeader category={category} />
      <div className="mt-4">
        {state.status === 'loading' ? <Spinner /> : null}
        {state.status === 'error' ? (
          <EmptyState message={state.message} />
        ) : null}
        {state.status === 'success' && state.data.length === 0 ? (
          <EmptyState message="아직 게시글이 없습니다." />
        ) : null}
        {state.status === 'success' && state.data.length > 0 ? (
          <ArticleMagazineGrid articles={state.data} />
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
      className="scroll-mt-24"
    >
      <SectionHeader category={category} suffix={scheduleRange.label} />
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
    <div className="tab-group mt-4 grid-cols-2" role="tablist" aria-label="일정 보기 방식">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          className={`min-w-0 px-2 py-2 text-xs font-semibold transition sm:text-sm ${value === tab.value ? 'bg-default-surface text-default-label' : 'text-default-tertiary-label hover:bg-default-surface/60 hover:text-default-label'}`}
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

  const [featuredEvent, ...otherEvents] = upcomingEvents;
  const featuredStart = featuredEvent.dtStart ? new Date(featuredEvent.dtStart) : null;

  return (
    <div className={`grid gap-px border border-default-separator bg-default-separator ${otherEvents.length > 0 ? 'sm:grid-cols-[1.05fr_1fr]' : ''}`}>
      <Link
        href={featuredEvent.articleId ? `/articles/${featuredEvent.articleId}` : '#'}
        className="group bg-default-surface text-default-label flex min-h-56 flex-col justify-between p-5 transition-colors hover:bg-default-fill sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="text-default-primary text-[0.65rem] font-bold tracking-[0.18em] uppercase">다음 일정</span>
          <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
        </div>
        <div className="mt-12">
          <time className="block text-4xl font-bold tracking-tight sm:text-5xl">
            {featuredStart ? featuredStart.getDate() : '--'}
          </time>
          <p className="text-default-secondary-label mt-1 text-xs tracking-[0.16em] uppercase">
            {featuredStart ? new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', weekday: 'short' }).format(featuredStart) : '일정 미정'}
          </p>
          <h3 className="mt-5 line-clamp-2 text-xl font-bold tracking-tight text-balance">
            {featuredEvent.title || '제목 없는 일정'}
          </h3>
          <p className="text-default-secondary-label mt-2 line-clamp-1 text-sm">
            {[formatDateTime(featuredEvent.dtStart), featuredEvent.location].filter(Boolean).join(' · ') || '상세 정보 보기'}
          </p>
        </div>
      </Link>
      {otherEvents.length > 0 ? (
        <div className="divide-default-separator bg-default-surface divide-y">
          {otherEvents.map((event) => {
            const start = event.dtStart ? new Date(event.dtStart) : null;
            const dateLabel = start
              ? new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' }).format(start)
              : '일정 미정';

            return (
              <Link
                key={event.id}
                href={event.articleId ? `/articles/${event.articleId}` : '#'}
                className="group grid gap-2 px-4 py-4 transition hover:bg-default-fill sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-3"
              >
                <time className="text-default-secondary-label text-xs font-semibold tracking-wide uppercase">{dateLabel}</time>
                <span className="min-w-0">
                  <span className="text-default-label block truncate text-sm font-semibold group-hover:text-default-primary">{event.title || '제목 없는 일정'}</span>
                  <span className="text-default-tertiary-label mt-1 block truncate text-xs">{[formatDateTime(event.dtStart), event.location].filter(Boolean).join(' · ') || '상세 정보 보기'}</span>
                </span>
                <ArrowRight className="text-default-tertiary-label hidden size-4 shrink-0 transition-transform group-hover:translate-x-1 sm:block" />
              </Link>
            );
          })}
        </div>
      ) : null}
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
          <span key={day} className={`border-r border-b border-default-separator py-2 ${index === 0 ? 'text-default-danger' : index === 6 ? 'text-default-secondary' : 'text-default-tertiary-label'}`}>
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
          const weekendClass = day.getDay() === 0 ? 'text-default-danger' : day.getDay() === 6 ? 'text-default-secondary' : 'text-default-label';

          return (
            <div
              key={calendarDateKey(day)}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 border-r border-b border-default-separator p-1.5 sm:min-h-14 ${currentMonth ? 'bg-default-surface' : 'bg-default-fill/35'}`}
              aria-label={`${day.getMonth() + 1}월 ${day.getDate()}일${eventCount > 0 ? ` 일정 ${eventCount}건` : ''}`}
            >
              <span className={`flex size-6 items-center justify-center text-xs ${currentMonth ? weekendClass : 'text-default-tertiary-label'} ${isToday ? 'bg-default-label text-default-surface font-bold' : ''}`}>
                {day.getDate()}
              </span>
              <span className={`size-1.5 ${eventCount > 0 && currentMonth ? 'bg-default-primary' : 'bg-transparent'}`} aria-hidden="true" />
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
  suffix
}: Readonly<{
  category: CategoryResponse;
  suffix?: string;
}>) {
  return (
    <header className="grid gap-4 border-b border-default-separator pb-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <div className="min-w-0">
        <p className={`${editorial.label} text-default-primary`}>{category.type === 'SCHEDULE' ? '일정 · Schedule' : '게시판 · Board'}</p>
        <h2 className={`${editorial.display} text-default-label mt-3 truncate text-xl sm:text-3xl`} style={{ lineHeight: 0.95 }}>{category.name}</h2>
        {suffix ? <p className={`${editorial.body} text-default-secondary-label mt-3 text-base`}>{suffix}</p> : null}
      </div>
      <Link
        href={toCategoryHref(category)}
        className="text-default-secondary-label hover:text-default-primary inline-flex shrink-0 items-center gap-2 text-xs font-bold tracking-[0.16em] uppercase transition"
      >
        열어보기
        <ArrowRight className="size-4" />
      </Link>
    </header>
  );
}

export function HomeSummarySections({ categories }: HomeSummarySectionsProps) {
  const exposedCategories = [...categories]
    .filter(
      (category) =>
        isChildCategory(category) &&
        category.siteExposed &&
        (category.type === 'BOARD' || category.type === 'SCHEDULE')
    )
    .sort(bySiteExposedOrder);

  return (
    <div className="space-y-16">
      {exposedCategories.map((category) => (
        category.type === 'SCHEDULE' ? (
          <ScheduleCategorySection key={category.id} category={category} />
        ) : (
          <BoardCategorySection key={category.id} category={category} />
        )
      ))}
    </div>
  );
}
