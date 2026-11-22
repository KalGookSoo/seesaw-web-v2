'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { mergeAttributes, Node } from '@tiptap/core';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { TableKit } from '@tiptap/extension-table';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  CheckSquare,
  ChevronDown,
  Heading2,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Minus,
  MoreHorizontal,
  Quote,
  Redo2,
  Strikethrough,
  Table2,
  Undo2,
  Video
} from 'lucide-react';

import styles from './article-editor.module.css';

const InlineVideo = Node.create({
  name: 'inlineVideo',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      'aria-label': { default: '본문 동영상' }
    };
  },
  parseHTML() {
    return [{ tag: 'video[src]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes)];
  }
});

type ArticleEditorProps = Readonly<{
  initialContent: string;
  onChange: (content: string) => void;
  onInlineImage: (file: File, src: string) => void;
  onInlineVideo: (file: File, src: string) => void;
  onImageError?: (message: string) => void;
}>;

type ToolbarButtonProps = Readonly<{
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}>;

const headingOptions = [
  { label: '본문', level: null },
  { label: '제목 1', level: 1 },
  { label: '제목 2', level: 2 },
  { label: '제목 3', level: 3 },
  { label: '제목 4', level: 4 },
  { label: '제목 5', level: 5 },
  { label: '제목 6', level: 6 }
] as const;

function TablePicker({
  onSelect
}: Readonly<{ onSelect: (rows: number, cols: number) => void }>) {
  const [hovered, setHovered] = useState({ rows: 0, cols: 0 });
  const rows = 6;
  const cols = 8;

  return (
    <div className="border-default-separator bg-default-surface absolute top-10 right-0 z-20 w-64 border p-3 shadow-xl">
      <div className="grid grid-cols-8 gap-px border border-default-separator bg-default-separator p-px">
        {Array.from({ length: rows * cols }, (_, index) => {
          const row = Math.floor(index / cols) + 1;
          const col = (index % cols) + 1;
          const active = row <= hovered.rows && col <= hovered.cols;
          return (
            <button
              aria-label={`${row}행 ${col}열 표 삽입`}
              className={`aspect-square border border-default-separator transition ${active ? 'bg-default-label' : 'bg-default-surface hover:bg-default-fill'}`}
              key={`${row}-${col}`}
              type="button"
              onClick={() => onSelect(row, col)}
              onMouseEnter={() => setHovered({ rows: row, cols: col })}
            />
          );
        })}
      </div>
      <p className="text-default-secondary-label mt-3 text-center text-xs font-semibold">
        {hovered.rows > 0 ? `${hovered.rows} × ${hovered.cols}` : '행과 열을 선택하세요'}
      </p>
    </div>
  );
}

