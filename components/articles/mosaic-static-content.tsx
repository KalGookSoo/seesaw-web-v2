'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';

import type { ArticleResponse } from '@/types/article';
import { ArticleViewer } from '@/components/articles/article-viewer';
import { MonochromeImage } from '@/components/ui/monochrome-image';
import styles from './mosaic-static-content.module.css';

type GalleryImage = Readonly<{
  id: string;
  src: string;
  alt: string;
  articleId: string;
}>;

type MosaicStaticContentProps = Readonly<{
  articles: readonly ArticleResponse[];
  categoryName: string;
  categoryDescription?: string | null;
}>;

function extractImages(articles: readonly ArticleResponse[]): GalleryImage[] {
  return articles.flatMap((article) => {
    const images: GalleryImage[] = [];
    const imagePattern = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
    let match: RegExpExecArray | null;
    let imageIndex = 0;

    while ((match = imagePattern.exec(article.content ?? '')) !== null) {
      const altMatch = match[0].match(/\balt=["']([^"']*)["']/i);
      images.push({
        id: `${article.id}-${imageIndex}`,
        src: match[1],
        alt: altMatch?.[1] || article.title || '전시 이미지',
        articleId: article.id
      });
      imageIndex += 1;
    }

    return images;
  });
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

export function MosaicStaticContent({ articles, categoryName, categoryDescription }: MosaicStaticContentProps) {
  const images = useMemo(() => extractImages(articles), [articles]);
  const chapters = useMemo(() => articles.filter(hasReadableContent), [articles]);
  const galleryItems = useMemo(
    () => images
      .map((image) => ({
        ...image,
        chapterIndex: chapters.findIndex((article) => article.id === image.articleId)
      }))
      .filter((image) => image.chapterIndex >= 0),
    [chapters, images]
  );
  const experienceRef = useRef<HTMLDivElement | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [viewMode, setViewMode] = useState<'gallery' | 'feed'>('gallery');
  const [pendingChapter, setPendingChapter] = useState<number | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(null);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);

  const selectedGalleryImage = selectedGalleryIndex === null ? null : galleryItems[selectedGalleryIndex];
  const selectedColumn = selectedColumnIndex === null ? null : chapters[selectedColumnIndex];

  useEffect(() => {
    const isModalOpen = selectedGalleryIndex !== null || selectedColumnIndex !== null;
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelectedGalleryIndex(null);
        setSelectedColumnIndex(null);
      }
      if (selectedGalleryIndex !== null && event.key === 'ArrowLeft') {
        setSelectedGalleryIndex((current) => current === null ? null : (current - 1 + galleryItems.length) % galleryItems.length);
      }
      if (selectedGalleryIndex !== null && event.key === 'ArrowRight') {
        setSelectedGalleryIndex((current) => current === null ? null : (current + 1) % galleryItems.length);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [galleryItems.length, selectedColumnIndex, selectedGalleryIndex]);

  useEffect(() => {
    if (pendingChapter === null) return;
    chapterRefs.current[pendingChapter]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setPendingChapter(null);
  }, [pendingChapter]);

  function moveToChapter(index: number) {
    setActiveChapter(index);
    setPendingChapter(index);
    setViewMode('feed');
  }

  function openGalleryFromFeed() {
    setViewMode('gallery');
  }

  function openColumn(index: number) {
    setSelectedColumnIndex(index);
  }

  function openRelatedColumn() {
    if (!selectedGalleryImage) return;
    const columnIndex = selectedGalleryImage.chapterIndex;
    setSelectedGalleryIndex(null);
    setSelectedColumnIndex(null);
    moveToChapter(columnIndex);
  }

  return (
    <div className={styles.experience} ref={experienceRef}>
      <div className={styles.reader}>
        <section className={styles.cover} aria-labelledby="static-content-cover-title">
          <div className={styles.coverMeta}>
            <span>전시관</span>
            <span>게시글 {String(chapters.length).padStart(2, '0')}개 · 이미지 {String(galleryItems.length).padStart(2, '0')}개</span>
          </div>
          <p className={styles.coverKicker}>편집된 기록의 모음</p>
          <h1 id="static-content-cover-title">{categoryName}</h1>
          {categoryDescription ? <p className={styles.coverLead}>{categoryDescription}</p> : null}
          <div className={styles.coverActions} aria-label="감상 방식 선택">
            <button className={viewMode === 'gallery' ? styles.viewModeActive : undefined} type="button" onClick={() => setViewMode('gallery')}>
              갤러리
              <span>이미지 중심으로 감상</span>
            </button>
            <button className={viewMode === 'feed' ? styles.viewModeActive : undefined} type="button" onClick={() => setViewMode('feed')}>
              칼럼
              <span>게시글을 순서대로 읽기</span>
            </button>
          </div>
        </section>

        {viewMode === 'gallery' ? (
          <section className={styles.gallery} aria-labelledby="gallery-title">
            <div className={styles.sectionHeading}>
              <div>
                <span>01 · 갤러리</span>
                <h2 id="gallery-title">이미지로 보는 전시</h2>
              </div>
              <p>이미지를 선택하면 해당 게시글로 이동합니다.</p>
            </div>
            {galleryItems.length > 0 ? (
              <div className={styles.galleryGrid}>
                {galleryItems.map((image, index) => {
                  const article = chapters[image.chapterIndex];
                  return (
                    <button
                      className={`${styles.galleryItem} ${index % 5 === 0 ? styles.galleryItemFeatured : ''}`}
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedGalleryIndex(index)}
                    >
                      <span className={styles.galleryImage}>
                        <MonochromeImage className="size-full" imageClassName="object-cover" src={image.src} alt={image.alt} />
                      </span>
                      <span className={styles.galleryCaption}>
                        <span>{String(image.chapterIndex + 1).padStart(2, '0')} · {String(index + 1).padStart(2, '0')}</span>
                        <strong>{article.title || '제목 없는 게시글'}</strong>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyGallery}>본문에 포함된 전시 이미지가 없습니다. 칼럼에서 게시글을 읽어보세요.</div>
            )}
          </section>
        ) : (
          <section className={styles.feed} aria-labelledby="feed-title">
            <div className={styles.sectionHeading}>
              <div>
                <span>02 · 칼럼</span>
                <h2 id="feed-title">칼럼으로 읽는 전시</h2>
              </div>
              <button className={styles.textAction} type="button" onClick={openGalleryFromFeed}>갤러리로 돌아가기 →</button>
            </div>
            {chapters.map((article, index) => (
              <article
                className={`${styles.chapter} ${index === activeChapter ? styles.chapterActive : ''}`}
                data-chapter-index={index}
                id={`chapter-${article.id}`}
                key={article.id}
                role="button"
                tabIndex={0}
                onClick={() => openColumn(index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openColumn(index);
                  }
                }}
                ref={(element) => {
                  chapterRefs.current[index] = element;
                }}
              >
                {images.find((image) => image.articleId === article.id) ? (
                  <div className={styles.columnImage}>
                    <MonochromeImage
                      className="size-full"
                      imageClassName="object-cover"
                      src={images.find((image) => image.articleId === article.id)?.src ?? ''}
                      alt={article.title || '칼럼 이미지'}
                    />
                  </div>
                ) : null}
                <div className={styles.chapterMeta}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {article.createdDate ? (
                    <time dateTime={article.createdDate}>
                      {new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(article.createdDate))}
                    </time>
                  ) : null}
                </div>
                {article.title ? <h3>{article.title}</h3> : null}
                <ArticleViewer content={article.content ?? ''} variant="text" />
              </article>
            ))}
            <footer className={styles.readerFooter}>전시의 끝</footer>
          </section>
        )}
      </div>

      {selectedGalleryImage ? (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setSelectedGalleryIndex(null);
        }}>
          <section className={styles.modalPanel} role="dialog" aria-modal="true" aria-labelledby="gallery-modal-title">
            <div className={styles.modalHeader}>
              <span>갤러리 · {String((selectedGalleryIndex ?? 0) + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}</span>
              <button className={styles.modalClose} type="button" aria-label="갤러리 닫기" onClick={() => setSelectedGalleryIndex(null)}><X /></button>
            </div>
            <div className={styles.modalImage}>
              <MonochromeImage className="size-full" imageClassName="object-contain" src={selectedGalleryImage.src} alt={selectedGalleryImage.alt} />
            </div>
            <div className={styles.modalCaption}>
              <div>
                <span>{String(selectedGalleryImage.chapterIndex + 1).padStart(2, '0')} · 칼럼</span>
                <h2 id="gallery-modal-title">{chapters[selectedGalleryImage.chapterIndex]?.title || '제목 없는 게시글'}</h2>
              </div>
              <button className={styles.modalAction} type="button" onClick={openRelatedColumn}>칼럼에서 읽기 →</button>
            </div>
            <div className={styles.modalPager}>
              <button type="button" onClick={() => setSelectedGalleryIndex((current) => current === null ? null : (current - 1 + galleryItems.length) % galleryItems.length)}>← 이전 작품</button>
              <button type="button" onClick={() => setSelectedGalleryIndex((current) => current === null ? null : (current + 1) % galleryItems.length)}>다음 작품 →</button>
            </div>
          </section>
        </div>
      ) : null}

      {selectedColumn ? (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setSelectedColumnIndex(null);
        }}>
          <article className={`${styles.modalPanel} ${styles.columnModal}`} role="dialog" aria-modal="true" aria-labelledby="column-modal-title">
            <div className={styles.modalHeader}>
              <span>칼럼 · {String((selectedColumnIndex ?? 0) + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}</span>
              <button className={styles.modalClose} type="button" aria-label="칼럼 닫기" onClick={() => setSelectedColumnIndex(null)}><X /></button>
            </div>
            {images.find((image) => image.articleId === selectedColumn.id) ? (
              <div className={styles.modalArticleImage}>
                <MonochromeImage
                  className="size-full"
                  imageClassName="object-cover"
                  src={images.find((image) => image.articleId === selectedColumn.id)?.src ?? ''}
                  alt={selectedColumn.title || '칼럼 이미지'}
                />
              </div>
            ) : null}
            <div className={styles.columnModalBody}>
              <span>{String((selectedColumnIndex ?? 0) + 1).padStart(2, '0')} · 칼럼</span>
              <h2 id="column-modal-title">{selectedColumn.title || '제목 없는 게시글'}</h2>
              <ArticleViewer content={selectedColumn.content ?? ''} />
            </div>
            <button className={styles.modalAction} type="button" onClick={() => {
              setSelectedColumnIndex(null);
              setPendingChapter(selectedColumnIndex);
            }}>본문 위치로 이동 →</button>
          </article>
        </div>
      ) : null}

    </div>
  );
}
