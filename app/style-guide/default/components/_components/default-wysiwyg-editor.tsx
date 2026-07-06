'use client';

import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import {
  AlignLeft,
  Bold,
  CheckSquare,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Indent,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Minus,
  Outdent,
  Quote,
  Strikethrough,
  Table2,
  X
} from 'lucide-react';

type PopupType = 'link' | 'image' | null;

const initialContent = `
<h2>대전포스트잇 7월 모임 안내</h2>
<p><strong>이번 달 모임</strong>은 도시와 독서, 느슨한 기록을 주제로 진행합니다.</p>
<blockquote>좋은 글은 정확한 문장보다 오래 머무는 분위기를 먼저 남깁니다.</blockquote>
<ul>
  <li>일시: 2026년 7월 18일 토요일 14:00</li>
  <li>장소: 대전 원도심 독립서점</li>
</ul>
`;

function ToolbarButton({
  children,
  label,
  onClick
}: Readonly<{
  children: ReactNode;
  label: string;
  onClick: () => void;
}>) {
  return (
    <button
      className="inline-flex size-9 items-center justify-center rounded-lg border border-[var(--default-separator)] bg-[var(--default-surface)] text-[var(--default-secondary-label)] transition hover:bg-[var(--default-fill)] hover:text-[var(--default-label)] focus:ring-4 focus:ring-[var(--default-blue)]/15 focus:outline-none"
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="h-7 w-px bg-[var(--default-separator)]" />;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function DefaultWysiwygEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [html, setHtml] = useState(initialContent);
  const [popupType, setPopupType] = useState<PopupType>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageDescription, setImageDescription] = useState('');

  const syncHtml = () => {
    setHtml(editorRef.current?.innerHTML ?? '');
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    savedRangeRef.current = selection.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    const range = savedRangeRef.current;
    const selection = window.getSelection();
    if (!range || !selection) {
      focusEditor();
      return;
    }

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const runCommand = (command: string, value?: string) => {
    focusEditor();
    document.execCommand(command, false, value);
    syncHtml();
  };

  const insertHtml = (value: string) => {
    focusEditor();
    restoreSelection();
    document.execCommand('insertHTML', false, value);
    syncHtml();
  };

  const openPopup = (type: Exclude<PopupType, null>) => {
    saveSelection();
    setPopupType(type);
  };

  const closePopup = () => {
    setPopupType(null);
    setLinkUrl('');
    setLinkText('');
    setImageUrl('');
    setImageDescription('');
  };

  const insertTable = () => {
    insertHtml(`
      <table>
        <thead>
          <tr><th>항목</th><th>내용</th><th>비고</th></tr>
        </thead>
        <tbody>
          <tr><td>일시</td><td>2026.07.18</td><td>토요일</td></tr>
          <tr><td>장소</td><td>대전 원도심</td><td>독립서점</td></tr>
        </tbody>
      </table>
    `);
  };

  const insertTask = () => {
    insertHtml(
      '<ul><li><label><input type="checkbox" /> 준비물 확인</label></li><li><label><input type="checkbox" /> 참석 여부 남기기</label></li></ul>'
    );
  };

  const insertCodeBlock = () => {
    insertHtml(
      '<pre><code>const message = "Seesaw editor";\nconsole.log(message);</code></pre>'
    );
  };

  const submitLink = () => {
    if (!linkUrl.trim()) {
      return;
    }

    const safeUrl = escapeHtml(linkUrl.trim());
    const safeText = escapeHtml(linkText.trim() || linkUrl.trim());
    insertHtml(
      `<a href="${safeUrl}" target="_blank" rel="noreferrer">${safeText}</a>`
    );
    closePopup();
  };

  const submitImage = () => {
    if (!imageUrl.trim()) {
      return;
    }

    const safeUrl = escapeHtml(imageUrl.trim());
    const safeDescription = escapeHtml(imageDescription.trim());
    insertHtml(
      `<figure><img src="${safeUrl}" alt="${safeDescription}" />${
        safeDescription ? `<figcaption>${safeDescription}</figcaption>` : ''
      }</figure>`
    );
    closePopup();
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    });
    reader.readAsDataURL(file);
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--default-separator)] bg-[var(--default-surface)] shadow-[var(--default-shadow)]">
      <header className="border-b border-[var(--default-separator)] bg-[var(--default-fill)] px-5 py-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[var(--default-blue)] uppercase">
              Rich Text Editor
            </p>
            <h3 className="mt-1 text-xl font-semibold text-[var(--default-label)]">
              WYSIWYG editor · live viewer
            </h3>
          </div>
          <p className="text-sm leading-6 text-[var(--default-secondary-label)]">
            왼쪽에서 편집하고 오른쪽에서 렌더링 결과를 바로 확인합니다.
          </p>
        </div>
      </header>

      <div className="grid min-h-[42rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex min-h-0 flex-col border-b border-[var(--default-separator)] lg:border-r lg:border-b-0">
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--default-separator)] bg-[var(--default-surface)] px-4 py-3">
            <ToolbarButton
              label="Heading 1"
              onClick={() => runCommand('formatBlock', 'h1')}
            >
              <Heading1 className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Heading 2"
              onClick={() => runCommand('formatBlock', 'h2')}
            >
              <Heading2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Heading 3"
              onClick={() => runCommand('formatBlock', 'h3')}
            >
              <Heading3 className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Paragraph"
              onClick={() => runCommand('formatBlock', 'p')}
            >
              <AlignLeft className="size-4" />
            </ToolbarButton>
            <ToolbarDivider />
            <ToolbarButton label="Bold" onClick={() => runCommand('bold')}>
              <Bold className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Italic" onClick={() => runCommand('italic')}>
              <Italic className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Strike"
              onClick={() => runCommand('strikeThrough')}
            >
              <Strikethrough className="size-4" />
            </ToolbarButton>
            <label
              className="inline-flex size-9 items-center justify-center rounded-lg border border-[var(--default-separator)] bg-[var(--default-surface)] text-[var(--default-secondary-label)] transition hover:bg-[var(--default-fill)] hover:text-[var(--default-label)]"
              title="Text color"
              aria-label="Text color"
            >
              <span className="sr-only">Text color</span>
              <input
                className="size-5 cursor-pointer rounded-full border-0 bg-transparent p-0"
                type="color"
                defaultValue="#007aff"
                onChange={(event) =>
                  runCommand('foreColor', event.target.value)
                }
              />
            </label>
            <ToolbarDivider />
            <ToolbarButton
              label="Horizontal line"
              onClick={() => runCommand('insertHorizontalRule')}
            >
              <Minus className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Blockquote"
              onClick={() => runCommand('formatBlock', 'blockquote')}
            >
              <Quote className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Unordered list"
              onClick={() => runCommand('insertUnorderedList')}
            >
              <List className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Ordered list"
              onClick={() => runCommand('insertOrderedList')}
            >
              <ListOrdered className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Task list" onClick={insertTask}>
              <CheckSquare className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Indent" onClick={() => runCommand('indent')}>
              <Indent className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Outdent"
              onClick={() => runCommand('outdent')}
            >
              <Outdent className="size-4" />
            </ToolbarButton>
            <ToolbarDivider />
            <ToolbarButton label="Insert table" onClick={insertTable}>
              <Table2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Insert link"
              onClick={() => openPopup('link')}
            >
              <LinkIcon className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Insert image"
              onClick={() => openPopup('image')}
            >
              <ImagePlus className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Insert codeblock" onClick={insertCodeBlock}>
              <Code2 className="size-4" />
            </ToolbarButton>
          </div>

          <div
            ref={editorRef}
            className="min-h-[34rem] flex-1 overflow-auto bg-[var(--default-surface)] px-6 py-5 text-base leading-7 text-[var(--default-label)] outline-none [&_a]:text-[var(--default-blue)] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--default-blue)] [&_blockquote]:bg-[var(--default-blue-soft)] [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:text-[var(--default-blue-contrast)] [&_code]:rounded-md [&_code]:bg-[var(--default-fill)] [&_code]:px-1.5 [&_code]:py-0.5 [&_figcaption]:mt-2 [&_figcaption]:text-sm [&_figcaption]:text-[var(--default-secondary-label)] [&_figure]:my-5 [&_h1]:mb-4 [&_h1]:text-4xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:text-3xl [&_h2]:font-semibold [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-semibold [&_hr]:my-6 [&_hr]:border-[var(--default-separator)] [&_img]:max-h-80 [&_img]:rounded-2xl [&_img]:border [&_img]:border-[var(--default-separator)] [&_img]:object-cover [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_pre]:my-5 [&_pre]:overflow-auto [&_pre]:rounded-2xl [&_pre]:bg-[var(--default-label)] [&_pre]:p-4 [&_pre]:text-[var(--default-background)] [&_table]:my-5 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[var(--default-separator)] [&_td]:p-3 [&_th]:border [&_th]:border-[var(--default-separator)] [&_th]:bg-[var(--default-fill)] [&_th]:p-3 [&_th]:text-left [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
            contentEditable
            suppressContentEditableWarning
            onBlur={saveSelection}
            onInput={syncHtml}
            dangerouslySetInnerHTML={{ __html: initialContent }}
          />
        </div>

        <div className="flex min-h-0 flex-col bg-[var(--default-surface-grouped)]">
          <div className="border-b border-[var(--default-separator)] px-5 py-4">
            <p className="text-xs font-semibold tracking-widest text-[var(--default-secondary-label)] uppercase">
              Viewer
            </p>
            <h4 className="mt-1 text-lg font-semibold text-[var(--default-label)]">
              Parsed result
            </h4>
          </div>
          <article
            className="min-h-[34rem] flex-1 overflow-auto p-6 text-base leading-7 text-[var(--default-label)] [&_a]:text-[var(--default-blue)] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--default-blue)] [&_blockquote]:bg-[var(--default-blue-soft)] [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:text-[var(--default-blue-contrast)] [&_code]:rounded-md [&_code]:bg-[var(--default-fill)] [&_code]:px-1.5 [&_code]:py-0.5 [&_figcaption]:mt-2 [&_figcaption]:text-sm [&_figcaption]:text-[var(--default-secondary-label)] [&_figure]:my-5 [&_h1]:mb-4 [&_h1]:text-4xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:text-3xl [&_h2]:font-semibold [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-semibold [&_hr]:my-6 [&_hr]:border-[var(--default-separator)] [&_img]:max-h-80 [&_img]:rounded-2xl [&_img]:border [&_img]:border-[var(--default-separator)] [&_img]:object-cover [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_pre]:my-5 [&_pre]:overflow-auto [&_pre]:rounded-2xl [&_pre]:bg-[var(--default-label)] [&_pre]:p-4 [&_pre]:text-[var(--default-background)] [&_table]:my-5 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[var(--default-separator)] [&_td]:p-3 [&_th]:border [&_th]:border-[var(--default-separator)] [&_th]:bg-[var(--default-fill)] [&_th]:p-3 [&_th]:text-left [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      {popupType ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-sm">
          <button
            className="absolute inset-0 cursor-default"
            type="button"
            aria-label="팝업 닫기"
            onClick={closePopup}
          />
          <section className="relative w-full max-w-lg rounded-3xl border border-[var(--default-separator)] bg-[var(--default-surface)] shadow-[var(--default-shadow)]">
            <header className="flex items-start justify-between gap-4 border-b border-[var(--default-separator)] px-5 py-4">
              <div>
                <p className="text-xs font-semibold tracking-widest text-[var(--default-blue)] uppercase">
                  Insert {popupType}
                </p>
                <h4 className="mt-1 text-xl font-semibold text-[var(--default-label)]">
                  {popupType === 'link' ? '링크 삽입' : '이미지 삽입'}
                </h4>
              </div>
              <button
                className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--default-fill)] text-[var(--default-secondary-label)] transition hover:text-[var(--default-label)]"
                type="button"
                aria-label="닫기"
                onClick={closePopup}
              >
                <X className="size-4" />
              </button>
            </header>
            <div className="space-y-4 px-5 py-5">
              {popupType === 'link' ? (
                <>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-[var(--default-label)]">
                      URL
                    </span>
                    <input
                      className="h-11 w-full rounded-xl border border-[var(--default-separator)] bg-[var(--default-fill)] px-3 text-sm text-[var(--default-label)] outline-none focus:border-[var(--default-blue)] focus:ring-4 focus:ring-[var(--default-blue)]/15"
                      value={linkUrl}
                      placeholder="https://seesaw.me.kr"
                      onChange={(event) => setLinkUrl(event.target.value)}
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-[var(--default-label)]">
                      Link text
                    </span>
                    <input
                      className="h-11 w-full rounded-xl border border-[var(--default-separator)] bg-[var(--default-fill)] px-3 text-sm text-[var(--default-label)] outline-none focus:border-[var(--default-blue)] focus:ring-4 focus:ring-[var(--default-blue)]/15"
                      value={linkText}
                      placeholder="링크 텍스트"
                      onChange={(event) => setLinkText(event.target.value)}
                    />
                  </label>
                </>
              ) : (
                <>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-[var(--default-label)]">
                      Choose a file
                    </span>
                    <input
                      className="w-full rounded-xl border border-[var(--default-separator)] bg-[var(--default-fill)] px-3 py-2 text-sm text-[var(--default-label)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--default-blue)] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-[var(--default-label)]">
                      Image URL
                    </span>
                    <input
                      className="h-11 w-full rounded-xl border border-[var(--default-separator)] bg-[var(--default-fill)] px-3 text-sm text-[var(--default-label)] outline-none focus:border-[var(--default-blue)] focus:ring-4 focus:ring-[var(--default-blue)]/15"
                      value={imageUrl}
                      placeholder="https://..."
                      onChange={(event) => setImageUrl(event.target.value)}
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-[var(--default-label)]">
                      Description
                    </span>
                    <input
                      className="h-11 w-full rounded-xl border border-[var(--default-separator)] bg-[var(--default-fill)] px-3 text-sm text-[var(--default-label)] outline-none focus:border-[var(--default-blue)] focus:ring-4 focus:ring-[var(--default-blue)]/15"
                      value={imageDescription}
                      placeholder="이미지 설명"
                      onChange={(event) =>
                        setImageDescription(event.target.value)
                      }
                    />
                  </label>
                </>
              )}
            </div>
            <footer className="flex justify-end gap-2 border-t border-[var(--default-separator)] bg-[var(--default-surface-grouped)] px-5 py-4">
              <button
                className="rounded-xl border border-[var(--default-separator)] bg-[var(--default-surface)] px-4 py-2 text-sm font-semibold text-[var(--default-label)] transition hover:bg-[var(--default-fill)]"
                type="button"
                onClick={closePopup}
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-[var(--default-blue)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--default-blue-muted)]"
                type="button"
                onClick={popupType === 'link' ? submitLink : submitImage}
              >
                OK
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </section>
  );
}
