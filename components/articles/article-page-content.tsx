import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Eye,
  Grid2X2,
  Inbox,
  List,
  MessageCircle,
  Pencil,
  Pin,
  Search,
  UserRound
} from 'lucide-react';

import type { ArticleResponse } from '@/types/article';
import type { CategoryResponse } from '@/types/category';
import type { PagedModel } from '@/types/common';
import type {
  ArticleViewType,
  ScheduleViewType,
  SearchArticlesParams
} from '@/lib/articles';
import { toArticleHref } from '@/lib/articles';
import { toAttachmentUrl } from '@/lib/home-summary';
import { ArticleFeed } from '@/components/articles/article-feed';
import { SearchFieldDropdown } from '@/components/articles/search-field-dropdown';
import { MagazineStaticContent } from '@/components/articles/magazine-static-content';
import { MonochromeImage } from '@/components/ui/monochrome-image';
import { ScheduleCalendar } from '@/components/articles/schedule-calendar';
import { ContentContainer } from '@/components/layout/content-container';
import editorial from '@/app/style-guide/editorial/editorial.module.css';

type ArticlePageContentProps = Readonly<{
  category: CategoryResponse;
  fixedArticles: readonly ArticleResponse[];
  page: PagedModel<ArticleResponse>;
  search: SearchArticlesParams;
  viewType: ArticleViewType;
  scheduleView?: ScheduleViewType;
}>;

type StaticContentPageProps = Readonly<{
  articles: readonly ArticleResponse[];
  category: CategoryResponse;
}>;

const controlClassName =
  'inline-flex h-9 items-center justify-center gap-2 px-3 text-sm font-medium transition focus-visible:outline-default-label focus-visible:outline-2 focus-visible:outline-offset-[-2px]';

