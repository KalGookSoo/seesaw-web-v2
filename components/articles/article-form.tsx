'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronDown, FileText, Loader2, Trash2, X } from 'lucide-react';

import type { AttachmentResponse } from '@/types/attachment';
import {
  createArticle,
  updateArticle,
  type ArticleMutationFailure
} from '@/lib/articles';
import { deleteAttachment } from '@/lib/attachments';
import { useAuth } from '@/hooks/use-auth';
import { AttachmentUpload } from '@/components/articles/attachment-upload';
import { ArticleEditor } from '@/components/articles/article-editor';
import { Confirm } from '@/components/ui/confirm';
import { useToast } from '@/components/ui/toast';

type ArticleFormMode = 'create' | 'edit';

type InlineFile = Readonly<{
  file: File;
  src: string;
}>;

function collectBlobSources(content: string, selector: string): Set<string> {
  const document = new DOMParser().parseFromString(content, 'text/html');
  return new Set(
    Array.from(document.querySelectorAll<HTMLImageElement | HTMLVideoElement>(selector))
      .map((element) => element.src)
      .filter((src) => src.startsWith('blob:'))
  );
}

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
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [fixed, setFixed] = useState(initialFixed);
  const [files, setFiles] = useState<File[]>([]);
  const [inlineImages, setInlineImages] = useState<InlineFile[]>([]);
  const [inlineVideos, setInlineVideos] = useState<InlineFile[]>([]);
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

    if (!isAuthenticated) {
      showToast('로그인이 필요합니다.', 'error');
      return;
    }

    setSubmitting(true);
    setFieldErrors({});

    const inlineImageSources = collectBlobSources(content, 'img[src]');
    const inlineVideoSources = collectBlobSources(content, 'video[src]');
    const command = {
      categoryId,
      type: 'HTML' as const,
      fixed,
      title,
      content,
      multipartFiles: files,
      inlineImages: inlineImages
        .filter((inlineFile) => inlineImageSources.has(inlineFile.src))
        .map((inlineFile) => inlineFile.file),
      inlineVideos: inlineVideos
        .filter((inlineFile) => inlineVideoSources.has(inlineFile.src))
        .map((inlineFile) => inlineFile.file)
    };

    const result =
      mode === 'create'
        ? await createArticle(command)
        : await updateArticle(articleId ?? '', command);

    setSubmitting(false);

    if (result.ok) {
      showToast(mode === 'create' ? '게시글을 등록했습니다.' : '게시글을 수정했습니다.', 'success');
      router.push(successHref);
      return;
    }

    const failure = result as ArticleMutationFailure;

    if (failure.status === 401) {
      showToast('로그인이 필요합니다.', 'error');
    } else if (failure.status === 403) {
      showToast('권한이 없습니다.', 'error');
    } else if (failure.status === 422) {
      const errors: Record<string, string> = {};
      failure.errors.forEach((error) => {
        errors[error.field] = error.message;
      });
      setFieldErrors(errors);
    } else {
      showToast(mode === 'create' ? '게시글을 등록하지 못했습니다.' : '게시글을 수정하지 못했습니다.', 'error');
    }
  }

  async function handleDeleteAttachment() {
    if (!attachmentToDelete || !isAuthenticated) {
      return;
    }

    try {
      await deleteAttachment(attachmentToDelete.id);
      setAttachments((current) =>
        current.filter((attachment) => attachment.id !== attachmentToDelete.id)
      );
      showToast('삭제되었습니다.', 'success');
    } catch {
      showToast('삭제에 실패했습니다.', 'error');
    } finally {
      setAttachmentToDelete(null);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <header className="space-y-3">
        <p className="text-default-tertiary-label text-[0.65rem] font-semibold tracking-[0.2em] uppercase">
          {mode === 'create' ? 'New article' : 'Edit article'}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-default-label text-2xl font-semibold tracking-tight">
            {mode === 'create' ? '새 게시글 작성' : '게시글 수정'}
            </h1>
            <p className="text-default-secondary-label mt-2 text-sm">{categoryName}</p>
          </div>
          <span className="text-default-tertiary-label text-xs">작성자 {mode === 'create' ? user?.username : createdBy}</span>
        </div>
      </header>

      <section className="border-default-separator bg-default-surface overflow-hidden border">
        <div className="border-default-separator border-b px-5 py-5 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <span className="text-default-tertiary-label text-xs">작성 설정</span>
            {canToggleFixed ? (
              <label className="text-default-secondary-label inline-flex items-center gap-2 text-sm">
                <input
                  checked={fixed}
                  className="form-choice"
                  type="checkbox"
                  onChange={(event) => setFixed(event.target.checked)}
                />
                공지글로 등록
              </label>
            ) : null}
          </div>
          <label className="mt-5 block">
            <input
              className="form-control border-x-0 border-t-0 border-b px-0 text-xl font-semibold tracking-tight"
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
        </div>

        <details className="group border-default-separator border-b">
          <summary className="text-default-label hover:bg-default-fill flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold transition [&::-webkit-details-marker]:hidden sm:px-7">
            <span className="flex min-w-0 items-center gap-2">
              <FileText aria-hidden className="size-4 shrink-0" />
              <span>첨부파일</span>
              <span className="text-default-tertiary-label">{files.length + attachments.length}</span>
            </span>
            <ChevronDown aria-hidden className="text-default-tertiary-label size-4 shrink-0 transition-transform group-open:rotate-180" />
          </summary>

          <div className="border-default-separator space-y-3 border-t px-5 py-5 sm:px-7">
            <div>
              <p className="text-default-label text-sm font-medium">파일 추가</p>
              <p className="text-default-tertiary-label mt-1 text-xs">본문에 삽입하지 않는 파일을 추가합니다.</p>
            </div>
            <AttachmentUpload files={files} onChange={setFiles} />

            {attachments.length > 0 ? (
              <div className="space-y-2">
                <p className="text-default-secondary-label text-xs font-semibold">기존 첨부파일</p>
                <ul className="border-default-separator overflow-hidden border">
                  {attachments.map((attachment) => (
                    <li className="border-default-separator flex items-center justify-between gap-3 border-b px-4 py-2.5 last:border-b-0" key={attachment.id}>
                      <span className="text-default-label truncate text-sm">{attachment.originalName ?? attachment.name}</span>
                      <button
                        className="text-default-tertiary-label hover:bg-default-fill hover:text-default-red focus-visible:outline-default-label shrink-0 p-1.5 transition focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
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
        </details>

        <div className="border-default-separator border-t">
          <div className="bg-default-fill border-default-separator flex items-center justify-between gap-3 border-b px-5 py-3 sm:px-7">
            <span className="text-default-label text-sm font-semibold">본문 편집</span>
            <span className="text-default-tertiary-label text-xs">서식과 미디어를 추가할 수 있습니다</span>
          </div>
          <div className="px-5 py-5 sm:px-7 sm:py-7">
            <ArticleEditor
              initialContent={initialContent}
              onChange={setContent}
              onInlineImage={(file, src) => setInlineImages((current) => [...current, { file, src }])}
              onInlineVideo={(file, src) => setInlineVideos((current) => [...current, { file, src }])}
              onImageError={(message) => showToast(message, 'error')}
            />
          </div>
            {fieldErrors.content ? (
              <p className="text-default-red text-xs">{fieldErrors.content}</p>
            ) : null}
        </div>

      </section>

      <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
        <button
          className="border-default-separator bg-default-surface text-default-secondary-label hover:bg-default-fill focus-visible:outline-default-label inline-flex h-11 items-center justify-center gap-1.5 border px-5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2"
          type="button"
          onClick={() => router.push(cancelHref)}
        >
          <X aria-hidden className="size-4" />
          취소
        </button>
        <button
          className="bg-default-label text-default-surface hover:bg-default-secondary-label focus-visible:outline-default-label inline-flex h-11 items-center justify-center gap-1.5 px-5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
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
