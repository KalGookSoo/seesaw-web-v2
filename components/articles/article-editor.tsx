'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

import {
  SimpleEditor,
  type SimpleEditorProps
} from '@/components/tiptap-templates/simple/simple-editor';

export type ArticleEditorProps = SimpleEditorProps;

type ArticleEditorErrorBoundaryProps = Readonly<{
  children: ReactNode;
}>;

type ArticleEditorErrorBoundaryState = Readonly<{
  hasError: boolean;
}>;

class ArticleEditorErrorBoundary extends Component<
  ArticleEditorErrorBoundaryProps,
  ArticleEditorErrorBoundaryState
> {
  state: ArticleEditorErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ArticleEditorErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // 에디터 파싱 오류가 게시글 작성 페이지 전체로 전파되지 않도록 격리한다.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="border-default-separator bg-default-surface text-default-secondary-label flex min-h-64 flex-col items-center justify-center gap-3 border p-6 text-center">
          <p className="text-default-label text-sm font-semibold">본문 편집기를 불러오지 못했습니다.</p>
          <p className="text-xs leading-5">입력한 HTML 형식에 문제가 있어 편집기를 안전하게 중단했습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.</p>
          <button
            className="bg-default-label text-default-background px-4 py-2 text-xs font-semibold"
            type="button"
            onClick={() => window.location.reload()}
          >
            새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ArticleEditor(props: ArticleEditorProps) {
  return (
    <ArticleEditorErrorBoundary>
      <SimpleEditor {...props} />
    </ArticleEditorErrorBoundary>
  );
}
