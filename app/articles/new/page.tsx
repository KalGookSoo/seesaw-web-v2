'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useSiteContext } from '@/app/site-context-provider';
import { useAuth } from '@/hooks/use-auth';
import { ArticleForm } from '@/components/articles/article-form';

export default function NewArticlePage() {
  const searchParams = useSearchParams();
  const { ALL_CATEGORIES } = useSiteContext();
  const { isAuthenticated } = useAuth();

  const categoryId = searchParams.get('categoryId') ?? '';
  const categoryType = searchParams.get('categoryType');
  const category = categoryId ? ALL_CATEGORIES[categoryId] : undefined;

  const listParams = new URLSearchParams();
  if (categoryId) {
    listParams.set('categoryId', categoryId);
  }
  if (categoryType) {
    listParams.set('categoryType', categoryType);
  }
  const listHref = `/articles?${listParams.toString()}`;

  if (!categoryId || !category) {
    return (
      <main className="bg-default-surface-grouped text-default-label flex min-h-[60vh] items-center justify-center px-4">
        <p className="text-default-secondary-label text-sm">
          카테고리 정보를 확인할 수 없습니다.
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="bg-default-surface-grouped text-default-label flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-default-secondary-label text-sm">
          로그인 후 게시글을 작성할 수 있습니다.
        </p>
        <Link
          className="bg-default-blue rounded-lg px-4 py-2 text-sm font-semibold text-white"
          href={listHref}
        >
          목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-default-surface-grouped text-default-label min-h-full">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <ArticleForm
          categoryId={categoryId}
          categoryName={category.name ?? ''}
          cancelHref={listHref}
          mode="create"
          successHref={listHref}
        />
      </div>
    </main>
  );
}
