'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { decode } from 'entities';
import { ArrowRightLeft, Check, MessageCircle, Pencil, Send, Trash2, X } from 'lucide-react';

import type { ArticleResponse } from '@/types/article';
import type { CategoryResponse } from '@/types/category';
import type { ReplyResponse } from '@/types/reply';
import { useAuth } from '@/hooks/use-auth';
import { authorizedFetch } from '@/lib/api-fetch';
import { contentPermissions } from '@/lib/content-permissions';
import { Confirm } from '@/components/ui/confirm';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { DropdownSelect } from '@/components/ui/dropdown-select';
import { VoteButton } from '@/components/vote/vote-button';

const buttonClassName =
  'inline-flex h-9 items-center justify-center gap-1.5 border px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50';

async function responseMessage(
  response: Response,
  fallback: string
): Promise<string> {
  const message = await response.text();
  if (!response.ok) {
    throw new Error(message || fallback);
  }
  return message || fallback;
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(value));
}

function decodeReplyContent(content: string | null | undefined): string {
  return decode(content ?? '');
}

export function ArticleReplies({
  article
}: Readonly<{
  article: ArticleResponse;
}>) {
  const router = useRouter();
  const { showToast } = useToast();
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [deleteReplyId, setDeleteReplyId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const replies = article.replies ?? [];
  const { user, isAuthenticated } = useAuth();
  const { manager: isManager } = contentPermissions(user, isAuthenticated);

  function submitReply(
    endpoint: string,
    form: HTMLFormElement,
    successMessage: string
  ) {
    startTransition(async () => {
      try {
        const body = new FormData(form);
        body.set('exposed', 'true');
        const response = await authorizedFetch(endpoint, {
          method: 'POST',
          body,
          credentials: 'include'
        });
        showToast(await responseMessage(response, successMessage), 'success');
        form.reset();
        setEditingReplyId(null);
        router.refresh();
      } catch (error) {
        showToast(error instanceof Error ? error.message : '댓글을 저장하지 못했습니다.', 'error');
      }
    });
  }

  function deleteReply() {
    if (!deleteReplyId) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await authorizedFetch(
          `/api/replies/${encodeURIComponent(deleteReplyId)}`,
          {
            method: 'DELETE',
            credentials: 'include'
          }
        );
        showToast(await responseMessage(response, '댓글을 삭제했습니다.'), 'success');
        setDeleteReplyId(null);
        router.refresh();
      } catch (error) {
        showToast(error instanceof Error ? error.message : '댓글을 삭제하지 못했습니다.', 'error');
      }
    });
  }

  return (
    <section className="border-default-separator bg-default-surface overflow-hidden border shadow-[0_1px_0_rgb(0_0_0_/_0.04)]">
      <header className="border-default-separator bg-default-surface flex items-center justify-between border-b px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2.5">
          <MessageCircle aria-hidden className="text-default-secondary-label size-4" />
          <h2 className="text-default-primary text-sm font-bold tracking-[0.16em] uppercase sm:text-base">댓글</h2>
        </div>
        <span className="border-default-separator bg-default-fill text-default-label inline-flex min-w-7 items-center justify-center border px-2 py-1 text-xs font-bold tabular-nums">
          {replies.length}
        </span>
      </header>

      {replies.length > 0 ? (
        <ol>
          {replies.map((reply) => {
            const { owner: isOwner } = contentPermissions(user, isAuthenticated, reply.createdBy);
            const isEditing = editingReplyId === reply.id;

            return (
              <li
                className="border-default-separator/70 hover:bg-default-fill/35 border-b p-4 transition-colors last:border-b-0 sm:p-5"
                id={reply.id}
                key={reply.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="border-default-separator bg-default-fill text-default-secondary-label flex size-9 shrink-0 items-center justify-center border text-xs font-bold uppercase">
                      {(reply.maskedAuthor ?? reply.createdBy ?? '익').slice(0, 1)}
                    </span>
                    <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-default-label text-sm font-semibold">
                        {reply.maskedAuthor ?? reply.createdBy ?? '익명'}
                      </span>
                      {reply.createdBy === article.createdBy ? (
                        <span className="bg-default-fill text-default-label border-default-separator border px-2 py-0.5 text-[0.6875rem] font-bold">
                          작성자
                        </span>
                      ) : null}
                    </div>
                    <time className="text-default-tertiary-label mt-1 block text-xs">
                      {formatDate(reply.createdDate)}
                    </time>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {isAuthenticated && (isOwner || isManager) ? (
                      <div className="flex gap-2">
                        {isOwner ? (
                          <button
                            className={`${buttonClassName} border-default-separator text-default-secondary-label hover:bg-default-fill`}
                            type="button"
                            onClick={() =>
                              setEditingReplyId(isEditing ? null : reply.id)
                            }
                          >
                            {isEditing ? (
                              <X className="size-4" />
                            ) : (
                              <Pencil className="size-4" />
                            )}
                            {isEditing ? '취소' : '수정'}
                          </button>
                        ) : null}
                        <button
                          className={`${buttonClassName} border-default-red-muted text-default-red hover:bg-default-red-soft`}
                          type="button"
                          onClick={() => setDeleteReplyId(reply.id)}
                        >
                          <Trash2 className="size-4" />
                          삭제
                        </button>
                      </div>
                    ) : null}
                    <VoteButton referenceId={reply.id} />
                  </div>
                </div>

                {isEditing ? (
                  <form
                    className="mt-4 flex gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      submitReply(
                        `/api/replies/${encodeURIComponent(reply.id)}`,
                        event.currentTarget,
                        '댓글을 수정했습니다.'
                      );
                    }}
                  >
                    <textarea
                      aria-label="댓글 수정"
                      className="form-control form-textarea min-h-20 flex-1 text-sm"
                      defaultValue={decodeReplyContent(reply.content)}
                      name="content"
                      required
                    />
                    <button
                      className={`${buttonClassName} !h-11 border-default-label bg-default-label text-default-background self-end`}
                      disabled={pending}
                      type="submit"
                    >
                      <Check className="size-4" />
                      저장
                    </button>
                  </form>
                ) : (
                  <p className="border-default-separator bg-default-surface-grouped/45 text-default-secondary-label mt-4 border px-4 py-3 text-sm leading-6 whitespace-pre-wrap">
                    {decodeReplyContent(reply.content)}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="text-default-tertiary-label px-5 py-10 text-center text-sm">
          아직 등록된 댓글이 없습니다.
        </p>
      )}

      <div className="border-default-separator bg-default-surface-grouped/35 border-t p-4 sm:p-5">
        {isAuthenticated ? (
          <form
            className="flex flex-col gap-2.5 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              submitReply(
                '/api/replies',
                event.currentTarget,
                '댓글을 등록했습니다.'
              );
            }}
          >
            <input name="articleId" type="hidden" value={article.id} />
            <textarea
              aria-label="댓글 입력"
              className="form-control form-textarea h-12 min-h-12 flex-1 resize-none text-sm"
              name="content"
              placeholder="댓글을 입력하세요."
              required
            />
            <button
              className={`${buttonClassName} !h-12 w-full border-default-primary bg-default-primary text-white hover:bg-default-primary-muted self-end sm:w-auto sm:self-stretch`}
              disabled={pending}
              type="submit"
            >
              <Send className="size-4" />
              등록
            </button>
          </form>
        ) : (
          <p className="text-default-secondary-label text-center text-sm">
            댓글을 작성하려면 로그인해 주세요.
          </p>
        )}
      </div>

      <Confirm
        confirmLabel="삭제"
        onCancel={() => setDeleteReplyId(null)}
        onConfirm={deleteReply}
        open={deleteReplyId !== null}
        title="댓글을 삭제할까요?"
        tone="danger"
      >
        삭제한 댓글은 복구할 수 없습니다.
      </Confirm>
    </section>
  );
}

