'use client';

import Link from 'next/link';

import type { ArticleResponse } from '@/types/article';
import { useSiteContext } from '@/app/site-context-provider';
import { useAuth } from '@/hooks/use-auth';
import { ArticleForm } from '@/components/articles/article-form';

export function ArticleEditPageContent({
  article,
  articleId,
  categoryId,
  detailHref
}: Readonly<{
  article: ArticleResponse;
  articleId: string;
  categoryId: string;
  detailHref: string;
}>) {
  const { ALL_CATEGORIES } = useSiteContext();
  const { user, isAuthenticated } = useAuth();
  const category = ALL_CATEGORIES[categoryId];

  const isManager = (user?.authorities ?? []).some(
    (authority) => authority === 'ROLE_ADMIN' || authority === 'ROLE_MANAGER'
  );
  const isOwner = isAuthenticated && user?.username === article.createdBy;

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-default-secondary-label text-sm">
          로그인 후 게시글을 수정할 수 있습니다.
        </p>
        <Link
          className="bg-default-blue rounded-lg px-4 py-2 text-sm font-semibold text-white"
          href={detailHref}
        >
          게시글로 돌아가기
        </Link>
      </div>
    );
  }

  if (!isOwner && !isManager) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-default-secondary-label text-sm">
          이 게시글을 수정할 권한이 없습니다.
        </p>
        <Link
          className="bg-default-blue rounded-lg px-4 py-2 text-sm font-semibold text-white"
          href={detailHref}
        >
          게시글로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <ArticleForm
      articleId={articleId}
      cancelHref={detailHref}
      categoryId={categoryId}
      categoryName={category?.name ?? ''}
      createdBy={article.createdBy}
      initialAttachments={(article.attachments ?? []).filter(
        (attachment) => attachment.attachment !== false
      )}
      initialContent={article.content ?? ''}
      initialFixed={article.fixed ?? false}
      initialTitle={article.title ?? ''}
      mode="edit"
      successHref={detailHref}
    />
  );
}
