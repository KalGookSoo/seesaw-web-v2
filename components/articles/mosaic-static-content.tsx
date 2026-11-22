'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import type { ArticleResponse } from '@/types/article';
import { ArticleViewer } from '@/components/articles/article-viewer';
import styles from './mosaic-static-content.module.css';

type BackgroundImage = Readonly<{
  id: string;
  src: string;
  alt: string;
}>;

type MosaicStaticContentProps = Readonly<{
  articles: readonly ArticleResponse[];
}>;

function extractImages(articles: readonly ArticleResponse[]): BackgroundImage[] {
  return articles.flatMap((article) => {
    const images: BackgroundImage[] = [];
    const imagePattern = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
    let match: RegExpExecArray | null;
    let imageIndex = 0;

    while ((match = imagePattern.exec(article.content ?? '')) !== null) {
      const altMatch = match[0].match(/\balt=["']([^"']*)["']/i);
      images.push({
        id: `${article.id}-${imageIndex}`,
        src: match[1],
        alt: altMatch?.[1] || article.title || '모임 이미지'
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

export function MosaicStaticContent({ articles }: MosaicStaticContentProps) {
  const backgroundImages = useMemo(() => extractImages(articles), [articles]);
  const chapters = useMemo(() => articles.filter(hasReadableContent), [articles]);
  const experienceRef = useRef<HTMLDivElement | null>(null);
  const [activeBackground, setActiveBackground] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);
  const displayedBackground = backgroundImages[activeBackground];

  useEffect(() => {
    function updateBackground() {
      const experience = experienceRef.current;
      if (!experience || backgroundImages.length === 0) return;

      const scrollableHeight = Math.max(experience.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-experience.getBoundingClientRect().top / scrollableHeight, 0), 0.999999);
      setActiveBackground(Math.min(Math.floor(progress * backgroundImages.length), backgroundImages.length - 1));
    }

    updateBackground();
    window.addEventListener('scroll', updateBackground, { passive: true });
    window.addEventListener('resize', updateBackground);
    return () => {
      window.removeEventListener('scroll', updateBackground);
      window.removeEventListener('resize', updateBackground);
    };
  }, [backgroundImages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);
        const index = visible[0]?.target.getAttribute('data-chapter-index');
        if (index) setActiveChapter(Number(index));
      },
      { threshold: [0.35, 0.65], rootMargin: '-18% 0px -18% 0px' }
    );

    chapterRefs.current.forEach((chapter) => {
      if (chapter) observer.observe(chapter);
    });

    return () => observer.disconnect();
  }, [chapters.length]);

  function moveToChapter(index: number) {
    setActiveChapter(index);
    chapterRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setNavigatorOpen(false);
  }

  return (
    <div className={styles.experience} ref={experienceRef}>
      <div className={styles.background} aria-hidden="true">
        {displayedBackground ? (
          <img
            key={displayedBackground.id}
            src={displayedBackground.src}
            alt=""
          />
        ) : null}
      </div>

      <div className={styles.wallShade} aria-hidden="true" />

      <div className={styles.reader}>
        <div className={styles.readerIntro}>
          <span>About the space</span>
          <span>{String(chapters.length).padStart(2, '0')} chapters</span>
        </div>

        {chapters.map((article, index) => (
          <article
            className={styles.chapter}
            data-chapter-index={index}
            key={article.id}
            ref={(element) => {
              chapterRefs.current[index] = element;
            }}
          >
            <div className={styles.chapterMeta}>
                <span>{String(index + 1).padStart(2, '0')}</span>
              {article.createdDate ? (
                <time dateTime={article.createdDate}>
                  {new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(article.createdDate))}
                </time>
              ) : null}
            </div>
            {article.title ? <h2>{article.title}</h2> : null}
            <ArticleViewer content={article.content ?? ''} variant="text" />
          </article>
        ))}

        <footer className={styles.readerFooter}>End of introduction</footer>
      </div>

      <aside className={`${styles.navigator} ${navigatorOpen ? styles.navigatorOpen : ''}`} aria-label="현재 카테고리 아티클 탐색">
        <button
          className={styles.navigatorToggle}
          type="button"
          aria-expanded={navigatorOpen}
          onClick={() => setNavigatorOpen((current) => !current)}
        >
          <span><b>{String(activeChapter + 1).padStart(2, '0')}</b> / {String(chapters.length).padStart(2, '0')}</span>
          <span>{navigatorOpen ? '닫기' : '아티클 탐색'}</span>
        </button>
        {navigatorOpen ? (
          <nav className={styles.chapterList}>
            {chapters.map((article, index) => (
              <button
                className={index === activeChapter ? styles.activeChapter : undefined}
                key={article.id}
                type="button"
                onClick={() => moveToChapter(index)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{article.title || `아티클 ${index + 1}`}</strong>
              </button>
            ))}
          </nav>
        ) : null}
      </aside>
    </div>
  );
}
