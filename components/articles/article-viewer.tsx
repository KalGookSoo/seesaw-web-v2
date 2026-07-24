import styles from '@/components/articles/article-viewer.module.css';

export function ArticleViewer({
  content
}: Readonly<{
  content: string;
}>) {
  return (
    <div
      className={styles.viewer}
      data-article-viewer
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
