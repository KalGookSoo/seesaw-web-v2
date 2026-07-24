import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Eye,
  List,
  UserRound
} from 'lucide-react';

import type {
  ArticleResponse,
  SearchArticleDetailRequest
} from '@/types/article';
import type { CategoryResponse } from '@/types/category';
import {
  APPLICATION_API_BASE_URL,
  APPLICATION_NAME
} from '@/lib/application-constants';
import { fetchArticleDetail, toArticleDetailHref } from '@/lib/articles';
import { getSiteContext } from '@/lib/site';
import {
  ArticleManagementActions,
  ArticleReplies
} from '@/components/articles/article-detail-actions';
import { ArticleViewer } from '@/components/articles/article-viewer';
import { AttachmentList } from '@/components/attachments/attachment-list';

type ArticleDetailPageProps = Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

const panelClassName =
  'border-default-separator bg-default-surface overflow-hidden rounded-xl border shadow-[0_1px_2px_rgb(0_0_0_/_0.05)]';
const navigationButtonClassName =
  'border-default-separator bg-default-surface text-default-secondary-label hover:border-default-blue-muted hover:text-default-blue inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition';
const domainName = `${APPLICATION_NAME}.seesaw.me.kr`;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toDetailSearch(
  searchParams: Record<string, string | string[] | undefined>
): SearchArticleDetailRequest {
  const categoryType = firstValue(searchParams.categoryType);

  return {
    categoryId: firstValue(searchParams.categoryId),
    categoryType:
      categoryType === 'NONE' ||
      categoryType === 'STATIC_CONTENT' ||
      categoryType === 'BOARD' ||
      categoryType === 'QNA' ||
      categoryType === 'SCHEDULE' ||
      categoryType === 'STORE' ||
      categoryType === 'BUSINESS'
        ? categoryType
        : undefined,
    keyField: firstValue(searchParams.keyField),
    keyWord: firstValue(searchParams.keyWord)
  };
}

function findCategory(
  categories: readonly CategoryResponse[],
  categoryId: string | null | undefined
): CategoryResponse | null {
  if (!categoryId) {
    return null;
  }

  for (const category of categories) {
    if (category.id === categoryId) {
      return category;
    }

    const child = findCategory(category.children ?? [], categoryId);
    if (child) {
      return child;
    }
  }

  return null;
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

function buildListHref(
  searchParams: Record<string, string | string[] | undefined>,
  fallbackCategoryId: string | null | undefined
): string {
  const params = new URLSearchParams();
  const keys = [
    'categoryId',
    'categoryType',
    'viewType',
    'keyField',
    'keyWord',
    'page'
  ] as const;

  for (const key of keys) {
    const value = firstValue(searchParams[key]);
    if (value) {
      params.set(key, value);
    }
  }

  if (!params.has('categoryId') && fallbackCategoryId) {
    params.set('categoryId', fallbackCategoryId);
  }

  return `/articles?${params.toString()}`;
}

function toDescription(article: ArticleResponse): string {
  return (
    article.plainContent ??
    article.content
      ?.replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() ??
    ''
  ).slice(0, 160);
}

function ArticleDetailError({
  listHref,
  message,
  status
}: Readonly<{
  listHref: string;
  message: string;
  status: number;
}>) {
  const contentByStatus: Readonly<
    Record<number, { eyebrow: string; title: string; description: string }>
  > = {
    400: {
      eyebrow: '잘못된 요청',
      title: '게시글 요청을 확인해 주세요.',
      description:
        '게시글 주소나 검색 조건이 올바르지 않습니다. 목록에서 게시글을 다시 선택해 주세요.'
    },
    401: {
      eyebrow: '로그인 필요',
      title: '로그인 후 읽을 수 있는 게시글입니다.',
      description:
        '로그인한 뒤 이전 페이지로 돌아오면 게시글 내용을 계속 확인할 수 있습니다.'
    },
    403: {
      eyebrow: '접근 제한',
      title: '이 게시글을 읽을 권한이 없습니다.',
      description:
        '해당 카테고리에 접근할 수 있는 계정인지 확인하거나 사이트 관리자에게 문의해 주세요.'
    },
    404: {
      eyebrow: '게시글 없음',
      title: '게시글을 찾을 수 없습니다.',
      description:
        '삭제되었거나 주소가 변경된 게시글일 수 있습니다. 목록에서 다른 게시글을 확인해 주세요.'
    }
  };
  const content = contentByStatus[status] ?? {
    eyebrow: '일시적인 오류',
    title: '게시글을 불러오지 못했습니다.',
    description:
      '잠시 후 다시 시도해 주세요. 문제가 계속되면 사이트 관리자에게 문의해 주세요.'
  };

  return (
    <main className="bg-default-surface-grouped text-default-label flex min-h-[60vh] items-center px-4 py-12 sm:px-6">
      <section
        className={`${panelClassName} mx-auto w-full max-w-xl p-7 sm:p-9`}
      >
        <div className="bg-default-orange-soft text-default-orange-contrast flex size-12 items-center justify-center rounded-xl">
          <CircleAlert aria-hidden className="size-6" />
        </div>
        <p className="text-default-orange mt-6 text-xs font-bold tracking-[0.18em] uppercase">
          {content.eyebrow} · {status}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-balance">
          {content.title}
        </h1>
        <p className="text-default-secondary-label mt-3 text-sm leading-6">
          {content.description}
        </p>
        {message && message !== content.description ? (
          <p className="bg-default-fill text-default-tertiary-label mt-4 rounded-lg px-4 py-3 text-xs">
            서버 응답: {message}
          </p>
        ) : null}
        <div className="mt-7 flex flex-wrap gap-2">
          {status === 401 ? (
            <a
              className="bg-default-blue inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold text-white transition hover:brightness-95"
              href="/oauth2/authorization/naver"
            >
              로그인
            </a>
          ) : null}
          <Link className={navigationButtonClassName} href={listHref}>
            <List aria-hidden className="size-4" />
            목록으로
          </Link>
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
  searchParams
}: ArticleDetailPageProps): Promise<Metadata> {
  const [{ id }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ]);

  try {
    const detail = await fetchArticleDetail(
      id,
      toDetailSearch(resolvedSearchParams)
    );
    const article = detail.ok ? detail.data.article : null;
    if (!article) {
      return {
        title:
          !detail.ok && detail.status === 401
            ? '로그인이 필요합니다.'
            : '게시글을 찾을 수 없습니다.'
      };
    }

    const description = toDescription(article);
    const image = article.inlineImages?.[0];
    const images = image
      ? [`${APPLICATION_API_BASE_URL}/attachments/${image.id}`]
      : undefined;

    return {
      title: article.title ?? '게시글 상세',
      description,
      keywords: firstValue(resolvedSearchParams.categoryType),
      openGraph: {
        type: 'article',
        title: article.title ?? '게시글 상세',
        description,
        images
      },
      twitter: {
        card: 'summary',
        title: article.title ?? '게시글 상세',
        description,
        images
      }
    };
  } catch {
    return { title: '게시글 상세' };
  }
}

