'use client';

import { useEffect, useRef } from 'react';

import styles from '@/components/articles/article-viewer.module.css';
import { sanitizeArticleHtml } from '@/lib/sanitize-article-html';

function addImageLoadingFrames(content: string): string {
  return content.replace(/<img\b[^>]*>/gi, (imageTag) => {
    const imageWithClass = imageTag.includes('class=')
      ? imageTag.replace(/class=["']([^"']*)["']/i, (_match, className: string) => `class="${className} ${styles.viewerImage}"`)
      : imageTag.replace('<img', `<img class="${styles.viewerImage}"`);

    return `<span class="${styles.viewerImageFrame}"><span class="${styles.viewerImageSpinner}" aria-label="이미지 불러오는 중"></span>${imageWithClass}<span class="${styles.viewerImageFallback}">IMAGE / UNAVAILABLE</span></span>`;
  });
}

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
  const framedContent = addImageLoadingFrames(displayContent);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) {
      return;
    }

    const images = Array.from(viewer.querySelectorAll<HTMLImageElement>(`.${styles.viewerImage}`));
    const cleanups = images.map((image) => {
      const frame = image.closest(`.${styles.viewerImageFrame}`);
      if (!(frame instanceof HTMLElement)) {
        return () => undefined;
      }

      const markLoaded = () => frame.classList.add(styles.imageLoaded);
      const markFailed = () => frame.classList.add(styles.imageFailed);

      image.addEventListener('load', markLoaded);
      image.addEventListener('error', markFailed);
      if (image.complete) {
        image.naturalWidth > 0 ? markLoaded() : markFailed();
      }

      return () => {
        image.removeEventListener('load', markLoaded);
        image.removeEventListener('error', markFailed);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [framedContent]);

  return (
    <div
      ref={viewerRef}
      className={`${styles.viewer} ${variant === 'text' ? styles.textOnly : ''}`}
      data-article-viewer
      dangerouslySetInnerHTML={{ __html: framedContent }}
    />
  );
}
