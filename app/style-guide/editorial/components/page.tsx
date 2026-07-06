import { componentNames } from 'lib/style-guide';
import { PageIntro, PreviewPanel, StyleGuideSection } from 'app/style-guide/editorial/_components/style-guide-section';

export default function StyleGuideComponentsPage() {
  return (
    <>
      <PageIntro title="Components">
        컴포넌트 세트를 타이포그래피와 단단한 직선 경계선 중심의 지면 레이아웃 감각으로 구성한 미리보기입니다. 각 항목은
        추후 독립 페이지로 확장할 수 있도록 컴포넌트별 이름과 표면을 먼저 고정합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Coverage" title="Component inventory">
        <div className="flex flex-wrap gap-2">
          {componentNames.map((name) => (
            <button
              key={name}
              className="border-neutral-950 bg-white text-neutral-800 rounded-none border px-3 py-1.5 text-xs font-bold uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 hover:bg-neutral-950 hover:text-white dark:hover:bg-neutral-50 dark:hover:text-neutral-950 transition-colors"
            >
              {name}
            </button>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Navigation" title="Navigation components">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Navbar">
            <div className="border-neutral-950 dark:border-neutral-800 rounded-none border">
              <div className="border-neutral-950/10 bg-white flex items-center justify-between border-b px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center gap-3">
                  <div className="bg-[#6b1d2f] dark:bg-[#e05a76] size-6 rounded-none" />
                  <span className="text-neutral-950 dark:text-neutral-50 font-bold font-serif">대전포스트잇</span>
                </div>
                <nav className="text-neutral-500 hidden gap-6 text-xs uppercase tracking-wider font-bold sm:flex dark:text-neutral-400">
                  <a href="#" className="hover:text-neutral-950 dark:hover:text-neutral-50">홈</a>
                  <a href="#" className="hover:text-neutral-950 dark:hover:text-neutral-50">공지</a>
                  <a href="#" className="hover:text-neutral-950 dark:hover:text-neutral-50">일정</a>
                </nav>
              </div>
              <div className="bg-neutral-50/50 text-neutral-600 px-4 py-10 text-sm dark:bg-neutral-950 dark:text-neutral-400 font-serif italic">본문 영역</div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Breadcrumb, tabs, pagination">
            <div className="space-y-6">
              <div className="text-neutral-500 font-serif italic text-xs dark:text-neutral-400">
                홈 <span className="mx-1 text-neutral-300 dark:text-neutral-700">|</span> 독서모임 <span className="mx-1 text-neutral-300 dark:text-neutral-700">|</span> 일정
              </div>
              <div className="border-neutral-950/10 dark:border-neutral-800 flex border-b text-sm">
                <button className="border-neutral-950 text-neutral-950 border-b-2 px-4 py-2 font-black dark:border-neutral-50 dark:text-neutral-50 font-serif text-sm">목록</button>
                <button className="text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100 px-4 py-2 font-serif text-sm transition-colors">카드</button>
              </div>
              <div className="border-neutral-950 inline-flex rounded-none border text-xs font-bold uppercase tracking-wider dark:border-neutral-800 divide-x divide-neutral-950 dark:divide-neutral-800">
                <a href={'#'} className="bg-white text-neutral-600 px-3 py-2 hover:bg-neutral-950 hover:text-white dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-100 dark:hover:text-neutral-950 transition-colors">
                  이전
                </a>
                <a href={'#'} className="bg-[#6b1d2f] text-white px-3 py-2 font-bold dark:bg-[#e05a76]">
                  1
                </a>
                <a href={'#'} className="bg-white text-neutral-900 px-3 py-2 hover:bg-neutral-950 hover:text-white dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-100 dark:hover:text-neutral-950 transition-colors">
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
            <div className="divide-neutral-950 border-neutral-950 divide-y rounded-none border dark:divide-neutral-800 dark:border-neutral-800">
              <details className="group bg-white dark:bg-neutral-900" open>
                <summary className="text-neutral-950 cursor-pointer px-4 py-3.5 text-sm font-bold font-serif dark:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors">카테고리 정책</summary>
                <p className="text-neutral-600 bg-neutral-50 px-4 pb-4 pt-2 text-sm leading-6 dark:text-neutral-400 dark:bg-neutral-950 font-serif italic border-t border-neutral-950/10 dark:border-neutral-800">
                  노출 카테고리만 GNB와 사이트맵에 반영합니다.
                </p>
              </details>
              <details className="group bg-white dark:bg-neutral-900">
                <summary className="text-neutral-950 cursor-pointer px-4 py-3.5 text-sm font-bold font-serif dark:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors">PWA 정책</summary>
                <p className="text-neutral-600 bg-neutral-50 px-4 pb-4 pt-2 text-sm leading-6 dark:text-neutral-400 dark:bg-neutral-950 font-serif italic border-t border-neutral-950/10 dark:border-neutral-800">
                  사이트별 manifest와 service worker를 분리합니다.
                </p>
              </details>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Card, list group, progress">
            <div className="space-y-6">
              <article className="border-neutral-950 bg-white rounded-none border p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-neutral-950 font-bold font-serif dark:text-neutral-50 text-base">7월 정기 독서 모임</h4>
                    <p className="text-neutral-600 mt-2 text-sm dark:text-neutral-400 font-serif italic">노출 중인 일정 카드 예시입니다.</p>
                  </div>
                  <span className="bg-[#6b1d2f] text-white rounded-none px-3 py-1 text-xs font-bold tracking-widest uppercase dark:bg-[#e05a76]">D-3</span>
                </div>
              </article>
              <ul className="divide-neutral-950 border-neutral-950 divide-y rounded-none border text-sm dark:divide-neutral-800 dark:border-neutral-800">
                <li className="bg-white px-4 py-3 dark:bg-neutral-900 font-serif text-neutral-800 dark:text-neutral-200">최근 공지</li>
                <li className="bg-white px-4 py-3 dark:bg-neutral-900 font-serif text-neutral-800 dark:text-neutral-200">이번 주 일정</li>
                <li className="bg-white px-4 py-3 dark:bg-neutral-900 font-serif text-neutral-800 dark:text-neutral-200 font-bold">문의 내역</li>
              </ul>
              <div className="bg-neutral-200 h-2 rounded-none dark:bg-neutral-800 overflow-hidden">
                <div className="bg-[#6b1d2f] h-full w-2/3 rounded-none dark:bg-[#e05a76]" />
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Dropdown, popover, tooltip">
            <div className="flex flex-wrap items-start gap-4">
              <div className="border-neutral-950 bg-white inline-block rounded-none border text-sm dark:border-neutral-800 dark:bg-neutral-900 divide-y divide-neutral-100 dark:divide-neutral-800">
                <button className="text-neutral-950 block w-full px-4 py-2.5 text-left font-bold font-serif dark:text-neutral-50 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-950/10 dark:border-neutral-800">정렬</button>
                <button className="text-neutral-600 hover:bg-neutral-950 hover:text-white dark:text-neutral-400 dark:hover:bg-neutral-50 dark:hover:text-neutral-950 block w-full px-4 py-2.5 text-left font-serif transition-colors">최신순</button>
                <button className="text-neutral-600 hover:bg-neutral-950 hover:text-white dark:text-neutral-400 dark:hover:bg-neutral-50 dark:hover:text-neutral-950 block w-full px-4 py-2.5 text-left font-serif transition-colors">고정순</button>
              </div>
              <span className="bg-neutral-950 text-white rounded-none px-3 py-2 text-xs font-bold tracking-widest uppercase dark:bg-neutral-50 dark:text-neutral-950">Tooltip</span>
              <span className="border-neutral-950 bg-white text-neutral-950 rounded-none border px-5 py-4 text-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 font-serif italic">
                Popover content
              </span>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Carousel, spinner, toast">
            <div className="space-y-6">
              <div className="bg-neutral-900 dark:bg-neutral-800 border-2 border-neutral-950 dark:border-neutral-700 flex aspect-[16/7] items-center justify-center rounded-none text-sm font-serif italic text-neutral-200 dark:text-neutral-300">
                대표 이미지 영역
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="border-neutral-950 dark:border-neutral-200 size-6 animate-spin rounded-none border-2 border-t-transparent" />
                <span className="border-neutral-950 bg-neutral-950 rounded-none border px-5 py-3 text-sm text-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
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

