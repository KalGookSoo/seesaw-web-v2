'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, Trash2, X } from 'lucide-react';

import type { AttachmentResponse } from '@/types/attachment';
import {
  createArticle,
  updateArticle,
  type ArticleMutationFailure
} from '@/lib/articles';
import { deleteAttachment } from '@/lib/attachments';
import { useAuth } from '@/hooks/use-auth';
import { AttachmentUpload } from '@/components/articles/attachment-upload';
import {
  ContentEditableEditor,
  type ContentEditableEditorHandle
} from '@/components/articles/content-editable-editor';
import { Confirm } from '@/components/ui/confirm';

type ArticleFormMode = 'create' | 'edit';

type ArticleFormProps = Readonly<{
  mode: ArticleFormMode;
  articleId?: string;
  categoryId: string;
  categoryName: string;
  cancelHref: string;
  successHref: string;
  initialTitle?: string;
  initialContent?: string;
  initialFixed?: boolean;
  createdBy?: string | null;
  initialAttachments?: readonly AttachmentResponse[];
}>;

export function ArticleForm({
  mode,
  articleId,
  categoryId,
  categoryName,
  cancelHref,
  successHref,
  initialTitle = '',
  initialContent = '',
  initialFixed = false,
  createdBy,
  initialAttachments = []
}: ArticleFormProps) {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const editorRef = useRef<ContentEditableEditorHandle>(null);

  const [title, setTitle] = useState(initialTitle);
  const [fixed, setFixed] = useState(initialFixed);
  const [files, setFiles] = useState<File[]>([]);
  const [attachments, setAttachments] =
    useState<readonly AttachmentResponse[]>(initialAttachments);
  const [attachmentToDelete, setAttachmentToDelete] =
    useState<AttachmentResponse | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isManager = (user?.authorities ?? []).some(
    (authority) => authority === 'ROLE_ADMIN' || authority === 'ROLE_MANAGER'
  );
  // 작성 화면(new.html)은 관리자/매니저에게만 공지글 토글을 노출한다.
  // 수정 화면(edit.html)은 원본과 동일하게 역할과 무관하게 항상 노출한다.
  const canToggleFixed = mode === 'edit' || isManager;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessToken) {
      window.alert('로그인이 필요합니다.');
      return;
    }

    setSubmitting(true);
    setFieldErrors({});

    const content = editorRef.current?.getHtml() ?? '';
    const inlineImages = editorRef.current?.getInlineImageFiles() ?? [];

    const command = {
      categoryId,
      type: 'HTML' as const,
      fixed,
      title,
      content,
      multipartFiles: files,
      inlineImages
    };

    const result =
      mode === 'create'
        ? await createArticle(command, accessToken)
        : await updateArticle(articleId ?? '', command, accessToken);

    setSubmitting(false);

    if (result.ok) {
      window.alert(
        mode === 'create' ? '게시글을 등록했습니다.' : '게시글을 수정했습니다.'
      );
      router.push(successHref);
      return;
    }

    const failure = result as ArticleMutationFailure;

    if (failure.status === 401) {
      window.alert('로그인이 필요합니다.');
    } else if (failure.status === 403) {
      window.alert('권한이 없습니다.');
    } else if (failure.status === 422) {
      const errors: Record<string, string> = {};
      failure.errors.forEach((error) => {
        errors[error.field] = error.message;
      });
      setFieldErrors(errors);
    } else {
      window.alert(
        mode === 'create' ? '게시글을 등록하지 못했습니다.' : '게시글을 수정하지 못했습니다.'
      );
    }
  }

  async function handleDeleteAttachment() {
    if (!attachmentToDelete || !accessToken) {
      return;
    }

    try {
      await deleteAttachment(attachmentToDelete.id, accessToken);
      setAttachments((current) =>
        current.filter((attachment) => attachment.id !== attachmentToDelete.id)
      );
      window.alert('삭제되었습니다.');
    } catch {
      window.alert('삭제에 실패했습니다.');
    } finally {
      setAttachmentToDelete(null);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <p className="text-default-secondary-label text-sm font-medium">
        {categoryName}
      </p>

      <section className="border-default-separator bg-default-surface rounded-xl border shadow-sm">
        <header className="border-default-separator border-b px-5 py-4">
          <h1 className="text-default-label text-base font-semibold">
            {mode === 'create' ? '새 게시글 작성' : '게시글 수정'}
          </h1>
        </header>

        <div className="space-y-5 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-default-secondary-label text-sm">작성자</span>
              <span className="text-default-label text-sm font-medium">
                {mode === 'create' ? user?.username : createdBy}
              </span>
            </div>
            {canToggleFixed ? (
              <label className="flex items-center gap-2 text-sm">
                <input
                  checked={fixed}
                  className="accent-default-blue size-4"
                  type="checkbox"
                  onChange={(event) => setFixed(event.target.checked)}
                />
                공지글로 등록
              </label>
            ) : null}
          </div>

          <label className="block space-y-1.5">
            <span className="text-default-label text-sm font-medium">제목</span>
            <input
              className="border-default-separator bg-default-surface text-default-label focus:border-default-blue h-11 w-full rounded-lg border px-3 text-sm outline-none"
              maxLength={30}
              placeholder="제목을 입력하세요"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            {fieldErrors.title ? (
              <span className="text-default-red text-xs">
                {fieldErrors.title}
              </span>
            ) : null}
          </label>

          <div className="space-y-1.5">
            <span className="text-default-label text-sm font-medium">내용</span>
            <ContentEditableEditor ref={editorRef} initialHtml={initialContent} />
            {fieldErrors.content ? (
              <p className="text-default-red text-xs">{fieldErrors.content}</p>
            ) : null}
          </div>

          <div className="space-y-3">
            <span className="text-default-label text-sm font-medium">첨부파일</span>
            <AttachmentUpload files={files} onChange={setFiles} />

            {attachments.length > 0 ? (
              <div className="space-y-2">
                <p className="text-default-secondary-label text-xs font-semibold">
                  기존 첨부파일
                </p>
                <ul className="border-default-separator overflow-hidden rounded-lg border">
                  {attachments.map((attachment) => (
                    <li
                      className="border-default-separator flex items-center justify-between gap-3 border-b px-4 py-2.5 last:border-b-0"
                      key={attachment.id}
                    >
                      <span className="text-default-label truncate text-sm">
                        {attachment.originalName ?? attachment.name}
                      </span>
                      <button
                        className="text-default-tertiary-label hover:bg-default-fill hover:text-default-red shrink-0 rounded-full p-1.5 transition"
                        type="button"
                        onClick={() => setAttachmentToDelete(attachment)}
                      >
                        <Trash2 aria-hidden className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <button
          className="border-default-separator bg-default-surface text-default-secondary-label hover:bg-default-fill inline-flex h-10 items-center gap-1.5 rounded-lg border px-4 text-sm font-semibold transition"
          type="button"
          onClick={() => router.push(cancelHref)}
        >
          <X aria-hidden className="size-4" />
          취소
        </button>
        <button
          className="bg-default-blue inline-flex h-10 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold text-white transition disabled:opacity-50"
          disabled={submitting}
          type="submit"
        >
          {submitting ? (
            <Loader2 aria-hidden className="size-4 animate-spin" />
          ) : (
            <Check aria-hidden className="size-4" />
          )}
          저장
        </button>
      </div>

      <Confirm
        confirmLabel="삭제"
        onCancel={() => setAttachmentToDelete(null)}
        onConfirm={handleDeleteAttachment}
        open={attachmentToDelete !== null}
        title="첨부파일을 삭제하시겠습니까?"
        tone="danger"
      >
        삭제한 첨부파일은 복구할 수 없습니다.
      </Confirm>
    </form>
  );
}
