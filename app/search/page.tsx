'use client';

import { Suspense, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Search } from 'lucide-react';
import { useSiteContext } from '@/app/site-context-provider';
import { SearchEmptyState, SearchErrorState, SearchLoadingState } from '@/components/search/search-empty-state';

type SearchResponse = {
  keyword: string;
  categories?: { id: string; name: string; description?: string | null; url?: string | null }[] | null;
  articles?: { id: string; title: string; preview?: string | null; url?: string | null }[] | null;
};

function normalizeSearchResponse(response: Partial<SearchResponse> | null | undefined): SearchResponse {
  return {
    keyword: response?.keyword ?? '',
    categories: Array.isArray(response?.categories) ? response.categories : [],
    articles: Array.isArray(response?.articles) ? response.articles : []
  };
}

function SearchPageContent() {
  const params = useSearchParams();
  const { SITE_CONTEXT } = useSiteContext();
  const keyword = params.get('keyword')?.trim() ?? '';
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!keyword || !SITE_CONTEXT.id) {
      setLoading(false);
      setResult(null);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetch(`/api/search?${new URLSearchParams({ siteId: SITE_CONTEXT.id, keyword, limit: '20' })}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('검색 결과를 불러오지 못했습니다.');
        }
        return response.json() as Promise<Partial<SearchResponse>>;
      })
      .then(normalizeSearchResponse)
      .then(setResult)
      .catch((fetchError: unknown) => {
        if (!(fetchError instanceof DOMException && fetchError.name === 'AbortError')) {
          setResult(null);
          setError(true);
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [SITE_CONTEXT.id, keyword]);

  return (
    <div className="bg-default-surface-grouped min-h-full px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-default-tertiary-label hover:text-default-label inline-flex items-center gap-2 text-sm transition"><ArrowLeft size={16} aria-hidden /> 돌아가기</Link>
        <header className="border-default-separator mt-8 border-b pb-6"><p className="text-default-tertiary-label text-xs font-semibold tracking-[0.2em] uppercase">Search</p><h1 className="text-default-label mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{keyword ? `“${keyword}” 검색 결과` : '통합검색'}</h1><p className="text-default-secondary-label mt-3 text-sm">{keyword ? '카테고리와 게시글에서 검색어를 찾았습니다.' : '찾고 싶은 콘텐츠를 검색해보세요.'}</p></header>
        {loading ? <SearchLoadingState /> : null}
        {!loading && !keyword ? <SearchEmptyState title="검색어를 입력해주세요" description="상단 검색창에서 키워드를 입력하면 카테고리와 게시글을 함께 찾아드립니다." /> : null}
        {!loading && error ? <SearchErrorState /> : null}
        {!loading && !error && result ? <div className="py-8"><div className="text-default-tertiary-label mb-4 text-xs">전체 { (result.categories?.length ?? 0) + (result.articles?.length ?? 0) }건</div><div className="grid gap-5 md:grid-cols-2"><SearchResultGroup title="카테고리" count={result.categories?.length ?? 0}>{result.categories?.length ? <ul className="divide-default-separator divide-y">{result.categories.map((item) => <li key={item.id}><Link href={item.url || '#'} className="hover:bg-default-fill group block py-4 transition"><span className="text-default-label block font-medium">{item.name || '이름 없는 카테고리'}</span><span className="text-default-secondary-label mt-1 block text-sm">{item.description || '카테고리'}</span><ArrowUpRight size={15} className="text-default-tertiary-label mt-3 transition group-hover:translate-x-0.5" aria-hidden /></Link></li>)}</ul> : <SearchEmptyState compact title="카테고리 결과가 없습니다" description="검색어와 일치하는 카테고리를 찾지 못했습니다." />}</SearchResultGroup><SearchResultGroup title="게시글" count={result.articles?.length ?? 0}>{result.articles?.length ? <ul className="divide-default-separator divide-y">{result.articles.map((item) => <li key={item.id}><Link href={item.url || '#'} className="hover:bg-default-fill group block py-4 transition"><span className="text-default-label block font-medium">{item.title || '제목 없는 게시글'}</span><span className="text-default-secondary-label mt-1 block line-clamp-2 text-sm leading-6">{item.preview || '본문 미리보기 없음'}</span><ArrowUpRight size={15} className="text-default-tertiary-label mt-3 transition group-hover:translate-x-0.5" aria-hidden /></Link></li>)}</ul> : <SearchEmptyState compact title="게시글 결과가 없습니다" description="검색어와 일치하는 게시글을 찾지 못했습니다." />}</SearchResultGroup></div></div> : null}
      </div>
    </div>
  );
}

function SearchResultGroup({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return <section className="border-default-separator bg-default-surface border p-5 sm:p-7"><div className="border-default-separator flex items-center justify-between border-b pb-4"><h2 className="text-default-label flex items-center gap-2 font-semibold"><Search size={16} aria-hidden />{title}</h2><span className="text-default-tertiary-label text-xs">{count}건</span></div><div className="mt-2">{children}</div></section>;
}

export default function SearchPage() {
  return <Suspense fallback={<div className="p-8 text-sm">검색 결과를 불러오는 중입니다.</div>}><SearchPageContent /></Suspense>;
}
