'use client';

import Link from 'next/link';
import { Pencil } from 'lucide-react';

import { useCategoryCreatePermission } from '@/hooks/use-category-create-permission';

export function ArticleListActions({
  categoryId,
  categoryType,
  className
}: Readonly<{ categoryId: string; categoryType: string; className: string }>) {
  const { canCreate } = useCategoryCreatePermission(categoryId);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {canCreate ? (
        <Link
          className={`${className} bg-default-primary text-default-primary-contrast hover:bg-default-primary-muted font-semibold`}
          href={`/articles/new?categoryId=${encodeURIComponent(categoryId)}&categoryType=${encodeURIComponent(categoryType)}`}
        >
          <Pencil className="size-4" />
          글쓰기
        </Link>
      ) : null}
    </div>
  );
}
