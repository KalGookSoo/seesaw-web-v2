'use client';

import Link from 'next/link';
import type { ArticleResponse } from '@/types/article';
import type { VEventResponse } from '@/types/event';
import { contentPermissions } from '@/lib/content-permissions';
import { useAuth } from '@/hooks/use-auth';
import { ScheduleForm } from '@/components/articles/schedule-form';

export function ScheduleEditPageContent({ article, event, categoryId, categoryName, detailHref }: Readonly<{
  article: ArticleResponse;
  event: VEventResponse;
  categoryId: string;
  categoryName: string;
  detailHref: string;
}>) {
  const { user, isAuthenticated } = useAuth();
  const { canEdit } = contentPermissions(user, isAuthenticated, article.createdBy, true);

  if (!canEdit) {
    return <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center"><p className="text-default-secondary-label text-sm">{isAuthenticated ? '이 일정을 수정할 권한이 없습니다.' : '로그인 후 일정을 수정할 수 있습니다.'}</p><Link className="bg-default-primary hover:bg-default-primary-muted px-4 py-2 text-sm font-semibold text-white" href={detailHref}>일정으로 돌아가기</Link></div>;
  }

  return <ScheduleForm categoryId={categoryId} categoryName={categoryName} cancelHref={detailHref} eventId={event.id} initialAttachments={article.attachments ?? []} initialEvent={event} mode="edit" successHref={detailHref} />;
}
