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
import { MosaicStaticContent } from '@/components/articles/mosaic-static-content';
import { MonochromeImage, MonochromeImageFallback } from '@/components/ui/monochrome-image';
import { ScheduleCalendar } from '@/components/articles/schedule-calendar';

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

const mattePanelClassName =
  'border-default-separator bg-default-surface/85 rounded-lg border shadow-[0_1px_2px_rgb(0_0_0_/_0.04),inset_0_1px_0_rgb(255_255_255_/_0.35)] backdrop-blur';

const controlClassName =
  'inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition focus-visible:ring-default-blue/15 focus-visible:ring-4 focus-visible:outline-none';

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
      <div className="bg-default-fill grid grid-cols-3 gap-1 border border-default-separator p-1">
        <Link
          className={`${controlClassName} ${scheduleView === 'CALENDAR' ? 'bg-default-surface text-default-label shadow-[0_1px_2px_rgb(0_0_0_/_0.12)]' : 'text-default-secondary-label hover:text-default-label'}`}
          href={buildArticlesHref(search, { page: 0, scheduleView: 'CALENDAR', viewType: 'TABLE' })}
        >
          <CalendarDays className="size-4" />
          캘린더
        </Link>
        <Link
          className={`${controlClassName} ${scheduleView === 'TABLE' ? 'bg-default-surface text-default-label shadow-[0_1px_2px_rgb(0_0_0_/_0.12)]' : 'text-default-secondary-label hover:text-default-label'}`}
          href={buildArticlesHref(search, { page: 0, scheduleView: 'TABLE', viewType: 'TABLE' })}
        >
          <List className="size-4" />
          목록
        </Link>
        <Link
          className={`${controlClassName} ${scheduleView === 'CARD' ? 'bg-default-surface text-default-label shadow-[0_1px_2px_rgb(0_0_0_/_0.12)]' : 'text-default-secondary-label hover:text-default-label'}`}
          href={buildArticlesHref(search, { page: 0, scheduleView: 'CARD', viewType: 'CARD' })}
        >
          <Grid2X2 className="size-4" />
          피드
        </Link>
      </div>
    );
  }

  return (
    <div className="tab-group grid-cols-2">
      <Link
        className={`${controlClassName} ${
          viewType === 'TABLE'
            ? 'bg-default-surface text-default-label shadow-[0_1px_2px_rgb(0_0_0_/_0.12)]'
            : 'text-default-secondary-label hover:text-default-label'
        }`}
        href={buildArticlesHref(search, { page: 0, viewType: 'TABLE' })}
      >
        <List className="size-4" />
        목록
      </Link>
      <Link
        className={`${controlClassName} ${
          viewType === 'CARD'
            ? 'bg-default-surface text-default-label shadow-[0_1px_2px_rgb(0_0_0_/_0.12)]'
            : 'text-default-secondary-label hover:text-default-label'
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
      className="border-default-separator bg-default-surface grid gap-2 border p-2 sm:grid-cols-[12rem_1fr_auto]"
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
        className="form-control h-10"
        name="keyWord"
        type="search"
        defaultValue={search.keyWord ?? ''}
        placeholder="검색어"
        aria-label="검색어"
      />
      <button
        className="border-default-label bg-default-label text-default-background inline-flex h-10 items-center justify-center gap-2 border px-4 text-sm font-semibold transition hover:bg-default-secondary-label focus-visible:ring-2 focus-visible:ring-default-blue/20 focus-visible:outline-none"
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
    <div className={`${mattePanelClassName} px-5 py-14 text-center`}>
      <div className="bg-default-fill text-default-tertiary-label mx-auto flex size-12 items-center justify-center rounded-lg">
        <Inbox className="size-6" />
      </div>
      <p className="text-default-label mt-4 text-base font-medium">
        게시물이 없습니다.
      </p>
      <p className="text-default-secondary-label mt-2 text-sm">
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
        className={`relative min-w-0 border-b border-default-separator pb-6 transition-colors last:border-b-0 hover:border-default-blue-muted ${compact ? 'grid grid-cols-[minmax(0,1fr)_5rem] gap-3 pt-0 sm:grid-cols-[minmax(0,1fr)_7rem]' : 'grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]'}`}
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
          <h2 className="text-default-label group-hover:text-default-blue mt-2 line-clamp-2 text-base font-semibold transition-colors sm:text-lg">
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
            imageClassName="object-cover grayscale transition duration-500 group-hover:grayscale-0"
            src={toAttachmentUrl(thumbnail.id)}
            alt={thumbnail.originalName ?? article.title}
          />
        ) : (
          <MonochromeImageFallback className={`${compact ? 'aspect-square' : 'aspect-[4/3]'} w-full`} label="NO IMAGE / ARTICLE" />
        )}
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
    <section className={`${mattePanelClassName} p-5 sm:p-7`}>
      <header className="mb-8 flex items-end justify-between gap-4 border-b border-default-separator pb-4">
        <div>
          <p className="text-default-blue text-xs font-semibold tracking-[0.2em] uppercase">
            Archive timeline
          </p>
          <h2 className="text-default-label mt-2 text-xl font-semibold tracking-tight">
            게시글의 흐름
          </h2>
        </div>
        <span className="text-default-tertiary-label text-xs">
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
      className={`${mattePanelClassName} flex flex-col items-center justify-between gap-3 px-3 py-3 sm:flex-row`}
      aria-label="페이지 이동"
    >
      <p className="text-default-secondary-label text-sm">
        총{' '}
        <span className="text-default-label font-semibold">
          {totalElements}
        </span>
        개 · {current + 1} / {totalPages}
      </p>
      <div className="flex items-center justify-center gap-1">
        <Link
          className={`bg-default-fill text-default-secondary-label hover:bg-default-gray-5 inline-flex size-9 items-center justify-center rounded-md transition ${
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
              className={`inline-flex size-9 items-center justify-center rounded-md text-sm font-semibold transition ${
                pageNumber === current
                  ? 'bg-default-blue text-white shadow-sm'
                  : 'bg-default-fill text-default-secondary-label hover:bg-default-gray-5'
              }`}
              href={buildArticlesHref(search, { page: pageNumber })}
            >
              {pageNumber + 1}
            </Link>
          ))}
        </div>
        <Link
          className={`bg-default-fill text-default-secondary-label hover:bg-default-gray-5 inline-flex size-9 items-center justify-center rounded-md transition ${
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
      <header className="bg-default-background relative z-10 mx-auto flex max-w-6xl items-end justify-between gap-6 px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="min-w-0">
          <Link
            className="text-default-tertiary-label hover:text-default-label text-xs font-semibold tracking-[0.18em] uppercase transition"
            href="/"
          >
            ← Back to space
          </Link>
          <p className="text-default-blue mt-8 text-xs font-semibold tracking-[0.2em] uppercase">
            Static content / Exhibition
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            {category.name}
          </h1>
          {category.description ? (
            <p className="text-default-secondary-label mt-4 max-w-2xl text-sm leading-7 sm:text-base">
              {category.description}
            </p>
          ) : null}
        </div>
        <span className="text-default-tertiary-label shrink-0 pb-1 text-xs tracking-[0.16em] uppercase">
          {String(articles.length).padStart(2, '0')} entries
        </span>
      </header>

      <MosaicStaticContent articles={articles} />
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
    <main className="bg-default-surface-grouped min-h-full px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className={mattePanelClassName}>
          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-default-secondary-label text-sm font-medium">
                {category.type ?? 'BOARD'}
              </p>
              <h1 className="text-default-label mt-2 truncate text-3xl font-semibold">
                {category.name}
              </h1>
              {category.description ? (
                <p className="text-default-secondary-label mt-3 text-base leading-7">
                  {category.description}
                </p>
              ) : null}
            </div>
            <ViewSwitcher search={search} scheduleView={scheduleView} viewType={viewType} />
          </div>
          <div className="border-default-separator/70 bg-default-fill/40 flex flex-col gap-3 border-t px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                className={`${controlClassName} bg-default-surface text-default-secondary-label hover:bg-default-gray-6 hover:text-default-label`}
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
                className={`${controlClassName} bg-default-blue font-semibold text-white hover:brightness-95`}
                href={`/articles/new?categoryId=${encodeURIComponent(search.categoryId)}&categoryType=${encodeURIComponent(search.categoryType ?? category.type ?? 'BOARD')}`}
              >
                <Pencil className="size-4" />
                글쓰기
              </Link>
            </div>
          </div>
        </header>

        <SearchForm search={search} />

        {scheduleView === 'CALENDAR' ? (
          <ScheduleCalendar categoryId={search.categoryId} query={search.keyWord} />
        ) : viewType === 'CARD' ? (
          <ArticleFeed fixedArticles={fixedArticles} initialPage={page} search={search} />
        ) : (
          <ArticleTimeline fixedArticles={fixedArticles} page={page} viewType={viewType} />
        )}

        {viewType === 'TABLE' ? <Pagination page={page} search={search} /> : null}
      </div>
    </main>
  );
}
