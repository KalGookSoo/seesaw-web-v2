import type { ArticleResponse, PagedModel } from '@/types/site';
import { APPLICATION_API_BASE_URL } from '@/lib/application-constants';

export type ArticleViewType = 'TABLE' | 'CARD';

export type SearchArticlesParams = Readonly<{
  categoryId: string;
  categoryType?: string;
  viewType?: ArticleViewType;
  keyField?: string;
  keyWord?: string;
  page?: number;
  size?: number;
}>;

function appendOptional(params: URLSearchParams, name: string, value: string | number | null | undefined) {
  if (value !== null && value !== undefined && String(value).trim()) {
    params.set(name, String(value));
  }
}

function assertOk(response: Response, message: string): void {
  if (!response.ok) {
    throw new Error(`${message} status=${response.status}`);
  }
}

export async function fetchArticles(search: SearchArticlesParams): Promise<PagedModel<ArticleResponse>> {
  const params = new URLSearchParams();
  appendOptional(params, 'categoryId', search.categoryId);
  appendOptional(params, 'categoryType', search.categoryType);
  appendOptional(params, 'keyField', search.keyField);
  appendOptional(params, 'keyWord', search.keyWord);
  appendOptional(params, 'page', search.page ?? 0);
  appendOptional(params, 'size', search.size ?? (search.viewType === 'CARD' ? 9 : 8));
  params.append('sort', 'article.createdDate,desc');

  const response = await fetch(`${APPLICATION_API_BASE_URL}/articles?${params.toString()}`, {
    headers: {
      Accept: 'application/json'
    },
    next: {
      revalidate: 0
    }
  });

  assertOk(response, '게시글 목록을 조회할 수 없습니다.');
  return response.json();
}

export async function fetchFixedArticles(categoryId: string): Promise<ArticleResponse[]> {
  const params = new URLSearchParams({ categoryId });
  const response = await fetch(`${APPLICATION_API_BASE_URL}/articles/fixed?${params.toString()}`, {
    headers: {
      Accept: 'application/json'
    },
    next: {
      revalidate: 0
    }
  });

  assertOk(response, '고정 게시글을 조회할 수 없습니다.');
  return response.json();
}

export async function fetchStaticContentArticles(categoryId: string): Promise<ArticleResponse[]> {
  const params = new URLSearchParams({ categoryId });
  const response = await fetch(`${APPLICATION_API_BASE_URL}/articles/static-content?${params.toString()}`, {
    headers: {
      Accept: 'application/json'
    },
    next: {
      revalidate: 0
    }
  });

  assertOk(response, '정적 콘텐츠를 조회할 수 없습니다.');
  return response.json();
}

export function toArticleHref(article: ArticleResponse): string {
  return `/articles/${article.id}?categoryId=${encodeURIComponent(article.categoryId)}`;
}
