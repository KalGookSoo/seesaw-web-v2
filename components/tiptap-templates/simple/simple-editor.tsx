"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { mergeAttributes, Node } from "@tiptap/core"
import sanitizeHtml from "sanitize-html"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import {
  BulletList,
  OrderedList,
  TaskItem,
  TaskList,
} from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { FindAndReplace } from "@tiptap/extension-find-and-replace"
import { TableKit } from "@tiptap/extension-table"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"
import {
  SearchAndReplace,
  SearchAndReplaceButton,
} from "@/components/tiptap-ui/search-and-replace"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"
import { Code2, MoreHorizontal, Table2, VideoIcon, X } from "lucide-react"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

const SEARCH_AND_REPLACE_SCROLL_OPTIONS: ScrollIntoViewOptions = {
  block: "center",
}

const INLINE_IMAGE_MAX_SIZE = 50 * 1024 * 1024
const INLINE_VIDEO_MAX_SIZE = 200 * 1024 * 1024
const INLINE_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/heic",
  "image/heif",
]
const INLINE_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"]

function getMediaType(file: File): string {
  const type = file.type.toLowerCase()
  if (type === "video/quicktime" || type === "image/heic" || type === "image/heif") {
    return type
  }

  const extension = file.name.split(".").pop()?.toLowerCase()
  if (extension === "heic") return "image/heic"
  if (extension === "heif") return "image/heif"
  if (extension === "mov") return "video/quicktime"
  return type
}

function normalizeHtmlSource(source: string): string {
  const fencedSource = source.trim().match(/^```(?:html|xml)?\s*([\s\S]*?)\s*```$/i)?.[1] ?? source

  return fencedSource
    .replace(/&(?:nbsp|#160|#xA0);?/gi, " ")
    .replace(/\u00a0/g, " ")
    .normalize("NFC")
}

async function prepareImageFile(file: File): Promise<File> {
  const mediaType = getMediaType(file)
  if (mediaType !== "image/heic" && mediaType !== "image/heif") {
    return file
  }

  const { default: heic2any } = await import("heic2any")
  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.92,
  })
  const blob = Array.isArray(converted) ? converted[0] : converted
  const filename = file.name.replace(/\.(heic|heif)$/i, ".jpg")
  return new File([blob], filename, { type: "image/jpeg" })
}

const InlineVideo = Node.create({
  name: "inlineVideo",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      "aria-label": { default: "본문 동영상" },
    }
  },
  parseHTML() {
    return [{ tag: "video[src]" }]
  },
  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes(HTMLAttributes)]
  },
})

const HtmlContainer = Node.create({
  name: "htmlContainer",
  group: "block",
  content: "block+",
  defining: true,
  addAttributes() {
    return {
      class: { default: null },
      style: { default: null },
    }
  },
  parseHTML() {
    return [{ tag: "div" }]
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes), 0]
  },
})

const StyledBulletList = BulletList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: { default: null },
      style: { default: null },
    }
  },
})

const StyledOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: { default: null },
      style: { default: null },
    }
  },
})