function isRecentlyGenerated(createdDate: string | null | undefined): boolean {
  if (!createdDate) {
    return false;
  }

  const created = new Date(createdDate);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return created >= sevenDaysAgo;
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

function toPlainText(content: string | null | undefined): string {
  return (content ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildArticlesHref(
  search: SearchArticlesParams,
  overrides: Partial<SearchArticlesParams>
): string {
  const params = new URLSearchParams();
  const nextSearch = { ...search, ...overrides };
  params.set('categoryId', nextSearch.categoryId);
  if (nextSearch.categoryType) {
    params.set('categoryType', nextSearch.categoryType);
  }
  if (nextSearch.viewType) {
    params.set('viewType', nextSearch.viewType);
  }
  if (nextSearch.keyField) {
    params.set('keyField', nextSearch.keyField);
  }
  if (nextSearch.keyWord) {
    params.set('keyWord', nextSearch.keyWord);
  }
  if (nextSearch.categoryType === 'SCHEDULE' && nextSearch.scheduleView) {
    params.set(
      'view',
      nextSearch.scheduleView === 'CALENDAR'
        ? 'calendar'
        : nextSearch.scheduleView === 'TABLE'
          ? 'list'
          : 'feed'
    );
  }
  params.set('page', String(nextSearch.page ?? 0));

  return `/articles?${params.toString()}`;
}

function ArticleMeta({
  article,
  showViews = false
}: Readonly<{ article: ArticleResponse; showViews?: boolean }>) {
  return (
    <div className="text-default-tertiary-label mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
      <span>{article.maskedAuthor ?? article.createdBy ?? '익명'}</span>
      <span aria-hidden>|</span>
      <span>{formatDate(article.createdDate)}</span>
      {article.replies?.length ? (
        <>
          <span aria-hidden>|</span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="size-3.5" />
            {article.replies.length}
          </span>
        </>
      ) : null}
      {showViews ? (
        <>
          <span aria-hidden>|</span>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3.5" /> {article.views?.length ?? 0}
          </span>
        </>
      ) : null}
    </div>
  );
}

function ViewSwitcher({
  search,
  viewType,
  scheduleView
}: Readonly<{
  search: SearchArticlesParams;
  viewType: ArticleViewType;
  scheduleView?: ScheduleViewType;
}>) {
  if (search.categoryType === 'SCHEDULE') {
    return (
      <div className="flex border border-[var(--editorial-line-soft)]">
        <Link
          className={`${controlClassName} border-r border-[var(--editorial-line-soft)] ${scheduleView === 'CALENDAR' ? 'bg-default-primary text-default-primary-contrast font-semibold' : 'text-[var(--editorial-ink-soft)] hover:bg-[var(--editorial-surface-muted)] hover:text-[var(--editorial-ink)]'}`}
          href={buildArticlesHref(search, { page: 0, scheduleView: 'CALENDAR', viewType: 'TABLE' })}
        >
          <CalendarDays className="size-4" />
          캘린더
        </Link>
        <Link
          className={`${controlClassName} border-r border-[var(--editorial-line-soft)] ${scheduleView === 'TABLE' ? 'bg-default-primary text-default-primary-contrast font-semibold' : 'text-[var(--editorial-ink-soft)] hover:bg-[var(--editorial-surface-muted)] hover:text-[var(--editorial-ink)]'}`}
          href={buildArticlesHref(search, { page: 0, scheduleView: 'TABLE', viewType: 'TABLE' })}
        >
          <List className="size-4" />
          목록
        </Link>
        <Link
          className={`${controlClassName} ${scheduleView === 'CARD' ? 'bg-default-primary text-default-primary-contrast font-semibold' : 'text-[var(--editorial-ink-soft)] hover:bg-[var(--editorial-surface-muted)] hover:text-[var(--editorial-ink)]'}`}
          href={buildArticlesHref(search, { page: 0, scheduleView: 'CARD', viewType: 'CARD' })}
        >
          <Grid2X2 className="size-4" />
          피드
        </Link>
      </div>
    );
  }

  return (
    <div className="flex border border-[var(--editorial-line-soft)]">
      <Link
        className={`${controlClassName} border-r border-[var(--editorial-line-soft)] ${
          viewType === 'TABLE'
            ? 'bg-default-primary text-default-primary-contrast font-semibold'
            : 'text-[var(--editorial-ink-soft)] hover:bg-[var(--editorial-surface-muted)] hover:text-[var(--editorial-ink)]'
        }`}
        href={buildArticlesHref(search, { page: 0, viewType: 'TABLE' })}
      >
        <List className="size-4" />
        목록
      </Link>
      <Link
        className={`${controlClassName} ${
          viewType === 'CARD'
            ? 'bg-default-primary text-default-primary-contrast font-semibold'
            : 'text-[var(--editorial-ink-soft)] hover:bg-[var(--editorial-surface-muted)] hover:text-[var(--editorial-ink)]'
        }`}
        href={buildArticlesHref(search, { page: 0, viewType: 'CARD' })}
      >
        <Grid2X2 className="size-4" />
        피드
      </Link>
    </div>
  );
}

function SearchForm({ search }: Readonly<{ search: SearchArticlesParams }>) {
  return (
    <form
      action="/articles"
      className="grid gap-2 border-b border-[var(--editorial-line-soft)] py-4 sm:grid-cols-[12rem_minmax(0,1fr)_auto]"
    >
      <input name="categoryId" type="hidden" value={search.categoryId} />
      {search.categoryType ? (
        <input name="categoryType" type="hidden" value={search.categoryType} />
      ) : null}
      <input name="viewType" type="hidden" value={search.viewType ?? 'TABLE'} />
      {search.categoryType === 'SCHEDULE' && search.scheduleView ? (
        <input
          name="view"
          type="hidden"
          value={search.scheduleView === 'CALENDAR' ? 'calendar' : search.scheduleView === 'TABLE' ? 'list' : 'feed'}
        />
      ) : null}
      <SearchFieldDropdown defaultValue={search.keyField ?? 'title'} />
      <input
        className="form-control"
        name="keyWord"
        type="search"
        defaultValue={search.keyWord ?? ''}
        placeholder="검색어"
        aria-label="검색어"
      />
      <button
        className="bg-default-primary text-default-primary-contrast hover:bg-default-primary-muted inline-flex min-h-[2.875rem] items-center justify-center gap-2 px-4 text-sm font-semibold transition"
        type="submit"
      >
        <Search className="size-4" />
        검색
      </button>
    </form>
  );
}

function EmptyState() {
  return (
    <div className="border-y border-[var(--editorial-line-soft)] px-5 py-20 text-center">
      <div className="mx-auto flex size-12 items-center justify-center border border-[var(--editorial-line-soft)] bg-[var(--editorial-surface-muted)] text-[var(--editorial-ink-muted)]">
        <Inbox className="size-6" />
      </div>
      <p className="mt-4 text-base font-semibold text-[var(--editorial-ink)]">
        게시물이 없습니다.
      </p>
      <p className="mt-2 text-sm text-[var(--editorial-ink-soft)]">
        새로운 글이 올라오면 이곳에 표시됩니다.
      </p>
    </div>
  );
}

function formatArchiveMonth(value: string | null | undefined): string {
  if (!value) {
    return '날짜 미상';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long'
  }).format(new Date(value));
}

function formatArchiveDay(value: string | null | undefined): string {
  if (!value) {
    return '--';
  }

  return new Intl.DateTimeFormat('ko-KR', { day: '2-digit' }).format(
    new Date(value)
  );
}

function formatArchiveWeekday(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(
    new Date(value)
  );
}

function ArchiveTimelineEntry({
  article,
  compact,
  pinned
}: Readonly<{
  article: ArticleResponse;
  compact: boolean;
  pinned?: boolean;
}>) {
  const thumbnail = article.inlineImages?.[0];
  const content = article.plainContent ?? toPlainText(article.content);

  return (
    <li className="group relative grid grid-cols-[3.25rem_minmax(0,1fr)] gap-4 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-6">
      <div className="relative border-r border-default-separator pr-4 text-right sm:pr-6">
        <span className="text-default-label block text-xl leading-none font-semibold tracking-tight sm:text-2xl">
          {pinned ? <Pin className="text-default-orange ml-auto size-4" /> : formatArchiveDay(article.createdDate)}
        </span>
        {!pinned ? (
          <span className="text-default-tertiary-label mt-1 block text-[0.65rem] font-medium uppercase">
            {formatArchiveWeekday(article.createdDate)}
          </span>
        ) : null}
        <span className="bg-default-background absolute top-1.5 -right-1.5 size-2.5 border border-default-separator" />
      </div>

      <Link
        className={`relative min-w-0 border-b border-default-separator pb-6 transition-colors last:border-b-0 hover:border-default-primary-muted ${thumbnail ? (compact ? 'grid grid-cols-[minmax(0,1fr)_5rem] gap-3 pt-0 sm:grid-cols-[minmax(0,1fr)_7rem]' : 'grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]') : 'block'}`}
        href={toArticleHref(article)}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-default-tertiary-label text-[0.65rem] font-semibold tracking-[0.16em] uppercase">
              {pinned ? '공지' : 'Article'}
            </span>
            {isRecentlyGenerated(article.createdDate) ? (
              <span className="border-default-label bg-default-label text-default-surface border px-1.5 py-0.5 text-[0.6rem] font-bold">
                NEW
              </span>
            ) : null}
          </div>
          <h2 className="text-default-label group-hover:text-default-primary mt-2 line-clamp-2 text-base font-semibold transition-colors sm:text-lg">
            {article.title}
          </h2>
          {!compact ? (
            <p className="text-default-secondary-label mt-3 line-clamp-2 text-sm leading-6">
              {content || '본문 미리보기가 없습니다.'}
            </p>
          ) : null}
          <ArticleMeta article={article} showViews={!compact} />
        </div>
        {thumbnail ? (
          <MonochromeImage
            className={`${compact ? 'aspect-square' : 'aspect-[4/3]'} w-full`}
            imageClassName="image-filter-transition object-cover"
            src={toAttachmentUrl(thumbnail.id)}
            alt={thumbnail.originalName ?? article.title}
          />
        ) : null}
      </Link>
    </li>
  );
}

function ArticleTimeline({
  fixedArticles,
  page,
  viewType
}: Readonly<{
  fixedArticles: readonly ArticleResponse[];
  page: PagedModel<ArticleResponse>;
  viewType: ArticleViewType;
}>) {
  const articles = page.content.filter((article) => !article.fixed);
  const compact = viewType === 'TABLE';

  if (fixedArticles.length === 0 && articles.length === 0) {
    return <EmptyState />;
  }

  let previousMonth = '';

  return (
    <section>
      <header className="mb-8 flex items-end justify-between gap-4 border-b border-default-separator pb-4">
        <div>
          <p className={`${editorial.label} text-[var(--editorial-primary)]`}>
            Archive timeline
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--editorial-ink)]">
            게시글의 흐름
          </h2>
        </div>
        <span className={`${editorial.label} text-[var(--editorial-ink-muted)]`}>
          {page.page?.totalElements ?? page.content.length} entries
        </span>
      </header>

      <ol className="space-y-7">
        {fixedArticles.map((article) => (
          <ArchiveTimelineEntry
            key={article.id}
            article={article}
            compact={compact}
            pinned
          />
        ))}
        {articles.map((article) => {
          const month = formatArchiveMonth(article.createdDate);
          const showMonth = month !== previousMonth;
          previousMonth = month;

          return (
            <li key={article.id} className="space-y-4">
              {showMonth ? (
                <div className="border-b border-default-separator pb-2 pl-[4.25rem] text-xs font-semibold tracking-[0.16em] text-default-tertiary-label uppercase sm:pl-[7.5rem]">
                  {month}
                </div>
              ) : null}
              <ol>
                <ArchiveTimelineEntry
                  article={article}
                  compact={compact}
                />
              </ol>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Pagination({
  page,
  search
}: Readonly<{
  page: PagedModel<ArticleResponse>;
  search: SearchArticlesParams;
}>) {
  const pageInfo = page.page;
  const current = pageInfo?.number ?? 0;
  const totalPages = Math.max(pageInfo?.totalPages ?? 1, 1);
  const totalElements = pageInfo?.totalElements ?? page.content.length;
  const startPage = Math.max(0, Math.min(current - 2, totalPages - 5));
  const endPage = Math.min(totalPages, startPage + 5);
  const pages = Array.from(
    { length: endPage - startPage },
    (_, index) => startPage + index
  );
  const isFirst = current <= 0;
  const isLast = current >= totalPages - 1;

  return (
    <nav
      className="flex flex-col items-center justify-between gap-3 border-y border-[var(--editorial-line-soft)] py-4 sm:flex-row"
      aria-label="페이지 이동"
    >
      <p className="text-sm text-[var(--editorial-ink-soft)]">
        총{' '}
        <span className="font-semibold text-[var(--editorial-ink)]">
          {totalElements}
        </span>
        개 · {current + 1} / {totalPages}
      </p>
      <div className="flex items-center justify-center gap-1">
        <Link
          className={`inline-flex size-9 items-center justify-center border border-[var(--editorial-line-soft)] text-[var(--editorial-ink-soft)] transition hover:bg-[var(--editorial-surface-muted)] ${
            isFirst ? 'pointer-events-none opacity-40' : ''
          }`}
          href={buildArticlesHref(search, { page: Math.max(current - 1, 0) })}
          aria-label="이전 페이지"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <div className="flex gap-1">
          {pages.map((pageNumber) => (
            <Link
              key={pageNumber}
              className={`inline-flex size-9 items-center justify-center text-sm font-semibold transition ${
                pageNumber === current
                  ? 'bg-[var(--editorial-ink)] text-[var(--editorial-surface)]'
                  : 'border border-[var(--editorial-line-soft)] text-[var(--editorial-ink-soft)] hover:bg-[var(--editorial-surface-muted)]'
              }`}
              href={buildArticlesHref(search, { page: pageNumber })}
            >
              {pageNumber + 1}
            </Link>
          ))}
        </div>
        <Link
          className={`inline-flex size-9 items-center justify-center border border-[var(--editorial-line-soft)] text-[var(--editorial-ink-soft)] transition hover:bg-[var(--editorial-surface-muted)] ${
            isLast ? 'pointer-events-none opacity-40' : ''
          }`}
          href={buildArticlesHref(search, {
            page: Math.min(current + 1, totalPages - 1)
          })}
          aria-label="다음 페이지"
        >
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </nav>
  );
}

export function StaticContentPage({
  articles,
  category
}: StaticContentPageProps) {
  return (
    <main className="bg-default-background text-default-label min-h-full">
      <MagazineStaticContent
        articles={articles}
        categoryDescription={category.description}
        categoryName={category.name}
      />
    </main>
  );
}

export function ArticlePageContent({
  category,
  fixedArticles,
  page,
  search,
  scheduleView,
  viewType
}: ArticlePageContentProps) {
  return (
    <main className={`${editorial.theme} min-h-full`}>
      <ContentContainer className="py-10">
        <Link href="/" className={`${editorial.label} inline-flex items-center gap-2 text-[var(--editorial-ink-muted)] transition hover:text-[var(--editorial-ink)]`}>
          <ChevronLeft size={16} aria-hidden />
          홈으로 돌아가기
        </Link>
        <header className="mt-8 border-b pb-8" style={{ borderColor: 'var(--editorial-line-soft)' }}>
          <p className={`${editorial.label} text-[var(--editorial-primary)]`}>
            {category.type === 'SCHEDULE' ? 'Schedule · Calendar' : 'Board · Articles'}
          </p>
          <h1 className={`${editorial.display} mt-4 text-xl sm:text-3xl`} style={{ lineHeight: 0.95 }}>
            {category.name}
          </h1>
          <p className={`${editorial.body} mt-4 text-base leading-7 text-[var(--editorial-ink-soft)]`}>
            {category.description || (category.type === 'SCHEDULE' ? '다가오는 일정과 월별 일정을 확인하세요.' : '게시판에 공유된 기록을 확인하세요.')}
          </p>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b py-4" style={{ borderColor: 'var(--editorial-line-soft)' }}>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              className={`${controlClassName} border border-[var(--editorial-line-soft)] text-[var(--editorial-ink-soft)] hover:bg-[var(--editorial-surface-muted)] hover:text-[var(--editorial-ink)]`}
              href={buildArticlesHref(search, {
                keyField: 'createdBy',
                keyWord: '',
                page: 0
              })}
            >
              <UserRound className="size-4" />
              내가 쓴 글
            </Link>
            <Link
              className={`${controlClassName} bg-default-primary text-default-primary-contrast hover:bg-default-primary-muted font-semibold`}
              href={`/articles/new?categoryId=${encodeURIComponent(search.categoryId)}&categoryType=${encodeURIComponent(search.categoryType ?? category.type ?? 'BOARD')}`}
            >
              <Pencil className="size-4" />
              글쓰기
            </Link>
          </div>
          <ViewSwitcher search={search} scheduleView={scheduleView} viewType={viewType} />
        </div>

        <SearchForm search={search} />

        <div className="mt-8 space-y-8">
          {scheduleView === 'CALENDAR' ? (
            <ScheduleCalendar categoryId={search.categoryId} query={search.keyWord} />
          ) : viewType === 'CARD' ? (
            <ArticleFeed fixedArticles={fixedArticles} initialPage={page} search={search} />
          ) : (
            <ArticleTimeline fixedArticles={fixedArticles} page={page} viewType={viewType} />
          )}

          {viewType === 'TABLE' ? <Pagination page={page} search={search} /> : null}
        </div>
      </ContentContainer>
    </main>
  );
}
