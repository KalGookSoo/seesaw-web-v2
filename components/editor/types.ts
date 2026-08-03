export type EditorMode = 'wysiwyg' | 'markdown';

/**
 * 현재 커서(선택 영역) 위치의 서식 상태. selectionchange마다 다시 계산된다.
 * fontSize/color/backgroundColor/textAlign/lineHeight는 해당 서식이 적용되어 있지 않으면 null이다.
 */
export type EditorActiveFormats = Readonly<{
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  inlineCode: boolean;
  blockTag: string;
  unorderedList: boolean;
  orderedList: boolean;
  taskList: boolean;
  fontSize: string | null;
  color: string | null;
  backgroundColor: string | null;
  textAlign: 'left' | 'center' | 'right' | 'justify' | null;
  lineHeight: string | null;
}>;

export type EditorHandle = Readonly<{
  getHTML: () => string;
  getMarkdown: () => string;
  setHTML: (html: string) => void;
  insertText: (text: string) => void;
  getActiveFormats: () => EditorActiveFormats;
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
  onFormatChange?: (formats: EditorActiveFormats) => void;
}>;
