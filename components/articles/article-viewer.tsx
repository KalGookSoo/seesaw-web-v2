import styles from '@/components/articles/article-viewer.module.css';
import { sanitizeArticleHtml } from '@/lib/sanitize-article-html';

export function ArticleViewer({
  content,
  variant = 'default'
}: Readonly<{
  content: string;
  variant?: 'default' | 'text';
}>) {
  const sourceContent = variant === 'text'
    ? content.replace(/Previous|Next/gi, '')
    : content;
  const sanitizedContent = sanitizeArticleHtml(sourceContent);
  const displayContent = variant === 'text'
    ? sanitizedContent.replace(/Previous\s*Next/gi, '')
    : sanitizedContent;

  return (
    <div
      className={`${styles.viewer} ${variant === 'text' ? styles.textOnly : ''}`}
      data-article-viewer
      dangerouslySetInnerHTML={{ __html: displayContent }}
    />
  );
}
