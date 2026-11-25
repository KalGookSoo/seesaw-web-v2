'use client';

import Link from 'next/link';
import { Pencil, UserRound } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useCategoryCreatePermission } from '@/hooks/use-category-create-permission';

export function ArticleListActions({ categoryId, categoryType, mineHref, className }: Readonly<{ categoryId: string; categoryType: string; mineHref: string; className: string }>) {
  const { isAuthenticated } = useAuth();
  const { canCreate } = useCategoryCreatePermission(categoryId);
  return <div className="flex flex-wrap items-center gap-2">
    {isAuthenticated ? <Link className={`${className} border border-[var(--editorial-line-soft)] text-[var(--editorial-ink-soft)] hover:bg-[var(--editorial-surface-muted)] hover:text-[var(--editorial-ink)]`} href={mineHref}><UserRound className="size-4" />내가 쓴 글</Link> : null}
    {canCreate ? <Link className={`${className} bg-default-primary text-default-primary-contrast hover:bg-default-primary-muted font-semibold`} href={`/articles/new?categoryId=${encodeURIComponent(categoryId)}&categoryType=${encodeURIComponent(categoryType)}`}><Pencil className="size-4" />글쓰기</Link> : null}
  </div>;
}
