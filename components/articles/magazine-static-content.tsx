'use client';

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';

import type { ArticleResponse } from '@/types/article';
import { ArticleViewer } from '@/components/articles/article-viewer';
import { MonochromeImage } from '@/components/ui/monochrome-image';
import styles from './mosaic-static-content.module.css';

type MagazineImage = Readonly<{
  id: string;
  src: string;
  alt: string;
}>;

type MagazineStaticContentProps = Readonly<{
  articles: readonly ArticleResponse[];
  categoryName: string;
  categoryDescription?: string | null;
}>;

function extractImages(article: ArticleResponse): MagazineImage[] {
  const images: MagazineImage[] = [];
  const imagePattern = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;
  let imageIndex = 0;

  while ((match = imagePattern.exec(article.content ?? '')) !== null) {
    const altMatch = match[0].match(/\balt=["']([^"']*)["']/i);
    images.push({
      id: `${article.id}-${imageIndex}`,
      src: match[1],
      alt: altMatch?.[1] || article.title || '게시글 이미지'
    });
    imageIndex += 1;
  }

  return images;
}

function hasReadableContent(article: ArticleResponse): boolean {
  const text = (article.content ?? '')
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/Previous|Next/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return Boolean(article.title || text);
}

export function MagazineStaticContent({ articles, categoryName, categoryDescription }: MagazineStaticContentProps) {
  const readableArticles = useMemo(() => articles.filter(hasReadableContent), [articles]);
  const articleImages = useMemo(
    () => new Map(readableArticles.map((article) => [article.id, extractImages(article)])),
    [readableArticles]
  );
  const imageCount = Array.from(articleImages.values()).reduce((total, images) => total + images.length, 0);
  const [selectedArticleIndex, setSelectedArticleIndex] = useState<number | null>(null);
  const selectedArticle = selectedArticleIndex === null ? null : readableArticles[selectedArticleIndex];

  useEffect(() => {
    if (selectedArticleIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setSelectedArticleIndex(null);
    }

    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [selectedArticleIndex]);

  return (
    <div className={styles.experience}>
      <div className={styles.reader}>
        <header className={styles.cover} aria-labelledby="static-content-cover-title">
          <div className={styles.coverMeta}>
            <span>전시관</span>
            <span>게시글 {String(readableArticles.length).padStart(2, '0')}개 · 이미지 {String(imageCount).padStart(2, '0')}개</span>
          </div>
          <p className={styles.coverKicker}>편집된 기록의 모음</p>
          <h1 id="static-content-cover-title">{categoryName}</h1>
          {categoryDescription ? <p className={styles.coverLead}>{categoryDescription}</p> : null}
        </header>

        <section className={styles.magazine} aria-label="게시글 매거진">
          {readableArticles.map((article, index) => {
            const images = articleImages.get(article.id) ?? [];
            const isWide = index % 5 === 0;
            return (
              <article
                className={`${styles.magazineArticle} ${isWide ? styles.magazineArticleWide : ''}`}
                key={article.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedArticleIndex(index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedArticleIndex(index);
                  }
                }}
              >
                {images.length > 0 ? (
                  <div className={`${styles.magazineVisual} ${images.length > 1 ? styles.magazineCollage : ''}`}>
                    {images.slice(0, 3).map((image) => (
                      <div className={styles.magazineImage} key={image.id}>
                        <MonochromeImage className="size-full" imageClassName="object-cover" src={image.src} alt={image.alt} />
                      </div>
                    ))}
                  </div>
                ) : null}
                <div className={styles.magazineCopy}>
                  <div className={styles.magazineMeta}>
                    <span>{String(index + 1).padStart(2, '0')} · 칼럼</span>
                    {article.createdDate ? (
                      <time dateTime={article.createdDate}>
                        {new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(article.createdDate))}
                      </time>
                    ) : null}
                  </div>
                  {article.title ? <h2>{article.title}</h2> : null}
                  <ArticleViewer content={article.content ?? ''} variant="text" />
                </div>
                <span className={styles.magazineNumber}>{String(index + 1).padStart(2, '0')}</span>
              </article>
            );
          })}
        </section>
      </div>

      {selectedArticle ? (
        <div className={styles.magazineModalBackdrop} role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setSelectedArticleIndex(null);
        }}>
          <article className={styles.magazineModal} role="dialog" aria-modal="true" aria-labelledby="magazine-modal-title">
            <div className={styles.magazineModalHeader}>
              <span>칼럼 · {String((selectedArticleIndex ?? 0) + 1).padStart(2, '0')} / {String(readableArticles.length).padStart(2, '0')}</span>
              <button type="button" aria-label="팝업 닫기" onClick={() => setSelectedArticleIndex(null)}><X /></button>
            </div>
            {(articleImages.get(selectedArticle.id) ?? []).length > 0 ? (
              <div className={styles.magazineModalImages}>
                {(articleImages.get(selectedArticle.id) ?? []).map((image) => (
                  <div key={image.id}>
                    <MonochromeImage className="size-full" imageClassName="object-contain" src={image.src} alt={image.alt} />
                  </div>
                ))}
              </div>
            ) : null}
            <div className={styles.magazineModalBody}>
              <span>{String((selectedArticleIndex ?? 0) + 1).padStart(2, '0')} · 칼럼</span>
              <h2 id="magazine-modal-title">{selectedArticle.title || '제목 없는 게시글'}</h2>
              <ArticleViewer content={selectedArticle.content ?? ''} />
            </div>
          </article>
        </div>
      ) : null}
    </div>
  );
}
