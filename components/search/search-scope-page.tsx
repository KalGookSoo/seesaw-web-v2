import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { decode } from 'entities';

import { APPLICATION_API_BASE_URL } from '@/lib/application-constants';
import { SearchEmptyState, SearchErrorState } from '@/components/search/search-empty-state';

const PAGE_SIZE = 10;

type SearchScope = 'categories' | 'articles';
type SearchResponse = {
  keyword: string;
  categories?: { id: string; name: string; description?: string | null; url?: string | null }[] | null;
  articles?: { id: string; title: string; preview?: string | null; url?: string | null }[] | null;
  meta?: { page: number; limit: number; categoryTotalCount: number; articleTotalCount: number } | null;
};

function toPlainText(value: string | null | undefined): string {
  if (!value) return '';
  return decode(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildPageHref(scope: SearchScope, keyword: string, page: number): string {
  return `/search/${scope}?${new URLSearchParams({ keyword, page: String(page) }).toString()}`;
}

async function fetchSearch(siteId: string, keyword: string, page: number): Promise<SearchResponse | null> {
  try {
    const query = new URLSearchParams({ siteId, keyword, page: String(page - 1), limit: String(PAGE_SIZE) });
    const response = await fetch(`${APPLICATION_API_BASE_URL}/search?${query.toString()}`, { headers: { Accept: 'application/json' }, cache: 'no-store' });
    return response.ok ? (await response.json() as SearchResponse) : null;
  } catch {
    return null;
  }
}

export async function renderSearchScopePage(scope: SearchScope, siteId: string, keyword: string, page: number) {
  const result = keyword ? await fetchSearch(siteId, keyword, page) : null;
  const items = scope === 'categories' ? result?.categories ?? [] : result?.articles ?? [];
  const totalCount = scope === 'categories' ? result?.meta?.categoryTotalCount ?? 0 : result?.meta?.articleTotalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const title = scope === 'categories' ? '카테고리 전체 검색' : '게시글 전체 검색';

  return (
    <div className="bg-default-surface-grouped min-h-full px-4 py-10 sm:px-8 lg:px-12">
      <main className="mx-auto max-w-4xl">
        <Link href={`/search?keyword=${encodeURIComponent(keyword)}`} className="text-default-tertiary-label hover:text-default-label inline-flex items-center gap-2 text-sm transition"><ArrowLeft size={16} aria-hidden /> 통합검색 결과로 돌아가기</Link>
        <header className="border-default-separator mt-8 border-b pb-6"><p className="text-default-tertiary-label text-xs font-semibold tracking-[0.2em] uppercase">{scope}</p><h2 className="text-default-label mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">“{keyword}” {title}</h2><p className="text-default-secondary-label mt-3 text-sm">전체 {totalCount}건 · 페이지 {page} / {totalPages}</p></header>
        {!keyword ? <div className="py-8"><SearchEmptyState title="검색어를 입력해주세요" description="통합검색으로 돌아가 검색어를 입력하면 결과를 확인할 수 있습니다." /></div> : null}
        {keyword && !result ? <div className="py-8"><SearchErrorState /></div> : null}
        {result && items.length === 0 ? <div className="py-8"><SearchEmptyState title="검색 결과가 없습니다" description="다른 검색어로 다시 시도해보세요." /></div> : null}
        {result && items.length > 0 ? <>
          <ul className="divide-default-separator bg-default-surface mt-8 divide-y border px-5 sm:px-8">{scope === 'categories' ? items.map((item) => <li key={item.id}><Link href={item.url || '#'} className="hover:bg-default-fill group block py-5 transition"><span className="text-default-label block font-medium">{item.name || '이름 없는 카테고리'}</span><span className="text-default-secondary-label mt-1 block text-sm">{item.description || '카테고리'}</span><ArrowUpRight size={15} className="text-default-tertiary-label mt-3 transition group-hover:translate-x-0.5" aria-hidden /></Link></li>) : items.map((item) => <li key={item.id}><Link href={item.url || '#'} className="hover:bg-default-fill group block py-5 transition"><span className="text-default-label block font-medium">{item.title || '제목 없는 게시글'}</span><span className="text-default-secondary-label mt-1 block line-clamp-3 text-sm leading-6">{toPlainText(item.preview) || '본문 미리보기 없음'}</span><ArrowUpRight size={15} className="text-default-tertiary-label mt-3 transition group-hover:translate-x-0.5" aria-hidden /></Link></li>)}</ul>
          <nav aria-label="검색 결과 페이지 이동" className="mt-6 flex flex-wrap items-center justify-center gap-1"><PaginationLink href={page > 1 ? buildPageHref(scope, keyword, page - 1) : undefined} label="이전" />{Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <PaginationLink key={pageNumber} href={pageNumber === page ? undefined : buildPageHref(scope, keyword, pageNumber)} label={String(pageNumber)} active={pageNumber === page} />)}<PaginationLink href={page < totalPages ? buildPageHref(scope, keyword, page + 1) : undefined} label="다음" /></nav>
        </> : null}
      </main>
    </div>
  );
}

function PaginationLink({ href, label, active = false }: { href?: string; label: string; active?: boolean }) {
  const className = `inline-flex min-w-9 items-center justify-center border px-2 py-2 text-xs font-medium transition ${active ? 'bg-default-label text-default-background border-default-label' : 'border-default-separator text-default-secondary-label hover:bg-default-fill hover:text-default-label'} ${href ? '' : 'pointer-events-none opacity-60'}`;
  return href ? <Link href={href} className={className} aria-current={active ? 'page' : undefined}>{label}</Link> : <span className={className} aria-current={active ? 'page' : undefined}>{label}</span>;
}