export function ArticleManagementActions({
  article,
  categories,
  listHref,
  isSchedule = false
}: Readonly<{
  article: ArticleResponse;
  categories: readonly CategoryResponse[];
  listHref: string;
  isSchedule?: boolean;
}>) {
  const router = useRouter();
  const { showToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { user, isAuthenticated } = useAuth();
  const { canMove, canEdit, canDelete } = contentPermissions(user, isAuthenticated, article.createdBy, isSchedule);

  if (!isAuthenticated) {
    return null;
  }

  function deleteArticle() {
    startTransition(async () => {
      try {
        const response = await authorizedFetch(
          `/api/${isSchedule ? 'events' : 'articles'}/${encodeURIComponent(article.id)}`,
          {
            method: 'DELETE',
            credentials: 'include'
          }
        );
        showToast(await responseMessage(response, '게시글을 삭제했습니다.'), 'success');
        router.push(listHref);
        router.refresh();
      } catch (error) {
        showToast(error instanceof Error ? error.message : '게시글을 삭제하지 못했습니다.', 'error');
      }
    });
  }

  function moveArticle(form: HTMLFormElement) {
    const categoryId = new FormData(form).get('categoryId');
    if (typeof categoryId !== 'string') {
      return;
    }

    startTransition(async () => {
      try {
        const response = await authorizedFetch(
          `/api/articles/${encodeURIComponent(article.id)}/move`,
          {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ categoryId })
          }
        );
        showToast(await responseMessage(response, '게시글을 이동했습니다.'), 'success');
        setMoveOpen(false);
        router.refresh();
      } catch (error) {
        showToast(error instanceof Error ? error.message : '게시글을 이동하지 못했습니다.', 'error');
      }
    });
  }

  return (
    <>
      <div className="flex flex-wrap justify-end gap-2">
        {canMove ? (
          <button
            className={`${buttonClassName} border-default-separator text-default-secondary-label hover:bg-default-fill`}
            type="button"
            onClick={() => setMoveOpen(true)}
          >
            <ArrowRightLeft className="size-4" />
            이동
          </button>
        ) : null}
        {canEdit ? (
          <a
            className={`${buttonClassName} border-default-separator text-default-label hover:bg-default-fill`}
            href={`/articles/${encodeURIComponent(article.id)}/edit?categoryId=${encodeURIComponent(article.categoryId ?? '')}`}
          >
            <Pencil className="size-4" />
            수정
          </a>
        ) : null}
        {canDelete ? (
          <button
            className={`${buttonClassName} border-default-red-muted text-default-red hover:bg-default-red-soft`}
            type="button"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
            삭제
          </button>
        ) : null}
      </div>

      <Modal
        footer={
          <>
            <button
              className="border-default-separator bg-default-surface text-default-label hover:bg-default-fill inline-flex h-10 items-center px-4 text-sm font-semibold transition"
              type="button"
              onClick={() => setMoveOpen(false)}
            >
              취소
            </button>
            <button
              className="bg-default-primary text-default-primary-contrast hover:bg-default-primary-muted inline-flex h-10 items-center px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
              disabled={pending}
              form="move-article-form"
              type="submit"
            >
              이동
            </button>
          </>
        }
        onClose={() => setMoveOpen(false)}
        open={moveOpen}
        title="게시글 이동"
        variant="editorial"
      >
        <form
          id="move-article-form"
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            moveArticle(event.currentTarget);
          }}
        >
          <label className="text-default-label block text-xs font-bold tracking-[0.08em]">
            이동할 카테고리
            <DropdownSelect
              className="mt-3"
              defaultValue={article.categoryId ?? ''}
              name="categoryId"
              options={categories.filter((category) => category.type !== 'NONE').map((category) => ({ label: category.name, value: category.id }))}
            />
          </label>
        </form>
      </Modal>

      <Confirm
        confirmLabel="삭제"
        onCancel={() => setDeleteOpen(false)}
        onConfirm={deleteArticle}
        open={deleteOpen}
        title="게시글을 삭제할까요?"
        tone="danger"
      >
        삭제한 게시글은 복구할 수 없습니다.
      </Confirm>
    </>
  );
}
