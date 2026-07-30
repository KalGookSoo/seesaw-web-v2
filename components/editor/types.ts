export type EditorMode = 'wysiwyg' | 'markdown';

export type EditorHandle = Readonly<{
  getHTML: () => string;
  getMarkdown: () => string;
  setHTML: (html: string) => void;
  insertText: (text: string) => void;
}>;

/**
 * 이미지/동영상 업로드 등 외부 세계와 맞닿는 확장 포인트.
 * 실제 훅(addImageBlobHook 등)은 hooks 이슈(#86)에서 채운다 — 지금은 자리만 잡아둔다.
 */
export type EditorHooks = Readonly<Record<string, never>>;
