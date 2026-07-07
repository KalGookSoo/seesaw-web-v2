import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
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

import type {
  ArticleResponse,
  CategoryResponse,
  PagedModel
} from '@/types/site';
import type { ArticleViewType, SearchArticlesParams } from '@/lib/articles';
import { toArticleHref } from '@/lib/articles';
import { toAttachmentUrl } from '@/lib/home-summary';

type ArticlePageContentProps = Readonly<{
  category: CategoryResponse;
  fixedArticles: readonly ArticleResponse[];
  page: PagedModel<ArticleResponse>;
  search: SearchArticlesParams;
  viewType: ArticleViewType;
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
  viewType
}: Readonly<{ search: SearchArticlesParams; viewType: ArticleViewType }>) {
  return (
    <div className="bg-default-fill grid grid-cols-2 gap-1 rounded-lg p-1 shadow-[inset_0_1px_2px_rgb(0_0_0_/_0.08)]">
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
        카드
      </Link>
    </div>
  );
}

function SearchForm({ search }: Readonly<{ search: SearchArticlesParams }>) {
  return (
    <form
      action="/articles"
      className={`${mattePanelClassName} grid gap-2 p-2 sm:grid-cols-[10rem_1fr_auto]`}
    >
      <input name="categoryId" type="hidden" value={search.categoryId} />
      {search.categoryType ? (
        <input name="categoryType" type="hidden" value={search.categoryType} />
      ) : null}
      <input name="viewType" type="hidden" value={search.viewType ?? 'TABLE'} />
      <select
        className="bg-default-fill text-default-label focus:ring-default-blue/10 h-10 rounded-md border-0 px-3 text-sm transition outline-none focus:ring-4"
        name="keyField"
        defaultValue={search.keyField ?? 'title'}
        aria-label="검색 필드"
      >
        <option value="title">제목</option>
        <option value="content">내용</option>
        <option value="createdBy">작성자</option>
      </select>
      <input
        className="bg-default-fill text-default-label focus:ring-default-blue/10 h-10 rounded-md border-0 px-3 text-sm transition outline-none focus:ring-4"
        name="keyWord"
        type="search"
        defaultValue={search.keyWord ?? ''}
        placeholder="검색어"
        aria-label="검색어"
      />
      <button
        className={`${controlClassName} bg-default-blue px-4 font-semibold text-white hover:brightness-95`}
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

function TableArticleRow({
  article,
  indexLabel,
  pinned
}: Readonly<{
  article: ArticleResponse;
  indexLabel: string;
  pinned?: boolean;
}>) {
  return (
    <li className="border-default-separator/70 hover:bg-default-fill/60 grid grid-cols-[2.5rem_1fr] gap-3 border-b px-3 py-3 transition last:border-b-0 sm:px-4">
      <div className="flex items-start justify-center pt-0.5">
        {pinned ? (
          <span className="bg-default-orange-soft text-default-orange-contrast inline-flex size-7 items-center justify-center rounded-md shadow-[inset_0_1px_0_rgb(255_255_255_/_0.3)]">
            <Pin className="size-3.5" />
          </span>
        ) : (
          <span className="bg-default-fill text-default-tertiary-label inline-flex min-w-7 justify-center rounded-md px-1.5 py-1 text-xs font-semibold">
            {indexLabel}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <Link
          className="text-default-label hover:text-default-blue inline-flex max-w-full items-center gap-2 text-sm font-medium"
          href={toArticleHref(article)}
        >
          <span className="truncate">{article.title}</span>
          {isRecentlyGenerated(article.createdDate) ? (
            <span className="bg-default-blue-soft text-default-blue-contrast rounded-full px-2 py-0.5 text-[0.625rem] font-bold">
              NEW
            </span>
          ) : null}
        </Link>
        <ArticleMeta article={article} />
      </div>
    </li>
  );
}

function ArticleTable({
  fixedArticles,
  page
}: Readonly<{
  fixedArticles: readonly ArticleResponse[];
  page: PagedModel<ArticleResponse>;
}>) {
  const articles = page.content.filter((article) => !article.fixed);
  const pageNumber = page.page?.number ?? 0;
  const pageSize = page.page?.size ?? articles.length;
  const totalElements = page.page?.totalElements ?? articles.length;

  if (fixedArticles.length === 0 && articles.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className={`${mattePanelClassName} overflow-hidden`}>
      <header className="border-default-separator/70 bg-default-fill/55 flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-default-label text-sm font-medium">게시글</h2>
        <span className="text-default-tertiary-label text-xs">
          총 {page.page?.totalElements ?? page.content.length}개
        </span>
      </header>
      <ul>
        {fixedArticles.map((article) => (
          <TableArticleRow
            key={article.id}
            article={article}
            indexLabel="공지"
            pinned
          />
        ))}
        {articles.map((article, index) => (
          <TableArticleRow
            key={article.id}
            article={article}
            indexLabel={String(
              Math.max(totalElements - pageNumber * pageSize - index, 1)
            )}
          />
        ))}
      </ul>
    </section>
  );
}

function ArticleCard({ article }: Readonly<{ article: ArticleResponse }>) {
  const thumbnail = article.inlineImages?.[0];
  const content = article.plainContent ?? toPlainText(article.content);

  return (
    <Link
      className={`${mattePanelClassName} hover:border-default-blue-muted group hover:bg-default-surface flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5`}
      href={toArticleHref(article)}
    >
      {thumbnail ? (
        <img
          className="aspect-video w-full object-cover"
          src={toAttachmentUrl(thumbnail.id)}
          alt={thumbnail.originalName ?? article.title}
        />
      ) : (
        <div className="bg-default-fill text-default-tertiary-label flex aspect-video w-full items-center justify-center text-sm font-medium">
          <Inbox className="size-7" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <h2 className="text-default-label group-hover:text-default-blue line-clamp-2 text-base font-medium">
          {article.title}
        </h2>
        <p className="text-default-secondary-label mt-3 line-clamp-3 flex-1 text-sm leading-6">
          {content || '본문 미리보기가 없습니다.'}
        </p>
        <ArticleMeta article={article} />
      </div>
    </Link>
  );
}

function ArticleCards({
  page
}: Readonly<{ page: PagedModel<ArticleResponse> }>) {
  if (page.content.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {page.content.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
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
    <main className="bg-default-surface-grouped min-h-full px-4 py-6 sm:px-6">
      <header
        className={`${mattePanelClassName} mx-auto mb-5 max-w-4xl px-5 py-5`}
      >
        <p className="text-default-secondary-label text-sm font-medium">
          Static content
        </p>
        <h1 className="text-default-label mt-2 text-3xl font-semibold">
          {category.name}
        </h1>
        {category.description ? (
          <p className="text-default-secondary-label mt-3 text-base leading-7">
            {category.description}
          </p>
        ) : null}
      </header>
      <section className="mx-auto max-w-4xl space-y-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <article
              key={article.id}
              className={`${mattePanelClassName} text-default-label max-w-none p-5`}
              dangerouslySetInnerHTML={{ __html: article.content ?? '' }}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </section>
    </main>
  );
}

export function ArticlePageContent({
  category,
  fixedArticles,
  page,
  search,
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
            <ViewSwitcher search={search} viewType={viewType} />
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

        {viewType === 'CARD' ? (
          <ArticleCards page={page} />
        ) : (
          <ArticleTable fixedArticles={fixedArticles} page={page} />
        )}

        <Pagination page={page} search={search} />
      </div>
    </main>
  );
}
