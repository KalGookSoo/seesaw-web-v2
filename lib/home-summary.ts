import type { ArticleResponse, PagedModel, VEventResponse } from '@/types/site';
import { APPLICATION_API_BASE_URL } from '@/lib/application-constants';

type FetchOptions = Readonly<{
  signal?: AbortSignal;
}>;

function toLocalDateTimeParameter(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export async function fetchRecentArticles(categoryId: string, options: FetchOptions = {}): Promise<PagedModel<ArticleResponse>> {
  const params = new URLSearchParams({
    categoryId,
    categoryType: 'BOARD',
    page: '0',
    size: '3',
    sort: 'article.createdDate,desc'
  });

  const response = await fetch(`${APPLICATION_API_BASE_URL}/articles?${params.toString()}`, {
    headers: {
      Accept: 'application/json'
    },
    signal: options.signal
  });

  if (!response.ok) {
    throw new Error(`최근 게시글을 조회할 수 없습니다. status=${response.status}, categoryId=${categoryId}`);
  }

  return response.json();
}

export async function fetchMonthlyEvents(
  categoryId: string,
  start: Date,
  end: Date,
  options: FetchOptions = {}
): Promise<VEventResponse[]> {
  const params = new URLSearchParams({
    categoryId,
    start: toLocalDateTimeParameter(start),
    end: toLocalDateTimeParameter(end)
  });

  const response = await fetch(`${APPLICATION_API_BASE_URL}/events?${params.toString()}`, {
    headers: {
      Accept: 'application/json'
    },
    signal: options.signal
  });

  if (!response.ok) {
    throw new Error(`월간 일정을 조회할 수 없습니다. status=${response.status}, categoryId=${categoryId}`);
  }

  return response.json();
}

export function toAttachmentUrl(id: string): string {
  return `${APPLICATION_API_BASE_URL}/attachments/${id}`;
}
