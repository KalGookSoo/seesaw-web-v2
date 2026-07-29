import { notFound } from 'next/navigation';

import { fetchArticleDetail } from '@/lib/articles';
import { ArticleEditPageContent } from '@/components/articles/article-edit-page-content';

type EditArticlePageProps = Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({
  params,
  searchParams
}: EditArticlePageProps) {
  const [{ id }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ]);

  const result = await fetchArticleDetail(id, {});
  const article = result.ok ? result.data.article : null;

  if (!article) {
    notFound();
  }

  const categoryId =
    firstValue(resolvedSearchParams.categoryId) ?? article.categoryId ?? '';
  const detailHref = `/articles/${encodeURIComponent(id)}?categoryId=${encodeURIComponent(categoryId)}`;

  return (
    <main className="bg-default-surface-grouped text-default-label min-h-full">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <ArticleEditPageContent
          article={article}
          articleId={id}
          categoryId={categoryId}
          detailHref={detailHref}
        />
      </div>
    </main>
  );
}