function ToolbarButton({ label, active, disabled, onClick, onMouseDown, children }: ToolbarButtonProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={`inline-flex size-9 items-center justify-center border transition focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--default-label)] ${active ? 'bg-default-label text-default-surface' : 'border-transparent text-default-secondary-label hover:bg-default-fill hover:text-default-label'}`}
      disabled={disabled}
      type="button"
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function ArticleEditor({
  initialContent,
  onChange,
  onInlineImage,
  onInlineVideo,
  onImageError
}: ArticleEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [headingOpen, setHeadingOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      Image.configure({ allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TableKit.configure({
        table: { resizable: false }
      }),
      InlineVideo
    ],
    content: initialContent,
    immediatelyRender: false,
    // Tiptap React의 transaction 상태를 toolbar와 NodeView에 즉시 반영한다.
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        'aria-label': '게시글 본문'
      }
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent, { emitUpdate: false });
    }
  }, [editor, initialContent]);

  function insertImage(file: File) {
    if (!editor) return;
    const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!supportedImageTypes.includes(file.type)) {
      onImageError?.('본문에 삽입할 수 없는 이미지 형식입니다. JPEG, PNG, GIF, WebP, SVG 파일을 사용해 주세요.');
      return;
    }
    const src = URL.createObjectURL(file);
    editor.chain().focus().insertContent({ type: 'image', attrs: { src, alt: file.name } }).run();
    onInlineImage(file, src);
  }

  function insertVideo(file: File) {
    if (!editor) return;
    const src = URL.createObjectURL(file);
    editor.chain().focus().insertContent({ type: 'inlineVideo', attrs: { src } }).run();
    onInlineVideo(file, src);
  }

  function applyLink() {
    if (!editor) return;
    const href = linkUrl.trim();
    if (!href) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href, target: '_blank', rel: 'noopener noreferrer' }).run();
    }
    setLinkUrl('');
    setMoreOpen(false);
  }

  function openLinkEditor() {
    setLinkUrl(editor?.getAttributes('link').href ?? '');
    setMoreOpen(true);
  }

  function currentHeadingLabel() {
    const heading = headingOptions.find(({ level }) =>
      level === null ? !editor.isActive('heading') : editor.isActive('heading', { level })
    );
    return heading?.label ?? '본문';
  }

  function setHeading(level: number | null) {
    const chain = editor.chain().focus();
    if (level === null) {
      chain.setParagraph().run();
    } else {
      chain.toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
    }
    setHeadingOpen(false);
  }

  function insertTable(rows: number, cols: number) {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setTableOpen(false);
  }

  if (!editor) {
    return <div className="bg-default-fill min-h-[24rem] animate-pulse" />;
  }

  return (
    <div className="border-default-separator bg-default-surface overflow-hidden border">
      <div className="border-default-separator bg-default-fill/50 flex flex-wrap items-center gap-0.5 border-b px-2 py-1">
        <ToolbarButton label="굵게" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="size-4" /></ToolbarButton>
        <ToolbarButton label="기울임" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="size-4" /></ToolbarButton>
        <ToolbarButton label="취소선" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="size-4" /></ToolbarButton>
        <span className="bg-default-separator mx-1 h-5 w-px" />
        <div className="relative">
          <button aria-expanded={headingOpen} aria-label="문단 스타일" className="text-default-secondary-label hover:bg-default-fill focus-visible:outline-default-label inline-flex h-9 items-center gap-1 px-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-[-2px]" type="button" onClick={() => { setMoreOpen(false); setTableOpen(false); setHeadingOpen((open) => !open); }}>
            <Heading2 className="size-4" />
            <span>{currentHeadingLabel()}</span>
            <ChevronDown className="size-3" />
          </button>
          {headingOpen ? (
            <div className="border-default-separator bg-default-surface absolute top-10 left-0 z-20 flex w-32 flex-col border p-1 shadow-xl">
              {headingOptions.map(({ label, level }) => (
                <button className={`text-default-secondary-label hover:bg-default-fill hover:text-default-label px-3 py-2 text-left text-xs ${level !== null && editor.isActive('heading', { level }) || level === null && !editor.isActive('heading') ? 'bg-default-fill text-default-label font-semibold' : ''}`} key={label} type="button" onClick={() => setHeading(level)}>{label}</button>
              ))}
            </div>
          ) : null}
        </div>
        <ToolbarButton label="인용" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="size-4" /></ToolbarButton>
        <ToolbarButton label="글머리 목록" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="size-4" /></ToolbarButton>
        <ToolbarButton label="번호 목록" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="size-4" /></ToolbarButton>
        <ToolbarButton label="구분선" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="size-4" /></ToolbarButton>
        <ToolbarButton label="체크 목록" active={editor.isActive('taskList')} onClick={() => editor.chain().focus().toggleTaskList().run()}><CheckSquare className="size-4" /></ToolbarButton>
        <ToolbarButton label="내어쓰기" disabled={!editor.can().liftListItem('listItem')} onClick={() => editor.chain().focus().liftListItem('listItem').run()}><span className="text-sm font-semibold">←</span></ToolbarButton>
        <div className="relative">
          <ToolbarButton label="표 삽입" active={tableOpen} onClick={() => { setHeadingOpen(false); setMoreOpen(false); setTableOpen((open) => !open); }}><Table2 className="size-4" /></ToolbarButton>
          {tableOpen ? <TablePicker onSelect={insertTable} /> : null}
        </div>
        <label className="text-default-secondary-label hover:bg-default-fill relative inline-flex size-9 cursor-pointer items-center justify-center transition" title="글자색">
          <span className="text-lg font-semibold leading-none" style={{ color: editor.getAttributes('textStyle').color ?? 'currentColor' }}>A</span>
          <input aria-label="글자색" className="absolute inset-0 cursor-pointer opacity-0" type="color" value={editor.getAttributes('textStyle').color ?? '#3f4541'} onChange={(event) => editor.chain().focus().setColor(event.target.value).run()} />
        </label>
        <span className="bg-default-separator mx-1 h-5 w-px" />
        <div className="relative">
          <ToolbarButton label="추가 도구" active={moreOpen} onClick={() => { setHeadingOpen(false); setTableOpen(false); setMoreOpen((open) => !open); }}><MoreHorizontal className="size-4" /></ToolbarButton>
          {moreOpen ? (
            <div className="border-default-separator bg-default-surface absolute top-10 right-0 z-20 flex w-64 flex-col gap-2 border p-3 shadow-xl">
              <div className="flex flex-wrap gap-1">
                <ToolbarButton label="이미지 삽입" onClick={() => { setMoreOpen(false); imageInputRef.current?.click(); }}><ImageIcon className="size-4" /></ToolbarButton>
                <ToolbarButton label="동영상 삽입" onClick={() => { setMoreOpen(false); videoInputRef.current?.click(); }}><Video className="size-4" /></ToolbarButton>
                <ToolbarButton label="링크" active={editor.isActive('link')} onClick={openLinkEditor}><LinkIcon className="size-4" /></ToolbarButton>
                <ToolbarButton label="인라인 코드" active={editor.isActive('code')} onClick={() => { editor.chain().focus().toggleCode().run(); setMoreOpen(false); }}><span className="text-xs font-bold">&lt;/&gt;</span></ToolbarButton>
                <ToolbarButton label="코드 블록" active={editor.isActive('codeBlock')} onClick={() => { editor.chain().focus().toggleCodeBlock().run(); setMoreOpen(false); }}><span className="text-xs font-bold">CB</span></ToolbarButton>
              </div>
              {linkUrl !== '' || editor.isActive('link') ? (
                <div className="flex gap-1 border-t border-default-separator pt-2">
                  <input aria-label="링크 URL" className="border-default-separator bg-default-surface text-default-label min-w-0 flex-1 border px-2 text-xs outline-none focus-visible:border-default-label" placeholder="https://" value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') applyLink(); }} />
                  <button className="bg-default-label text-default-surface px-2 text-xs font-semibold" type="button" onClick={applyLink}>적용</button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <span className="ml-auto flex items-center">
          <ToolbarButton label="실행 취소" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 className="size-4" /></ToolbarButton>
          <ToolbarButton label="다시 실행" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 className="size-4" /></ToolbarButton>
        </span>
        <input ref={imageInputRef} accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml" className="sr-only" type="file" onChange={(event) => { const file = event.target.files?.[0]; if (file) insertImage(file); event.target.value = ''; }} />
        <input ref={videoInputRef} accept="video/mp4,video/webm" className="sr-only" type="file" onChange={(event) => { const file = event.target.files?.[0]; if (file) insertVideo(file); event.target.value = ''; }} />
      </div>
      <EditorContent className={styles.editor} editor={editor} />
      <p className="text-default-tertiary-label border-default-separator border-t px-4 py-2 text-xs">
        이미지와 동영상은 본문 위치에 삽입되며, 저장 시 업로드됩니다.
      </p>
    </div>
  );
}
