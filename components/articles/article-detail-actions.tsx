'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightLeft, Check, Pencil, Send, Trash2, X } from 'lucide-react';

import type { ArticleResponse } from '@/types/article';
import type { CategoryResponse } from '@/types/category';
import type { ReplyResponse } from '@/types/reply';
import { MOCK_AUTHENTICATION } from '@/lib/mock-auth';
import { Confirm } from '@/components/ui/confirm';
import { Modal } from '@/components/ui/modal';

const buttonClassName =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-md border px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50';

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

export function ArticleReplies({
  article
}: Readonly<{
  article: ArticleResponse;
}>) {
  const router = useRouter();
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [deleteReplyId, setDeleteReplyId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const replies = article.replies ?? [];
  const authentication = MOCK_AUTHENTICATION;
  const isManager = authentication.roles.some(
    (role) => role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER'
  );

  function submitReply(
    endpoint: string,
    form: HTMLFormElement,
    successMessage: string
  ) {
    startTransition(async () => {
      try {
        const body = new FormData(form);
        body.set('exposed', 'true');
        const response = await fetch(endpoint, {
          method: 'POST',
          body,
          credentials: 'include'
        });
        window.alert(await responseMessage(response, successMessage));
        form.reset();
        setEditingReplyId(null);
        router.refresh();
      } catch (error) {
        window.alert(
          error instanceof Error ? error.message : '댓글을 저장하지 못했습니다.'
        );
      }
    });
  }

  function deleteReply() {
    if (!deleteReplyId) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/replies/${encodeURIComponent(deleteReplyId)}`,
          {
            method: 'DELETE',
            credentials: 'include'
          }
        );
        window.alert(await responseMessage(response, '댓글을 삭제했습니다.'));
        setDeleteReplyId(null);
        router.refresh();
      } catch (error) {
        window.alert(
          error instanceof Error ? error.message : '댓글을 삭제하지 못했습니다.'
        );
      }
    });
  }

  return (
    <section className="border-default-separator bg-default-surface overflow-hidden rounded-xl border shadow-sm">
      <header className="border-default-separator bg-default-fill/45 flex items-center gap-2 border-b px-5 py-4">
        <h2 className="text-default-label font-semibold">댓글</h2>
        <span className="bg-default-blue-soft text-default-blue-contrast rounded-full px-2 py-0.5 text-xs font-bold">
          {replies.length}
        </span>
      </header>

      {replies.length > 0 ? (
        <ol>
          {replies.map((reply) => {
            const isOwner = reply.createdBy === authentication.username;
            const isEditing = editingReplyId === reply.id;

            return (
              <li
                className="border-default-separator/70 border-b p-5 last:border-b-0"
                id={reply.id}
                key={reply.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-default-label text-sm font-semibold">
                        {reply.maskedAuthor ?? reply.createdBy ?? '익명'}
                      </span>
                      {reply.createdBy === article.createdBy ? (
                        <span className="bg-default-blue-soft text-default-blue-contrast rounded-full px-2 py-0.5 text-[0.6875rem] font-bold">
                          작성자
                        </span>
                      ) : null}
                    </div>
                    <time className="text-default-tertiary-label mt-1 block text-xs">
                      {formatDate(reply.createdDate)}
                    </time>
                  </div>

                  {authentication.authenticated && (isOwner || isManager) ? (
                    <div className="flex gap-2">
                      {isOwner || isManager ? (
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
                      className="border-default-separator bg-default-fill text-default-label focus:border-default-blue min-h-24 flex-1 resize-y rounded-lg border px-3 py-2 text-sm outline-none"
                      defaultValue={reply.content ?? ''}
                      name="content"
                      required
                    />
                    <button
                      className={`${buttonClassName} border-default-blue bg-default-blue self-end text-white`}
                      disabled={pending}
                      type="submit"
                    >
                      <Check className="size-4" />
                      저장
                    </button>
                  </form>
                ) : (
                  <p className="bg-default-fill text-default-secondary-label mt-4 rounded-lg px-4 py-3 text-sm leading-6 whitespace-pre-wrap">
                    {reply.content}
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

      <div className="border-default-separator bg-default-fill/30 border-t p-5">
        {authentication.authenticated ? (
          <form
            className="flex flex-col gap-3 sm:flex-row"
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
              className="border-default-separator bg-default-surface text-default-label focus:border-default-blue min-h-24 flex-1 resize-y rounded-lg border px-3 py-2 text-sm outline-none"
              name="content"
              placeholder="댓글을 입력하세요."
              required
            />
            <button
              className={`${buttonClassName} border-default-blue bg-default-blue self-end text-white`}
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
  listHref
}: Readonly<{
  article: ArticleResponse;
  categories: readonly CategoryResponse[];
  listHref: string;
}>) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const authentication = MOCK_AUTHENTICATION;
  const isManager = authentication.roles.some(
    (role) => role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER'
  );
  const isOwner = article.createdBy === authentication.username;

  if (!authentication.authenticated) {
    return null;
  }

  function deleteArticle() {
    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/articles/${encodeURIComponent(article.id)}`,
          {
            method: 'DELETE',
            credentials: 'include'
          }
        );
        window.alert(await responseMessage(response, '게시글을 삭제했습니다.'));
        router.push(listHref);
        router.refresh();
      } catch (error) {
        window.alert(
          error instanceof Error
            ? error.message
            : '게시글을 삭제하지 못했습니다.'
        );
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
        const response = await fetch(
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
        window.alert(await responseMessage(response, '게시글을 이동했습니다.'));
        setMoveOpen(false);
        router.refresh();
      } catch (error) {
        window.alert(
          error instanceof Error
            ? error.message
            : '게시글을 이동하지 못했습니다.'
        );
      }
    });
  }

  return (
    <>
      <div className="flex flex-wrap justify-end gap-2">
        {isManager ? (
          <button
            className={`${buttonClassName} border-default-separator text-default-secondary-label hover:bg-default-fill`}
            type="button"
            onClick={() => setMoveOpen(true)}
          >
            <ArrowRightLeft className="size-4" />
            이동
          </button>
        ) : null}
        {isOwner || isManager ? (
          <a
            className={`${buttonClassName} border-default-blue-muted text-default-blue hover:bg-default-blue-soft`}
            href={`/articles/${encodeURIComponent(article.id)}/edit?categoryId=${encodeURIComponent(article.categoryId ?? '')}`}
          >
            <Pencil className="size-4" />
            수정
          </a>
        ) : null}
        {isOwner || isManager ? (
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
        footer={null}
        onClose={() => setMoveOpen(false)}
        open={moveOpen}
        title="게시글 이동"
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            moveArticle(event.currentTarget);
          }}
        >
          <label className="text-default-label block text-sm font-semibold">
            이동할 카테고리
            <select
              className="border-default-separator bg-default-fill mt-2 block h-11 w-full rounded-lg border px-3 text-sm"
              defaultValue={article.categoryId ?? ''}
              name="categoryId"
              required
            >
              {categories
                .filter((category) => category.type !== 'NONE')
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </label>
          <div className="flex justify-end gap-2">
            <button
              className={`${buttonClassName} border-default-separator text-default-secondary-label`}
              type="button"
              onClick={() => setMoveOpen(false)}
            >
              취소
            </button>
            <button
              className={`${buttonClassName} border-default-blue bg-default-blue text-white`}
              disabled={pending}
              type="submit"
            >
              이동
            </button>
          </div>
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
