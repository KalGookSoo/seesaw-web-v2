export type EditorMode = 'wysiwyg' | 'markdown';

export type EditorHandle = Readonly<{
  getHTML: () => string;
  getMarkdown: () => string;
  setHTML: (html: string) => void;
  insertText: (text: string) => void;
}>;

type BlobInsertCallback = (url: string, altText?: string) => void;

/**
 * 이미지/동영상 업로드 등 외부 세계와 맞닿는 확장 포인트.
 * 훅을 제공하지 않으면 로컬 blob URL을 그대로 쓰는 기본 동작으로 대체된다.
 * onChange는 코어 이슈(#80)에서 이미 Editor의 별도 prop으로 존재해 여기서는 다루지 않는다.
 */
export type EditorHooks = Readonly<{
  addImageBlobHook?: (file: File, callback: BlobInsertCallback) => void;
  addVideoBlobHook?: (file: File, callback: BlobInsertCallback) => void;
  onModeChange?: (mode: EditorMode) => void;
}>;
