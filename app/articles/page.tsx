import { notFound } from 'next/navigation';

import type { CategoryResponse } from '@/types/site';
import { APPLICATION_NAME } from '@/lib/application-constants';
import { fetchArticles, fetchFixedArticles, fetchStaticContentArticles } from '@/lib/articles';
import type { ArticleViewType, SearchArticlesParams } from '@/lib/articles';
import { getSiteContext } from '@/lib/site';
import { ArticlePageContent, StaticContentPage } from '@/components/articles/article-page-content';

type ArticlesPageProps = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

function getSearchParam(searchParams: Record<string, string | string[] | undefined>, key: string): string | undefined {
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

function findCategory(categories: readonly CategoryResponse[], categoryId: string): CategoryResponse | null {
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

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
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

  const categoryType = getSearchParam(resolvedSearchParams, 'categoryType') ?? category.type ?? 'BOARD';

  if (categoryType === 'STATIC_CONTENT') {
    const articles = await fetchStaticContentArticles(categoryId);
    return <StaticContentPage articles={articles} category={category} />;
  }

  const viewType = toViewType(getSearchParam(resolvedSearchParams, 'viewType'));
  const search: SearchArticlesParams = {
    categoryId,
    categoryType,
    keyField: getSearchParam(resolvedSearchParams, 'keyField'),
    keyWord: getSearchParam(resolvedSearchParams, 'keyWord'),
    page: toPage(getSearchParam(resolvedSearchParams, 'page')),
    size: viewType === 'CARD' ? 9 : 8,
    viewType
  };
  const [page, fixedArticles] = await Promise.all([
    fetchArticles(search),
    viewType === 'TABLE' ? fetchFixedArticles(categoryId) : Promise.resolve([])
  ]);

  return <ArticlePageContent category={category} fixedArticles={fixedArticles} page={page} search={search} viewType={viewType} />;
}
