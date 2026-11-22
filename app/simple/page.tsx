'use client'

import { Suspense } from "react"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"

// Temporary: @tiptap/react calls Math.random() while it renders the editor.
// With cacheComponents enabled, Next.js fails the production build unless
// that render happens inside Suspense. Remove the boundary once @tiptap/react
// renders without Math.random().
export default function Page() {
  return (
    <Suspense fallback={<p role="status">Loading editor...</p>}>
      <SimpleEditor
        initialContent=""
        onChange={() => undefined}
        onInlineImage={() => undefined}
        onInlineVideo={() => undefined}
      />
    </Suspense>
  )
}
