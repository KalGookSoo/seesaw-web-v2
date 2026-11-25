'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useSiteContext } from '@/app/site-context-provider';
import { useAuth } from '@/hooks/use-auth';
import { useCategoryCreatePermission } from '@/hooks/use-category-create-permission';
import { ArticleForm } from '@/components/articles/article-form';
import { ScheduleForm } from '@/components/articles/schedule-form';
import { ContentContainer } from '@/components/layout/content-container';

export default function NewArticlePage() {
  const searchParams = useSearchParams();
  const { ALL_CATEGORIES } = useSiteContext();
  const { isAuthenticated } = useAuth();

  const categoryId = searchParams.get('categoryId') ?? '';
  const categoryType = searchParams.get('categoryType');
  const category = categoryId ? ALL_CATEGORIES[categoryId] : undefined;
  const { canCreate, loading } = useCategoryCreatePermission(categoryId);

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
          className="bg-default-primary px-4 py-2 text-sm font-semibold text-white hover:bg-default-primary-muted"
          href={listHref}
        >
          목록으로 돌아가기
        </Link>
      </main>
    );
  }

  if (loading) return <main className="text-default-secondary-label p-8" role="status">권한을 확인하고 있습니다.</main>;
  if (!canCreate) return <main className="text-default-secondary-label flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8"><p>이 카테고리에 글을 작성할 권한이 없습니다.</p><Link href={listHref} className="border-default-separator border px-4 py-2">목록으로 돌아가기</Link></main>;

  return (
      <main className="bg-default-surface-grouped text-default-label min-h-full">
      <ContentContainer className="py-8 lg:py-12">
        {category.type === 'SCHEDULE' ? (
          <ScheduleForm
            categoryId={categoryId}
            categoryName={category.name ?? ''}
            cancelHref={listHref}
            mode="create"
            successHref={listHref}
          />
        ) : (
          <ArticleForm
            categoryId={categoryId}
            categoryName={category.name ?? ''}
            cancelHref={listHref}
            mode="create"
            successHref={listHref}
          />
        )}
      </ContentContainer>
    </main>
  );
}
