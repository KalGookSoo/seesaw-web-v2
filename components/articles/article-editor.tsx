'use client';

import {
  SimpleEditor,
  type SimpleEditorProps
} from '@/components/tiptap-templates/simple/simple-editor';

export type ArticleEditorProps = SimpleEditorProps;

export function ArticleEditor(props: ArticleEditorProps) {
  return <SimpleEditor {...props} />;
}
