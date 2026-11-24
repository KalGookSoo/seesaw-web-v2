'use client';

import { useState } from 'react';
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
  const bodyCharacterCount = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().length;

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
    <form className="min-w-0 space-y-6" onSubmit={handleSubmit}>
      <header className="border-default-separator space-y-5 border-b pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-default-primary text-[0.65rem] font-bold tracking-[0.22em] uppercase">
            게시판 · {mode === 'create' ? '새 게시글' : '게시글 수정'}
          </p>
          <span className="text-default-tertiary-label text-[0.65rem] font-semibold tracking-[0.18em] uppercase">
            {categoryName}
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-end">
          <div>
            <h1 className="text-default-label text-3xl font-black tracking-[-0.05em] text-balance sm:text-4xl">
              {mode === 'create' ? '새 게시글 작성' : '게시글 수정'}
            </h1>
            <p className="text-default-secondary-label mt-4 max-w-xl text-sm leading-7">
              게시판에 공유할 내용을 작성해주세요.
            </p>
          </div>
          <dl className="border-default-separator border-l pl-4 text-xs sm:justify-self-end">
            <dt className="text-default-tertiary-label font-semibold tracking-[0.16em] uppercase">작성자</dt>
            <dd className="text-default-label mt-2 font-semibold">{mode === 'create' ? user?.username : createdBy}</dd>
          </dl>
        </div>
      </header>

      <section className="space-y-4">
        <div className="border-default-separator bg-default-surface border px-5 py-5 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <span className="text-default-tertiary-label text-[0.65rem] font-bold tracking-[0.18em] uppercase">01 · 제목</span>
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
              className="form-control border-x-0 border-t-0 border-b px-0 text-3xl font-black tracking-[-0.04em] sm:text-4xl"
              maxLength={30}
              placeholder="게시글 제목을 입력하세요"
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

        <div className="border-default-separator bg-default-surface border">
          <div className="border-default-separator flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-7">
            <span className="text-default-tertiary-label text-[0.65rem] font-bold tracking-[0.18em] uppercase">02 · 본문</span>
            <span className="text-default-tertiary-label text-xs">문장과 이미지를 한 편의 읽기 흐름으로 편집합니다</span>
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
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-5 sm:px-7 sm:pb-7">
              {fieldErrors.content ? (
                <p className="text-default-red text-xs">{fieldErrors.content}</p>
              ) : (
                <p className="text-default-tertiary-label text-xs">본문은 저장 후에도 계속 다듬을 수 있습니다.</p>
              )}
              <span className="text-default-tertiary-label text-xs">{bodyCharacterCount.toLocaleString('ko-KR')}자</span>
            </div>
        </div>

        <section className="border-default-separator bg-default-surface border px-5 py-5 sm:px-7 sm:py-6" aria-labelledby="attachment-section-title">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p id="attachment-section-title" className="text-default-tertiary-label text-[0.65rem] font-bold tracking-[0.18em] uppercase">03 · 첨부파일</p>
              <p className="text-default-label mt-2 text-sm font-semibold">본문을 보완하는 파일을 추가하세요</p>
              <p className="text-default-tertiary-label mt-1 text-xs">이미지와 참고 파일을 게시글에 연결할 수 있습니다.</p>
            </div>
            <span className="text-default-secondary-label text-xs">{files.length + attachments.length}개 첨부</span>
          </div>

          <div className="mt-5">
            <AttachmentUpload files={files} onChange={setFiles} />
          </div>

          {attachments.length > 0 ? (
            <div className="mt-5">
              <p className="text-default-secondary-label mb-2 text-[0.65rem] font-bold tracking-[0.16em] uppercase">기존 첨부파일</p>
              <ul className="border-default-separator overflow-hidden border">
                {attachments.map((attachment) => (
                  <li className="border-default-separator flex items-center justify-between gap-3 border-b px-4 py-3 last:border-b-0" key={attachment.id}>
                    <span className="text-default-label truncate text-sm">{attachment.originalName ?? attachment.name}</span>
                    <button
                      className="text-default-tertiary-label hover:bg-default-fill hover:text-default-red focus-visible:outline-default-label shrink-0 p-1.5 transition focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                      type="button"
                      aria-label={`${attachment.originalName ?? attachment.name} 삭제`}
                      onClick={() => setAttachmentToDelete(attachment)}
                    >
                      <Trash2 aria-hidden className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

      </section>

      <section className="border-default-separator bg-default-surface grid gap-5 border px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-start sm:px-7">
        <div>
          <p className="text-default-primary text-[0.65rem] font-bold tracking-[0.18em] uppercase">04 · 게시 전 확인</p>
          <p className="text-default-secondary-label mt-2 max-w-xl text-sm leading-6">게시글의 기본 요소를 한 번 더 확인하세요.</p>
        </div>
        <ul className="grid gap-2 text-xs sm:min-w-56">
          <li className="text-default-label flex items-center justify-between gap-4">
            <span>제목</span><span className={title.trim() ? 'text-default-primary font-semibold' : 'text-default-red font-semibold'}>{title.trim() ? '완료' : '필요'}</span>
          </li>
          <li className="text-default-label flex items-center justify-between gap-4">
            <span>본문</span><span className={bodyCharacterCount > 0 ? 'text-default-primary font-semibold' : 'text-default-red font-semibold'}>{bodyCharacterCount > 0 ? '완료' : '필요'}</span>
          </li>
          <li className="text-default-label flex items-center justify-between gap-4">
            <span>참고 자료</span><span className={files.length + attachments.length > 0 ? 'text-default-primary font-semibold' : 'text-default-secondary-label'}>{files.length + attachments.length > 0 ? '첨부됨' : '선택 사항'}</span>
          </li>
        </ul>
      </section>

      <div className="border-default-separator flex flex-col-reverse justify-between gap-4 border-t pt-5 sm:flex-row sm:items-center">
        <p className="text-default-tertiary-label text-xs">게시하기 전까지 작성 내용은 저장되지 않습니다.</p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
        <button
          className="border-default-separator bg-default-surface text-default-secondary-label hover:bg-default-fill focus-visible:outline-default-label inline-flex h-11 items-center justify-center gap-1.5 border px-5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2"
          type="button"
          onClick={() => router.push(cancelHref)}
        >
          <X aria-hidden className="size-4" />
          취소
        </button>
        <button
          className="bg-default-primary text-white hover:bg-default-primary-muted focus-visible:outline-default-label inline-flex h-11 items-center justify-center gap-1.5 px-5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-[-2px] disabled:opacity-50"
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
