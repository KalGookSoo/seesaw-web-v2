import { notFound } from 'next/navigation';

import type { CategoryResponse } from '@/types/category';
import { APPLICATION_NAME } from '@/lib/application-constants';
import { fetchArticleDetail } from '@/lib/articles';
import { fetchEventsByCategory } from '@/lib/events';
import { ArticleEditPageContent } from '@/components/articles/article-edit-page-content';
import { ScheduleForm } from '@/components/articles/schedule-form';
import { getSiteContext } from '@/lib/site';
import { ContentContainer } from '@/components/layout/content-container';

type EditArticlePageProps = Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function findCategory(
  categories: readonly CategoryResponse[],
  categoryId: string
): CategoryResponse | null {
  for (const category of categories) {
    if (category.id === categoryId) {
      return category;
    }

    const child = findCategory(category.children ?? [], categoryId);
    if (child) {
      return child;
    }
  }

  return null;
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

  const domainName = `${APPLICATION_NAME}.seesaw.me.kr`;
  const siteContext = await getSiteContext(domainName);
  const category = findCategory(siteContext.categories ?? [], categoryId);
  if (category?.type === 'SCHEDULE') {
    const events = await fetchEventsByCategory(categoryId);
    const event = events.find((item) => item.articleId === id);
    if (event) {
      return (
        <main className="bg-default-surface-grouped text-default-label min-h-full">
          <ContentContainer className="py-8 lg:py-12">
            <ScheduleForm
              categoryId={categoryId}
              categoryName={category.name ?? ''}
              cancelHref={detailHref}
              eventId={event.id}
              initialAttachments={article.attachments ?? []}
              initialEvent={event}
              mode="edit"
              successHref={detailHref}
            />
          </ContentContainer>
        </main>
      );
    }
  }

  return (
    <main className="bg-default-surface-grouped text-default-label min-h-full">
      <ContentContainer className="py-8 lg:py-12">
        <ArticleEditPageContent
          article={article}
          articleId={id}
          categoryId={categoryId}
          detailHref={detailHref}
        />
      </ContentContainer>
    </main>
  );
}
