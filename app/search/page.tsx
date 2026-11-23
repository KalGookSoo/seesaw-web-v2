import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Search } from 'lucide-react';
import { decode } from 'entities';

import { APPLICATION_API_BASE_URL, APPLICATION_NAME } from '@/lib/application-constants';
import { getSiteContext } from '@/lib/site';
import { SearchEmptyState, SearchErrorState } from '@/components/search/search-empty-state';

const domainName = `${APPLICATION_NAME}.seesaw.me.kr`;
const PAGE_SIZE = 5;

type SearchType = 'categories' | 'articles' | undefined;
type SearchResponse = {
  keyword: string;
  categories?: { id: string; name: string; description?: string | null; url?: string | null }[] | null;
  articles?: { id: string; title: string; preview?: string | null; url?: string | null }[] | null;
  meta?: { page: number; limit: number; categoryTotalCount: number; articleTotalCount: number; categoryHasMore: boolean; articleHasMore: boolean } | null;
};

function getParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function toPlainText(value: string | null | undefined): string {
  if (!value) return '';
  return decode(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildSearchHref(keyword: string, type?: SearchType, page = 0): string {
  if (type) {
    return `/search/${type}?${new URLSearchParams({ keyword, page: String(page + 1) }).toString()}`;
  }
  const params = new URLSearchParams({ keyword });
  if (page > 0) params.set('page', String(page));
  return `/search?${params.toString()}`;
}

async function search(siteId: string, keyword: string, page: number): Promise<SearchResponse | null> {
  try {
    const params = new URLSearchParams({ siteId, keyword, page: String(page), limit: String(PAGE_SIZE) });
    const response = await fetch(`${APPLICATION_API_BASE_URL}/search?${params.toString()}`, { headers: { Accept: 'application/json' }, cache: 'no-store' });
    if (!response.ok) return null;
    return response.json() as Promise<SearchResponse>;
  } catch {
    return null;
  }
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const keyword = getParam((await searchParams).keyword).trim();
  return {
    title: keyword ? `“${keyword}” 검색 결과` : '통합검색',
    robots: { index: false, follow: true },
    alternates: keyword ? { canonical: `/search?${new URLSearchParams({ keyword }).toString()}` } : undefined
  };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const keyword = getParam(params.keyword).trim();
  const type = getParam(params.type) as SearchType;
  const page = Math.max(0, Number.parseInt(getParam(params.page) || '0', 10) || 0);
  const site = await getSiteContext(domainName);
  const result = keyword ? await search(site.id, keyword, page) : null;
  const categories = type === 'articles' ? [] : result?.categories ?? [];
  const articles = type === 'categories' ? [] : result?.articles ?? [];
  const meta = result?.meta;

  return (
    <div className="bg-default-surface-grouped min-h-full px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-default-tertiary-label hover:text-default-label inline-flex items-center gap-2 text-sm transition"><ArrowLeft size={16} aria-hidden /> 돌아가기</Link>
        <header className="border-default-separator mt-8 border-b pb-6"><p className="text-default-tertiary-label text-xs font-semibold tracking-[0.2em] uppercase">Search</p><h2 className="text-default-label mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{keyword ? `“${keyword}” 검색 결과` : '통합검색'}</h2><p className="text-default-secondary-label mt-3 text-sm">{keyword ? '카테고리와 게시글에서 검색어를 찾았습니다.' : '찾고 싶은 콘텐츠를 검색해보세요.'}</p></header>
        {!keyword ? <div className="py-8"><SearchEmptyState title="검색어를 입력해주세요" description="상단 검색창에서 키워드를 입력하면 카테고리와 게시글을 함께 찾아드립니다." /></div> : null}
        {keyword && !result ? <div className="py-8"><SearchErrorState /></div> : null}
        {keyword && result ? <div className="py-8"><div className="text-default-tertiary-label mb-4 text-xs">각 그룹 최대 {PAGE_SIZE}건 · 전체 카테고리 {meta?.categoryTotalCount ?? 0}건 · 전체 게시글 {meta?.articleTotalCount ?? 0}건</div><div className="grid gap-5 md:grid-cols-2"><SearchResultGroup title="카테고리" count={meta?.categoryTotalCount ?? categories.length} hasMore={meta?.categoryHasMore ?? false} moreHref={buildSearchHref(keyword, 'categories', page)}>{categories.length ? <ul className="divide-default-separator divide-y">{categories.map((item) => <li key={item.id}><Link href={item.url || '#'} className="hover:bg-default-fill group block py-4 transition"><span className="text-default-label block font-medium">{item.name || '이름 없는 카테고리'}</span><span className="text-default-secondary-label mt-1 block text-sm">{item.description || '카테고리'}</span><ArrowUpRight size={15} className="text-default-tertiary-label mt-3 transition group-hover:translate-x-0.5" aria-hidden /></Link></li>)}</ul> : <SearchEmptyState compact title="카테고리 결과가 없습니다" description="검색어와 일치하는 카테고리를 찾지 못했습니다." />}</SearchResultGroup><SearchResultGroup title="게시글" count={meta?.articleTotalCount ?? articles.length} hasMore={meta?.articleHasMore ?? false} moreHref={buildSearchHref(keyword, 'articles', page)}>{articles.length ? <ul className="divide-default-separator divide-y">{articles.map((item) => <li key={item.id}><Link href={item.url || '#'} className="hover:bg-default-fill group block py-4 transition"><span className="text-default-label block font-medium">{item.title || '제목 없는 게시글'}</span><span className="text-default-secondary-label mt-1 block line-clamp-2 text-sm leading-6">{toPlainText(item.preview) || '본문 미리보기 없음'}</span><ArrowUpRight size={15} className="text-default-tertiary-label mt-3 transition group-hover:translate-x-0.5" aria-hidden /></Link></li>)}</ul> : <SearchEmptyState compact title="게시글 결과가 없습니다" description="검색어와 일치하는 게시글을 찾지 못했습니다." />}</SearchResultGroup></div></div> : null}
      </div>
    </div>
  );
}

function SearchResultGroup({ title, count, hasMore, moreHref, children }: { title: string; count: number; hasMore: boolean; moreHref: string; children: ReactNode }) {
  return <section className="border-default-separator bg-default-surface border p-5 sm:p-7"><div className="border-default-separator flex items-center justify-between border-b pb-4"><h2 className="text-default-label flex items-center gap-2 font-semibold"><Search size={16} aria-hidden />{title}</h2><span className="text-default-tertiary-label text-xs">{count}건{hasMore ? '+' : ''}</span></div><div className="mt-2">{children}</div>{hasMore ? <Link href={moreHref} className="border-default-separator text-default-secondary-label hover:text-default-label mt-3 flex items-center justify-between border-t pt-4 text-xs transition"><span>{title} 더 보기</span><ArrowUpRight size={14} aria-hidden /></Link> : null}</section>;
}