export type SimpleEditorProps = Readonly<{
  initialContent: string
  onChange: (content: string) => void
  onInlineImage: (file: File, src: string) => void
  onInlineVideo: (file: File, src: string) => void
  onImageError?: (message: string) => void
}>

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  onSearchAndReplaceClick,
  isSearchAndReplaceOpen,
  searchAndReplaceButtonRef,
  isMobile,
  onVideoClick,
  onTableClick,
  onHtmlClick,
  isOverflowOpen,
  onOverflowToggle,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  onSearchAndReplaceClick: () => void
  isSearchAndReplaceOpen: boolean
  searchAndReplaceButtonRef: React.RefObject<HTMLButtonElement | null>
  isMobile: boolean
  onVideoClick: () => void
  onTableClick: () => void
  onHtmlClick: () => void
  isOverflowOpen: boolean
  onOverflowToggle: () => void
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]} />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <div className="simple-editor-toolbar-more">
        <Button
          aria-expanded={isOverflowOpen}
          aria-haspopup="menu"
          aria-label="추가 편집 도구"
          showTooltip
          tooltip="추가 편집 도구"
          onClick={onOverflowToggle}
        >
          <MoreHorizontal className="tiptap-button-icon" />
        </Button>
        {isOverflowOpen ? (
          <div className="simple-editor-toolbar-menu" role="menu">
            <div className="simple-editor-toolbar-menu-group" role="group">
              <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]} />
              <ListDropdownMenu modal={false} types={["bulletList", "orderedList", "taskList"]} />
              <BlockquoteButton />
              <CodeBlockButton />
            </div>
            <div className="simple-editor-toolbar-menu-group" role="group">
              <MarkButton type="code" />
              <MarkButton type="underline" />
              {!isMobile ? <ColorHighlightPopover /> : <ColorHighlightPopoverButton onClick={onHighlighterClick} />}
              {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
              <MarkButton type="superscript" />
              <MarkButton type="subscript" />
            </div>
            <div className="simple-editor-toolbar-menu-group" role="group">
              <Button aria-label="표 삽입" showTooltip tooltip="표 삽입" onClick={onTableClick}>
                <Table2 className="tiptap-button-icon" />
              </Button>
              <Button aria-label="HTML 삽입" showTooltip tooltip="HTML 삽입" onClick={onHtmlClick}>
                <Code2 className="tiptap-button-icon" />
              </Button>
              <Button aria-label="동영상 삽입" showTooltip tooltip="동영상 삽입" onClick={onVideoClick}>
                <VideoIcon className="tiptap-button-icon" />
              </Button>
              <ImageUploadButton aria-label="이미지 삽입" />
            </div>
          </div>
        ) : null}
      </div>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <SearchAndReplaceButton
          ref={searchAndReplaceButtonRef}
          aria-expanded={isSearchAndReplaceOpen}
          data-active-state={isSearchAndReplaceOpen ? "on" : "off"}
          onClick={onSearchAndReplaceClick}
        />
        <ThemeToggle />
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export function SimpleEditor({
  initialContent,
  onChange,
  onInlineImage,
  onInlineVideo,
  onImageError,
}: SimpleEditorProps) {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )
  const [isSearchAndReplaceOpen, setIsSearchAndReplaceOpen] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const searchAndReplaceButtonRef = useRef<HTMLButtonElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const insertSelectionRef = useRef<{ from: number; to: number } | null>(null)
  const [tableDialogOpen, setTableDialogOpen] = useState(false)
  const [htmlDialogOpen, setHtmlDialogOpen] = useState(false)
  const [tableRows, setTableRows] = useState("3")
  const [tableColumns, setTableColumns] = useState("3")
  const [htmlSource, setHtmlSource] = useState("")
  const [isOverflowOpen, setIsOverflowOpen] = useState(false)

  const uploadInlineImage = useCallback(
    async (file: File) => {
      if (!INLINE_IMAGE_TYPES.includes(getMediaType(file))) {
        throw new Error(
          "본문에 삽입할 수 없는 이미지 형식입니다. JPEG, PNG, GIF, WebP, SVG, HEIC, HEIF 파일을 사용해 주세요."
        )
      }
      if (file.size > INLINE_IMAGE_MAX_SIZE) {
        throw new Error("본문 이미지는 최대 50MB까지 첨부할 수 있습니다.")
      }
      let preparedFile: File
      try {
        preparedFile = await prepareImageFile(file)
      } catch {
        throw new Error("HEIC/HEIF 이미지를 미리보기용 JPEG로 변환하지 못했습니다.")
      }
      const src = URL.createObjectURL(preparedFile)
      onInlineImage(preparedFile, src)
      return src
    },
    [onInlineImage]
  )

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor markdown-body",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      StyledBulletList,
      StyledOrderedList,
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      FindAndReplace.configure({
        searchDebounceMs: 500,
        injectCSS: false,
      }),
      TableKit.configure({
        table: {
          resizable: true,
          HTMLAttributes: {
            class: "simple-editor-table",
          },
        },
      }),
      HtmlContainer,
      ImageUploadNode.configure({
        accept: INLINE_IMAGE_TYPES.join(","),
        maxSize: INLINE_IMAGE_MAX_SIZE,
        limit: 3,
        upload: uploadInlineImage,
        onError: (error) => onImageError?.(error.message),
      }),
      InlineVideo,
    ],
    content: initialContent,
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  const openSearchAndReplace = useCallback(() => {
    setMobileView("main")
    setIsSearchAndReplaceOpen(true)
  }, [])

  const closeSearchAndReplace = useCallback(() => {
    setIsSearchAndReplaceOpen(false)
    searchAndReplaceButtonRef.current?.focus()
  }, [])

  const toggleSearchAndReplace = useCallback(() => {
    if (isSearchAndReplaceOpen) {
      closeSearchAndReplace()
      return
    }

    openSearchAndReplace()
  }, [closeSearchAndReplace, isSearchAndReplaceOpen, openSearchAndReplace])

  const insertTable = useCallback(() => {
    const rows = Math.min(20, Math.max(1, Number.parseInt(tableRows, 10) || 3))
    const cols = Math.min(10, Math.max(1, Number.parseInt(tableColumns, 10) || 3))

    editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
    setTableDialogOpen(false)
  }, [editor, tableColumns, tableRows])

  const insertHtml = useCallback(() => {
    try {
      const sanitizedHtml = sanitizeHtml(normalizeHtmlSource(htmlSource), {
        allowedTags: [
          "a", "blockquote", "br", "code", "del", "div", "em", "h1", "h2", "h3", "h4", "h5", "h6",
          "hr", "img", "li", "ol", "p", "pre", "s", "span", "strong", "sub", "sup", "table", "tbody",
          "td", "tfoot", "th", "thead", "tr", "u", "ul", "video"
        ],
        allowedAttributes: {
          "*": ["class", "style"],
          a: ["href", "target", "rel"],
          img: ["src", "alt", "title"],
          td: ["colspan", "rowspan"],
          th: ["colspan", "rowspan"],
          video: ["src", "controls", "poster"]
        },
        allowedSchemes: ["http", "https", "mailto"],
        allowedSchemesByTag: {
          a: ["http", "https", "mailto"],
          img: ["http", "https", "data"],
          video: ["http", "https"]
        }
      })

      if (!sanitizedHtml.trim()) {
        throw new Error("삽입할 수 있는 HTML 요소가 없습니다.")
      }

      if (!editor) {
        throw new Error("에디터가 아직 준비되지 않았습니다.")
      }

      const selection = insertSelectionRef.current
      const chain = editor.chain().focus()
      if (selection) {
        chain.setTextSelection(selection)
      }
      const inserted = chain.insertContent(sanitizedHtml, {
        parseOptions: { preserveWhitespace: false },
      }).run()
      if (!inserted) {
        throw new Error("HTML을 에디터 문서로 변환하지 못했습니다.")
      }

      setHtmlSource("")
      setHtmlDialogOpen(false)
    } catch (error) {
      onImageError?.(
        error instanceof Error
          ? `HTML 코드를 삽입하지 못했습니다: ${error.message}`
          : "HTML 코드를 삽입하지 못했습니다. HTML 형식을 확인해 주세요."
      )
    } finally {
      insertSelectionRef.current = null
    }
  }, [editor, htmlSource, onImageError])

  // 공식 EditorProvider와 동일하게, Editor 인스턴스가 준비된 뒤에만 UI를 마운트한다.
  // 먼저 toolbar가 마운트되면 UI 컴포넌트가 null editor 상태를 구독한 채 남을 수 있다.
  if (!editor) {
    return <div className="simple-editor-wrapper" aria-busy="true" />
  }

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              onSearchAndReplaceClick={toggleSearchAndReplace}
              isSearchAndReplaceOpen={isSearchAndReplaceOpen}
              searchAndReplaceButtonRef={searchAndReplaceButtonRef}
              isMobile={isMobile}
              onVideoClick={() => videoInputRef.current?.click()}
              onTableClick={() => {
                if (editor) {
                  insertSelectionRef.current = {
                    from: editor.state.selection.from,
                    to: editor.state.selection.to,
                  }
                }
                setTableDialogOpen(true)
              }}
              onHtmlClick={() => {
                if (editor) {
                  insertSelectionRef.current = {
                    from: editor.state.selection.from,
                    to: editor.state.selection.to,
                  }
                }
                setHtmlDialogOpen(true)
              }}
              isOverflowOpen={isOverflowOpen}
              onOverflowToggle={() => setIsOverflowOpen((open) => !open)}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <SearchAndReplace
          className="simple-editor-search-and-replace"
          open={isSearchAndReplaceOpen}
          onOpen={openSearchAndReplace}
          onClose={closeSearchAndReplace}
          scrollIntoViewOptions={SEARCH_AND_REPLACE_SCROLL_OPTIONS}
        />

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
        <input
          ref={videoInputRef}
          accept={INLINE_VIDEO_TYPES.concat(".mov").join(",")}
          className="sr-only"
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (!file) {
              event.target.value = ""
              return
            }
            if (!INLINE_VIDEO_TYPES.includes(getMediaType(file))) {
              onImageError?.("본문에 삽입할 수 없는 동영상 형식입니다. MP4, WebM 또는 MOV 파일을 사용해 주세요.")
            } else if (file.size > INLINE_VIDEO_MAX_SIZE) {
              onImageError?.("본문 동영상은 최대 200MB까지 첨부할 수 있습니다.")
            } else if (editor) {
              const src = URL.createObjectURL(file)
              editor.chain().focus().insertContent({ type: "inlineVideo", attrs: { src } }).run()
              onInlineVideo(file, src)
            }
            event.target.value = ""
          }}
        />

        {tableDialogOpen ? (
          <div className="simple-editor-dialog-backdrop" role="presentation">
            <div className="simple-editor-dialog" role="dialog" aria-modal="true" aria-labelledby="table-dialog-title">
              <div className="simple-editor-dialog-header">
                <div>
                  <p id="table-dialog-title" className="simple-editor-dialog-title">표 삽입</p>
                  <p className="simple-editor-dialog-description">표의 행과 열을 지정합니다.</p>
                </div>
                <button type="button" className="simple-editor-dialog-close" aria-label="표 삽입 닫기" onClick={() => setTableDialogOpen(false)}>
                  <X className="size-4" />
                </button>
              </div>
              <div className="simple-editor-dialog-fields">
                <label>행<input min="1" max="20" type="number" value={tableRows} onChange={(event) => setTableRows(event.target.value)} /></label>
                <label>열<input min="1" max="10" type="number" value={tableColumns} onChange={(event) => setTableColumns(event.target.value)} /></label>
              </div>
              <div className="simple-editor-dialog-actions">
                <button type="button" className="simple-editor-dialog-secondary" onClick={() => setTableDialogOpen(false)}>취소</button>
                <button type="button" className="simple-editor-dialog-primary" onClick={insertTable}>삽입</button>
              </div>
            </div>
          </div>
        ) : null}

        {htmlDialogOpen ? (
          <div className="simple-editor-dialog-backdrop" role="presentation">
            <div className="simple-editor-dialog simple-editor-html-dialog" role="dialog" aria-modal="true" aria-labelledby="html-dialog-title">
              <div className="simple-editor-dialog-header">
                <div>
                  <p id="html-dialog-title" className="simple-editor-dialog-title">HTML 삽입</p>
                  <p className="simple-editor-dialog-description">안전하게 정제된 HTML이 현재 커서 위치에 삽입됩니다.</p>
                </div>
                <button type="button" className="simple-editor-dialog-close" aria-label="HTML 삽입 닫기" onClick={() => setHtmlDialogOpen(false)}>
                  <X className="size-4" />
                </button>
              </div>
              <textarea className="simple-editor-html-input" autoFocus value={htmlSource} placeholder="<p>본문을 입력하세요.</p>" onChange={(event) => setHtmlSource(event.target.value)} />
              <div className="simple-editor-dialog-actions">
                <button type="button" className="simple-editor-dialog-secondary" onClick={() => setHtmlDialogOpen(false)}>취소</button>
                <button type="button" className="simple-editor-dialog-primary" disabled={!htmlSource.trim()} onClick={insertHtml}>HTML 삽입</button>
              </div>
            </div>
          </div>
        ) : null}
      </EditorContext.Provider>
    </div>
  )
}
