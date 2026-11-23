'use client';

import { Suspense, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Search } from 'lucide-react';

type SearchResponse = {
  keyword: string;
  categories: { id: string; name: string; description?: string | null; url: string }[];
  articles: { id: string; title: string; preview?: string | null; url: string }[];
};

function SearchPageContent() {
  const params = useSearchParams();
  const keyword = params.get('keyword')?.trim() ?? '';
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!keyword) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/search?${new URLSearchParams({ keyword, limit: '20' })}`, { signal: controller.signal })
      .then((response) => response.json() as Promise<SearchResponse>)
      .then(setResult)
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [keyword]);

  return (
    <div className="bg-default-surface-grouped min-h-full px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-default-tertiary-label hover:text-default-label inline-flex items-center gap-2 text-sm transition"><ArrowLeft size={16} aria-hidden /> 돌아가기</Link>
        <header className="border-default-separator mt-8 border-b pb-6"><p className="text-default-tertiary-label text-xs font-semibold tracking-[0.2em] uppercase">Search</p><h1 className="text-default-label mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">“{keyword}” 검색 결과</h1></header>
        {loading ? <p className="text-default-secondary-label py-16 text-sm">검색 결과를 불러오는 중입니다.</p> : null}
        {!loading && !keyword ? <p className="text-default-secondary-label py-16 text-sm">검색어를 입력해주세요.</p> : null}
        {!loading && result ? <div className="grid gap-10 py-8 md:grid-cols-2"><SearchResultGroup title="카테고리" count={result.categories.length}><ul className="divide-default-separator divide-y">{result.categories.map((item) => <li key={item.id}><Link href={item.url} className="hover:bg-default-fill group block py-4 transition"><span className="text-default-label block font-medium">{item.name}</span><span className="text-default-secondary-label mt-1 block text-sm">{item.description || '카테고리'}</span><ArrowUpRight size={15} className="text-default-tertiary-label mt-3 transition group-hover:translate-x-0.5" aria-hidden /></Link></li>)}</ul></SearchResultGroup><SearchResultGroup title="게시글" count={result.articles.length}><ul className="divide-default-separator divide-y">{result.articles.map((item) => <li key={item.id}><Link href={item.url} className="hover:bg-default-fill group block py-4 transition"><span className="text-default-label block font-medium">{item.title}</span><span className="text-default-secondary-label mt-1 block line-clamp-2 text-sm leading-6">{item.preview || '본문 미리보기 없음'}</span><ArrowUpRight size={15} className="text-default-tertiary-label mt-3 transition group-hover:translate-x-0.5" aria-hidden /></Link></li>)}</ul></SearchResultGroup></div> : null}
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
