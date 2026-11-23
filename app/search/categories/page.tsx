import type { Metadata } from 'next';

import { APPLICATION_NAME } from '@/lib/application-constants';
import { getSiteContext } from '@/lib/site';
import { renderSearchScopePage } from '@/components/search/search-scope-page';

const domainName = `${APPLICATION_NAME}.seesaw.me.kr`;

function getParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const params = await searchParams;
  const keyword = getParam(params.keyword).trim();
  const page = Math.max(1, Number.parseInt(getParam(params.page) || '1', 10) || 1);
  return { title: keyword ? `“${keyword}” 카테고리 검색` : '카테고리 검색', robots: { index: false, follow: true }, alternates: keyword ? { canonical: `/search/categories?${new URLSearchParams({ keyword, page: String(page) }).toString()}` } : undefined };
}

export default async function CategorySearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const keyword = getParam(params.keyword).trim();
  const page = Math.max(1, Number.parseInt(getParam(params.page) || '1', 10) || 1);
  const site = await getSiteContext(domainName);
  return keyword ? renderSearchScopePage('categories', site.id, keyword, page) : renderSearchScopePage('categories', site.id, '', 1);
}