export const dynamic = 'force-dynamic';

export default async function ArticleDetailPage({
  params,
  searchParams
}: ArticleDetailPageProps) {
  const [{ id }, resolvedSearchParams, site] = await Promise.all([
    params,
    searchParams,
    getSiteContext(domainName)
  ]);
  const search = toDetailSearch(resolvedSearchParams);
  const result = await fetchArticleDetail(id, search);
  const fallbackListHref = buildListHref(
    resolvedSearchParams,
    search.categoryId
  );

  if (result.ok === false) {
    return (
      <ArticleDetailError
        listHref={fallbackListHref}
        message={result.message}
        status={result.status}
      />
    );
  }

  const detail = result.data;
  const article = detail.article;

  if (!article) {
    notFound();
  }

  const categories = site.categories ?? [];
  const category =
    findCategory(categories, search.categoryId) ??
    findCategory(categories, article.categoryId);
  const navigationSearch: SearchArticleDetailRequest = {
    ...search,
    categoryId: search.categoryId ?? article.categoryId,
    categoryType: search.categoryType ?? category?.type
  };
  const listHref = buildListHref(
    resolvedSearchParams,
    navigationSearch.categoryId
  );
  const attachments = (article.attachments ?? []).filter(
    (attachment) => attachment.attachment !== false
  );

  return (
    <main className="bg-default-surface-grouped text-default-label min-h-full">
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <nav
          aria-label="현재 위치"
          className="text-default-tertiary-label flex flex-wrap items-center gap-2 text-sm"
        >
          <Link className="hover:text-default-blue transition" href="/">
            홈
          </Link>
          <ChevronRight aria-hidden className="size-3.5" />
          <Link className="hover:text-default-blue transition" href={listHref}>
            {category?.name ?? '게시글'}
          </Link>
          <ChevronRight aria-hidden className="size-3.5" />
          <span className="text-default-secondary-label max-w-64 truncate">
            {article.title}
          </span>
        </nav>

        <article className={panelClassName}>
          <header className="border-default-separator border-b px-5 py-6 sm:px-8 sm:py-8">
            <p className="text-default-blue text-xs font-bold tracking-[0.18em] uppercase">
              {category?.name ?? 'Article'}
            </p>
            <h1 className="mt-3 text-2xl leading-tight font-semibold text-balance sm:text-3xl">
              {article.title}
            </h1>
            <div className="text-default-tertiary-label mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <UserRound aria-hidden className="size-4" />
                {article.maskedAuthor ?? article.createdBy ?? '익명'}
              </span>
              <time
                className="inline-flex items-center gap-1.5"
                dateTime={article.createdDate ?? undefined}
              >
                <CalendarDays aria-hidden className="size-4" />
                {formatDate(article.createdDate)}
              </time>
              <span className="inline-flex items-center gap-1.5">
                <Eye aria-hidden className="size-4" />
                조회 {article.views?.length ?? 0}
              </span>
            </div>
          </header>

          <div className="px-5 py-8 sm:px-8 sm:py-10">
            {article.content ? (
              <ArticleViewer content={article.content} />
            ) : (
              <p className="text-default-tertiary-label py-10 text-center">
                표시할 본문이 없습니다.
              </p>
            )}
          </div>

          <AttachmentList articleId={article.id} attachments={attachments} />
        </article>

        <ArticleReplies article={article} />

        <footer className={`${panelClassName} p-4`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {detail.previousArticleId ? (
                <Link
                  className={navigationButtonClassName}
                  href={toArticleDetailHref(
                    detail.previousArticleId,
                    navigationSearch
                  )}
                >
                  <ChevronLeft aria-hidden className="size-4" />
                  이전 글
                </Link>
              ) : null}
              <Link className={navigationButtonClassName} href={listHref}>
                <List aria-hidden className="size-4" />
                목록
              </Link>
              {detail.nextArticleId ? (
                <Link
                  className={navigationButtonClassName}
                  href={toArticleDetailHref(
                    detail.nextArticleId,
                    navigationSearch
                  )}
                >
                  다음 글
                  <ChevronRight aria-hidden className="size-4" />
                </Link>
              ) : null}
            </div>

            <ArticleManagementActions
              article={article}
              categories={categories}
              listHref={listHref}
            />
          </div>
        </footer>
      </div>
    </main>
  );
}
