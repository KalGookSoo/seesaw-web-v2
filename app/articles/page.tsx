import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import type { CategoryResponse } from '@/types/category';
import { APPLICATION_NAME } from '@/lib/application-constants';
import {
  fetchArticles,
  fetchFixedArticles,
  fetchStaticContentArticles
} from '@/lib/articles';
import type {
  ArticleViewType,
  ScheduleViewType,
  SearchArticlesParams
} from '@/lib/articles';
import { getSiteContext } from '@/lib/site';
import {
  ArticlePageContent,
  StaticContentPage
} from '@/components/articles/article-page-content';

type ArticlesPageProps = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

function getSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function toPage(value: string | undefined): number {
  const page = Number(value ?? 0);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 0;
}

function toViewType(value: string | undefined): ArticleViewType {
  return value === 'CARD' ? 'CARD' : 'TABLE';
}

function toScheduleView(
  view: string | undefined,
  viewType: string | undefined
): ScheduleViewType {
  if (view === 'calendar') return 'CALENDAR';
  if (view === 'list') return 'TABLE';
  if (view === 'feed') return 'CARD';
  if (viewType === 'TABLE') return 'TABLE';
  if (viewType === 'CARD') return 'CARD';
  return 'CALENDAR';
}

function findCategory(
  categories: readonly CategoryResponse[],
  categoryId: string
): CategoryResponse | null {
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

const domainName = `${APPLICATION_NAME}.seesaw.me.kr`;

export async function generateMetadata({ searchParams }: ArticlesPageProps): Promise<Metadata> {
  const params = await searchParams;
  const categoryId = getSearchParam(params, 'categoryId');
  if (!categoryId) return { title: '게시판', robots: { index: false } };
  const site = await getSiteContext(domainName);
  const category = findCategory(site.categories ?? [], categoryId);
  if (!category) return { title: '카테고리를 찾을 수 없습니다', robots: { index: false } };

  const title = category.name?.trim() || '게시판';
  const description = category.description?.trim() || site.description?.trim() || undefined;
  const query = new URLSearchParams({ categoryType: category.type ?? 'BOARD', categoryId });
  const page = toPage(getSearchParam(params, 'page'));
  if (page > 0) query.set('page', String(page));
  const canonical = `/articles?${query}`;
  const filtered = Boolean(getSearchParam(params, 'keyWord')?.trim() || getSearchParam(params, 'keyField') === 'createdBy');
  return {
    title: page > 0 ? `${title} - ${page + 1}페이지` : title,
    description,
    robots: filtered || category.exposed === false || site.searchEngineExposed === false ? { index: false, follow: true } : undefined,
    alternates: { canonical },
    openGraph: { type: 'website', title, description, url: canonical, siteName: site.name ?? undefined }
  };
}

export default async function ArticlesPage({
  searchParams
}: ArticlesPageProps) {
  const resolvedSearchParams = await searchParams;
  const categoryId = getSearchParam(resolvedSearchParams, 'categoryId');

  if (!categoryId) {
    notFound();
  }

  const site = await getSiteContext(domainName);
  const category = findCategory(site.categories ?? [], categoryId);

  if (!category) {
    notFound();
  }

  const categoryType =
    getSearchParam(resolvedSearchParams, 'categoryType') ??
    category.type ??
    'BOARD';

  if (categoryType === 'STATIC_CONTENT') {
    const articles = await fetchStaticContentArticles(categoryId);
    return <StaticContentPage articles={articles} category={category} />;
  }

  const scheduleView =
    categoryType === 'SCHEDULE'
      ? toScheduleView(
          getSearchParam(resolvedSearchParams, 'view'),
          getSearchParam(resolvedSearchParams, 'viewType')
        )
      : undefined;
  const viewType = scheduleView === 'CARD'
    ? 'CARD'
    : scheduleView === 'CALENDAR'
      ? 'TABLE'
      : toViewType(getSearchParam(resolvedSearchParams, 'viewType'));
  const search: SearchArticlesParams = {
    categoryId,
    categoryType,
    keyField: getSearchParam(resolvedSearchParams, 'keyField'),
    keyWord: getSearchParam(resolvedSearchParams, 'keyWord'),
    page: toPage(getSearchParam(resolvedSearchParams, 'page')),
    size: viewType === 'CARD' ? 9 : 8,
    viewType,
    scheduleView
  };
  const [page, fixedArticles] = await Promise.all([
    fetchArticles(search),
    fetchFixedArticles(categoryId)
  ]);

  return (
    <ArticlePageContent
      category={category}
      fixedArticles={fixedArticles}
      page={page}
      search={search}
      scheduleView={scheduleView}
      viewType={viewType}
    />
  );
}
