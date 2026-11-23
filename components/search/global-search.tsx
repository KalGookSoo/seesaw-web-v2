'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowUpRight, X } from 'lucide-react';

type SearchCategory = {
  id: string;
  name: string;
  description?: string | null;
  url: string;
};

type SearchArticle = {
  id: string;
  title: string;
  preview?: string | null;
  url: string;
};

type SearchResponse = {
  keyword: string;
  categories?: SearchCategory[] | null;
  articles?: SearchArticle[] | null;
};

function normalizeSearchResponse(response: Partial<SearchResponse> | null | undefined): SearchResponse {
  return {
    keyword: response?.keyword ?? '',
    categories: Array.isArray(response?.categories) ? response.categories : [],
    articles: Array.isArray(response?.articles) ? response.articles : []
  };
}

function buildSearchUrl(keyword: string, limit = 5): string {
  return `/api/search?${new URLSearchParams({ keyword, limit: String(limit) })}`;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const normalizedKeyword = keyword.trim();
    if (!normalizedKeyword) {
      setResult(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true);
      fetch(buildSearchUrl(normalizedKeyword), {
        headers: { Accept: 'application/json' },
        signal: controller.signal
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error('검색 결과를 불러오지 못했습니다.');
          }
          return normalizeSearchResponse(await response.json() as Partial<SearchResponse>);
        })
        .then(setResult)
        .catch((error: unknown) => {
          if (!(error instanceof DOMException && error.name === 'AbortError')) {
            setResult(null);
          }
        })
        .finally(() => setLoading(false));
    }, 220);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [keyword]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedKeyword = keyword.trim();
    if (normalizedKeyword) {
      window.location.href = `/search?keyword=${encodeURIComponent(normalizedKeyword)}`;
    }
  };

  const close = () => {
    setOpen(false);
    setKeyword('');
    setResult(null);
  };

  const resultPanel = open && keyword.trim() ? (
    <div className="border-default-separator bg-default-surface absolute inset-x-0 top-full z-50 mt-2 max-h-[min(32rem,70vh)] overflow-y-auto border p-3 shadow-2xl sm:w-[min(30rem,calc(100vw-2rem))] sm:left-auto">
      {loading ? <p className="text-default-tertiary-label px-3 py-5 text-sm">검색 중…</p> : null}
      {!loading && result && result.categories.length === 0 && result.articles.length === 0 ? (
        <p className="text-default-tertiary-label px-3 py-5 text-sm">검색 결과가 없습니다.</p>
      ) : null}
      {result?.categories?.length ? (
        <section aria-labelledby="global-search-categories">
          <h2 id="global-search-categories" className="text-default-tertiary-label px-3 pb-2 text-[0.65rem] font-semibold tracking-[0.16em] uppercase">카테고리</h2>
          {result.categories.map((category) => <Link key={category.id} href={category.url || '#'} onClick={close} className="hover:bg-default-fill block px-3 py-2 transition"><span className="text-default-label block text-sm font-medium">{category.name || '이름 없는 카테고리'}</span><span className="text-default-tertiary-label block truncate text-xs">{category.description || '카테고리'}</span></Link>)}
        </section>
      ) : null}
      {result?.articles?.length ? (
        <section aria-labelledby="global-search-articles" className="border-default-separator mt-3 border-t pt-3">
          <h2 id="global-search-articles" className="text-default-tertiary-label px-3 pb-2 text-[0.65rem] font-semibold tracking-[0.16em] uppercase">게시글</h2>
          {result.articles.map((article) => <Link key={article.id} href={article.url || '#'} onClick={close} className="hover:bg-default-fill block px-3 py-2 transition"><span className="text-default-label block text-sm font-medium">{article.title || '제목 없는 게시글'}</span><span className="text-default-tertiary-label block truncate text-xs">{article.preview || '본문 미리보기 없음'}</span></Link>)}
        </section>
      ) : null}
      <Link href={`/search?keyword=${encodeURIComponent(keyword.trim())}`} onClick={close} className="border-default-separator text-default-secondary-label hover:text-default-label mt-3 flex items-center justify-between border-t px-3 pt-3 text-xs transition"><span>전체 결과 보기</span><ArrowUpRight size={14} aria-hidden /></Link>
    </div>
  ) : null;

  return (
    <div className="relative shrink-0">
      <button className="border-default-separator bg-default-surface text-default-secondary-label hover:bg-default-fill hover:text-default-label inline-flex size-10 items-center justify-center rounded-full border transition sm:hidden" type="button" aria-label="통합 검색 열기" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        {open ? <X size={18} aria-hidden /> : <Search size={18} aria-hidden />}
      </button>
      <form onSubmit={submit} className={`${open ? 'flex' : 'hidden'} border-default-separator bg-default-surface absolute right-0 top-full z-40 mt-2 w-[min(20rem,calc(100vw-2rem))] items-center gap-2 border p-2 shadow-xl sm:static sm:mt-0 sm:flex sm:w-[min(26rem,32vw)] sm:border-0 sm:p-0 sm:shadow-none`}>
        <Search size={16} className="text-default-tertiary-label shrink-0" aria-hidden />
        <input ref={inputRef} value={keyword} onChange={(event) => setKeyword(event.target.value)} className="text-default-label placeholder:text-default-tertiary-label focus:border-default-label min-w-0 flex-1 border-b border-transparent bg-transparent px-1 py-2 text-sm outline-none transition" placeholder="콘텐츠 검색" aria-label="통합 검색어" />
        <button className="bg-default-label text-default-background hover:bg-default-secondary-label inline-flex h-8 shrink-0 items-center justify-center px-3 text-xs font-semibold transition" type="submit">검색</button>
      </form>
      {resultPanel}
    </div>
  );
}
