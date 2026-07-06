import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/editorial/_components/style-guide-section';
import { componentNames } from 'lib/style-guide';

export default function StyleGuideComponentsPage() {
  return (
    <>
      <PageIntro title="Components">
        컴포넌트 세트를 타이포그래피와 단단한 직선 경계선 중심의 지면 레이아웃
        감각으로 구성한 미리보기입니다. 각 항목은 추후 독립 페이지로 확장할 수
        있도록 컴포넌트별 이름과 표면을 먼저 고정합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Coverage" title="Component inventory">
        <div className="flex flex-wrap gap-2">
          {componentNames.map((name) => (
            <button
              key={name}
              className="rounded-none border border-neutral-950 bg-white px-3 py-1.5 text-xs font-bold tracking-wider text-neutral-800 uppercase transition-colors hover:bg-[var(--editorial-line)] hover:text-[var(--editorial-background)] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
            >
              {name}
            </button>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Navigation" title="Navigation components">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Navbar">
            <div className="rounded-none border border-neutral-950 dark:border-neutral-800">
              <div className="flex items-center justify-between border-b border-neutral-950/10 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center gap-3">
                  <div className="size-6 rounded-none bg-[var(--editorial-accent)]" />
                  <span className="font-serif font-bold text-neutral-950 dark:text-neutral-50">
                    대전포스트잇
                  </span>
                </div>
                <nav className="hidden gap-6 text-xs font-bold tracking-wider text-neutral-500 uppercase sm:flex dark:text-neutral-400">
                  <a
                    href="#"
                    className="hover:text-neutral-950 dark:hover:text-neutral-50"
                  >
                    홈
                  </a>
                  <a
                    href="#"
                    className="hover:text-neutral-950 dark:hover:text-neutral-50"
                  >
                    공지
                  </a>
                  <a
                    href="#"
                    className="hover:text-neutral-950 dark:hover:text-neutral-50"
                  >
                    일정
                  </a>
                </nav>
              </div>
              <div className="bg-neutral-50/50 px-4 py-10 font-serif text-sm text-neutral-600 italic dark:bg-neutral-950 dark:text-neutral-400">
                본문 영역
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Breadcrumb, tabs, pagination">
            <div className="space-y-6">
              <div className="font-serif text-xs text-neutral-500 italic dark:text-neutral-400">
                홈{' '}
                <span className="mx-1 text-neutral-300 dark:text-neutral-700">
                  |
                </span>{' '}
                독서모임{' '}
                <span className="mx-1 text-neutral-300 dark:text-neutral-700">
                  |
                </span>{' '}
                일정
              </div>
              <div className="flex border-b border-neutral-950/10 text-sm dark:border-neutral-800">
                <button className="border-b-2 border-neutral-950 px-4 py-2 font-serif text-sm font-black text-neutral-950 dark:border-neutral-50 dark:text-neutral-50">
                  목록
                </button>
                <button className="px-4 py-2 font-serif text-sm text-neutral-400 transition-colors hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100">
                  카드
                </button>
              </div>
              <div className="inline-flex divide-x divide-neutral-950 rounded-none border border-neutral-950 text-xs font-bold tracking-wider uppercase dark:divide-neutral-800 dark:border-neutral-800">
                <a
                  href={'#'}
                  className="bg-white px-3 py-2 text-neutral-600 transition-colors hover:bg-[var(--editorial-line)] hover:text-[var(--editorial-background)] dark:bg-neutral-900 dark:text-neutral-400"
                >
                  이전
                </a>
                <a
                  href={'#'}
                  className="bg-[var(--editorial-accent)] px-3 py-2 font-bold text-[var(--editorial-accent-contrast)]"
                >
                  1
                </a>
                <a
                  href={'#'}
                  className="bg-white px-3 py-2 text-neutral-900 transition-colors hover:bg-[var(--editorial-line)] hover:text-[var(--editorial-background)] dark:bg-neutral-900 dark:text-neutral-200"
                >
                  2
                </a>
              </div>
            </div>
          </PreviewPanel>
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Content" title="Content components">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Accordion & collapse">
            <div className="divide-y divide-neutral-950 rounded-none border border-neutral-950 dark:divide-neutral-800 dark:border-neutral-800">
              <details className="group bg-white dark:bg-neutral-900" open>
                <summary className="cursor-pointer px-4 py-3.5 font-serif text-sm font-bold text-neutral-950 transition-colors hover:bg-neutral-50 dark:text-neutral-50 dark:hover:bg-neutral-950">
                  카테고리 정책
                </summary>
                <p className="border-t border-neutral-950/10 bg-neutral-50 px-4 pt-2 pb-4 font-serif text-sm leading-6 text-neutral-600 italic dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                  노출 카테고리만 GNB와 사이트맵에 반영합니다.
                </p>
              </details>
              <details className="group bg-white dark:bg-neutral-900">
                <summary className="cursor-pointer px-4 py-3.5 font-serif text-sm font-bold text-neutral-950 transition-colors hover:bg-neutral-50 dark:text-neutral-50 dark:hover:bg-neutral-950">
                  PWA 정책
                </summary>
                <p className="border-t border-neutral-950/10 bg-neutral-50 px-4 pt-2 pb-4 font-serif text-sm leading-6 text-neutral-600 italic dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                  사이트별 manifest와 service worker를 분리합니다.
                </p>
              </details>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Card, list group, progress">
            <div className="space-y-6">
              <article className="rounded-none border border-neutral-950 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-serif text-base font-bold text-neutral-950 dark:text-neutral-50">
                      7월 정기 독서 모임
                    </h4>
                    <p className="mt-2 font-serif text-sm text-neutral-600 italic dark:text-neutral-400">
                      노출 중인 일정 카드 예시입니다.
                    </p>
                  </div>
                  <span className="rounded-none bg-[var(--editorial-accent)] px-3 py-1 text-xs font-bold tracking-widest text-[var(--editorial-accent-contrast)] uppercase">
                    D-3
                  </span>
                </div>
              </article>
              <ul className="divide-y divide-neutral-950 rounded-none border border-neutral-950 text-sm dark:divide-neutral-800 dark:border-neutral-800">
                <li className="bg-white px-4 py-3 font-serif text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                  최근 공지
                </li>
                <li className="bg-white px-4 py-3 font-serif text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                  이번 주 일정
                </li>
                <li className="bg-white px-4 py-3 font-serif font-bold text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                  문의 내역
                </li>
              </ul>
              <div className="h-2 overflow-hidden rounded-none bg-neutral-200 dark:bg-neutral-800">
                <div className="h-full w-2/3 rounded-none bg-[var(--editorial-accent)]" />
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Dropdown, popover, tooltip">
            <div className="flex flex-wrap items-start gap-4">
              <div className="inline-block divide-y divide-neutral-100 rounded-none border border-neutral-950 bg-white text-sm dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
                <button className="block w-full border-b border-neutral-950/10 bg-neutral-50 px-4 py-2.5 text-left font-serif font-bold text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50">
                  정렬
                </button>
                <button className="block w-full px-4 py-2.5 text-left font-serif text-neutral-600 transition-colors hover:bg-[var(--editorial-line)] hover:text-[var(--editorial-background)] dark:text-neutral-400">
                  최신순
                </button>
                <button className="block w-full px-4 py-2.5 text-left font-serif text-neutral-600 transition-colors hover:bg-[var(--editorial-line)] hover:text-[var(--editorial-background)] dark:text-neutral-400">
                  고정순
                </button>
              </div>
              <span className="rounded-none bg-neutral-950 px-3 py-2 text-xs font-bold tracking-widest text-white uppercase dark:bg-neutral-50 dark:text-neutral-950">
                Tooltip
              </span>
              <span className="rounded-none border border-neutral-950 bg-white px-5 py-4 font-serif text-sm text-neutral-950 italic dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50">
                Popover content
              </span>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Carousel, spinner, toast">
            <div className="space-y-6">
              <div className="flex aspect-[16/7] items-center justify-center rounded-none border-2 border-neutral-950 bg-neutral-900 font-serif text-sm text-neutral-200 italic dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                대표 이미지 영역
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="size-6 animate-spin rounded-none border-2 border-neutral-950 border-t-transparent dark:border-neutral-200" />
                <span className="rounded-none border border-neutral-950 bg-neutral-950 px-5 py-3 text-sm text-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                  클립보드에 복사되었습니다.
                </span>
              </div>
            </div>
          </PreviewPanel>
        </div>
      </StyleGuideSection>
    </>
  );
}
