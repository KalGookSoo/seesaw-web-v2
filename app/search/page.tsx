import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { decode } from 'entities';

import { APPLICATION_API_BASE_URL, APPLICATION_NAME } from '@/lib/application-constants';
import { getSiteContext } from '@/lib/site';
import { SearchEmptyState, SearchErrorState } from '@/components/search/search-empty-state';
import editorial from '@/app/style-guide/editorial/editorial.module.css';

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
    <div className={`${editorial.theme} min-h-full px-4 py-10 sm:px-8 lg:px-12`}>
      <main className="mx-auto max-w-5xl">
        <Link href="/" className={`${editorial.label} text-[var(--editorial-ink-muted)] hover:text-[var(--editorial-ink)] inline-flex items-center gap-2 transition`}><ArrowLeft size={16} aria-hidden /> 홈으로 돌아가기</Link>
        <header className="mt-8 border-b pb-8" style={{ borderColor: 'var(--editorial-line-soft)' }}>
          <p className={`${editorial.label} text-[var(--editorial-primary)]`}>Search · Index</p>
          <h1 className={`${editorial.display} mt-4 text-3xl sm:text-5xl`} style={{ lineHeight: 0.95 }}>{keyword ? `“${keyword}” 검색 결과` : '통합검색'}</h1>
          <p className={`${editorial.body} mt-4 text-base leading-7 text-[var(--editorial-ink-soft)]`}>{keyword ? '카테고리와 게시글에서 검색어를 찾았습니다.' : '찾고 싶은 콘텐츠를 검색해보세요.'}</p>
        </header>
        {!keyword ? <div className="py-8"><SearchEmptyState title="검색어를 입력해주세요" description="상단 검색창에서 키워드를 입력하면 카테고리와 게시글을 함께 찾아드립니다." /></div> : null}
        {keyword && !result ? <div className="py-8"><SearchErrorState /></div> : null}
        {keyword && result ? <div className="py-6 sm:py-8"><div className="mb-4 flex items-end justify-between gap-4 border-b pb-3" style={{ borderColor: 'var(--editorial-line-soft)' }}><p className={editorial.label}>Result index</p><span className={`${editorial.label} text-[var(--editorial-ink-muted)]`}>각 그룹 최대 {PAGE_SIZE}건 · 전체 {meta?.categoryTotalCount ?? 0}개 카테고리 · {meta?.articleTotalCount ?? 0}개 게시글</span></div><div className="grid gap-8 md:grid-cols-2"><SearchResultGroup title="카테고리" count={meta?.categoryTotalCount ?? categories.length} hasMore={meta?.categoryHasMore ?? false} moreHref={buildSearchHref(keyword, 'categories', page)}>{categories.length ? <ul className="border-y" style={{ borderColor: 'var(--editorial-line)' }}>{categories.map((item, index) => <li key={item.id}><Link href={item.url || '#'} className="group block border-b p-5 transition-[background-color,box-shadow,transform] last:border-b-0 hover:translate-x-0.5 hover:bg-[var(--editorial-surface-muted)] hover:shadow-[inset_3px_0_0_var(--editorial-primary)]" style={{ borderColor: 'var(--editorial-line)' }}><span className={`${editorial.label} text-[var(--editorial-ink-muted)] group-hover:text-[var(--editorial-primary)]`}>{String(index + 1).padStart(2, '0')}</span><span className="mt-6 block text-lg font-black tracking-tight">{item.name || '이름 없는 카테고리'}</span><span className={`${editorial.body} mt-2 block text-sm leading-6 text-[var(--editorial-ink-soft)]`}>{item.description || '카테고리'}</span></Link></li>)}</ul> : <SearchEmptyState compact title="카테고리 결과가 없습니다" description="검색어와 일치하는 카테고리를 찾지 못했습니다." />}</SearchResultGroup><SearchResultGroup title="게시글" count={meta?.articleTotalCount ?? articles.length} hasMore={meta?.articleHasMore ?? false} moreHref={buildSearchHref(keyword, 'articles', page)}>{articles.length ? <ul className="border-y" style={{ borderColor: 'var(--editorial-line)' }}>{articles.map((item, index) => <li key={item.id}><Link href={item.url || '#'} className="group block border-b p-5 transition-[background-color,box-shadow,transform] last:border-b-0 hover:translate-x-0.5 hover:bg-[var(--editorial-surface-muted)] hover:shadow-[inset_3px_0_0_var(--editorial-primary)]" style={{ borderColor: 'var(--editorial-line)' }}><span className={`${editorial.label} text-[var(--editorial-ink-muted)] group-hover:text-[var(--editorial-primary)]`}>{String(index + 1).padStart(2, '0')}</span><span className="mt-6 block text-lg font-black tracking-tight">{item.title || '제목 없는 게시글'}</span><span className={`${editorial.body} mt-2 block line-clamp-3 text-sm leading-6 text-[var(--editorial-ink-soft)]`}>{toPlainText(item.preview) || '본문 미리보기 없음'}</span></Link></li>)}</ul> : <SearchEmptyState compact title="게시글 결과가 없습니다" description="검색어와 일치하는 게시글을 찾지 못했습니다." />}</SearchResultGroup></div></div> : null}
      </main>
    </div>
  );
}

function SearchResultGroup({ title, count, hasMore, moreHref, children }: { title: string; count: number; hasMore: boolean; moreHref: string; children: ReactNode }) {
  return <section><header className="flex items-end justify-between gap-4 border-b pb-3" style={{ borderColor: 'var(--editorial-line-soft)' }}><h2 className={`${editorial.label} text-[var(--editorial-ink)]`}>{title}</h2><span className={`${editorial.label} text-[var(--editorial-ink-muted)]`}>{count}건{hasMore ? '+' : ''}</span></header><div className="mt-4">{children}</div>{hasMore ? <Link href={moreHref} className={`${editorial.label} text-[var(--editorial-ink-muted)] hover:text-[var(--editorial-ink)] mt-4 inline-flex items-center gap-2 transition`}>{title} 전체 보기 ↗</Link> : null}</section>;
}
