import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/default/_components/style-guide-section';
import { DefaultWysiwygEditor } from 'app/style-guide/default/components/_components/default-wysiwyg-editor';
import { componentNames } from 'lib/style-guide';

export default function StyleGuideComponentsPage() {
  return (
    <>
      <PageIntro title="Components">
        Bootstrap 5 컴포넌트 세트를 Tailwind 표면으로 옮긴 미리보기입니다. 각
        항목은 추후 독립 페이지로 확장할 수 있도록 컴포넌트별 이름과 표면을 먼저
        고정합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Coverage" title="Component inventory">
        <div className="flex flex-wrap gap-2">
          {componentNames.map((name) => (
            <button
              key={name}
              className="border-default-separator bg-default-surface text-default-secondary-label rounded-full border px-3 py-1 text-xs font-medium"
            >
              {name}
            </button>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Navigation" title="Navigation components">
        <div className="grid gap-5 lg:grid-cols-2">
          <PreviewPanel title="Navbar">
            <div className="border-default-separator overflow-hidden rounded-lg border">
              <div className="border-default-separator bg-default-surface flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="bg-default-blue size-8 rounded-md" />
                  <span className="text-default-label font-semibold">
                    대전포스트잇
                  </span>
                </div>
                <nav className="text-default-secondary-label hidden gap-4 text-sm sm:flex">
                  <a href="#">홈</a>
                  <a href="#">공지</a>
                  <a href="#">일정</a>
                </nav>
              </div>
              <div className="bg-default-surface-grouped text-default-secondary-label px-4 py-8 text-sm">
                본문 영역
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Breadcrumb, tabs, pagination">
            <div className="space-y-4">
              <div className="text-default-secondary-label text-sm">
                홈 / 독서모임 / 일정
              </div>
              <div className="border-default-separator flex border-b text-sm">
                <button className="border-default-blue text-default-blue border-b-2 px-4 py-2 font-semibold">
                  목록
                </button>
                <button className="text-default-secondary-label px-4 py-2">
                  카드
                </button>
              </div>
              <div className="border-default-separator inline-flex overflow-hidden rounded-md border text-sm">
                <a
                  href={'#'}
                  className="bg-default-surface text-default-secondary-label px-3 py-2"
                >
                  이전
                </a>
                <a
                  href={'#'}
                  className="border-default-separator bg-default-blue border-x px-3 py-2 text-white"
                >
                  1
                </a>
                <a
                  href={'#'}
                  className="bg-default-surface text-default-label px-3 py-2"
                >
                  2
                </a>
              </div>
            </div>
          </PreviewPanel>
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Content" title="Content components">
        <div className="grid gap-5 lg:grid-cols-2">
          <PreviewPanel title="Accordion & collapse">
            <div className="divide-default-separator border-default-separator divide-y overflow-hidden rounded-lg border">
              <details className="group bg-default-surface" open>
                <summary className="text-default-label cursor-pointer px-4 py-3 text-sm font-semibold">
                  카테고리 정책
                </summary>
                <p className="text-default-secondary-label px-4 pb-4 text-sm leading-6">
                  노출 카테고리만 GNB와 사이트맵에 반영합니다.
                </p>
              </details>
              <details className="group bg-default-surface">
                <summary className="text-default-label cursor-pointer px-4 py-3 text-sm font-semibold">
                  PWA 정책
                </summary>
                <p className="text-default-secondary-label px-4 pb-4 text-sm leading-6">
                  사이트별 manifest와 service worker를 분리합니다.
                </p>
              </details>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Card, list group, progress">
            <div className="space-y-4">
              <article className="border-default-separator bg-default-surface rounded-lg border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-default-label font-semibold">
                      7월 정기 독서 모임
                    </h4>
                    <p className="text-default-secondary-label mt-1 text-sm">
                      노출 중인 일정 카드 예시입니다.
                    </p>
                  </div>
                  <span className="bg-default-orange rounded-full px-2 py-1 text-xs font-semibold text-white">
                    D-3
                  </span>
                </div>
              </article>
              <ul className="divide-default-separator border-default-separator divide-y overflow-hidden rounded-lg border text-sm">
                <li className="bg-default-surface px-4 py-3">최근 공지</li>
                <li className="bg-default-surface px-4 py-3">이번 주 일정</li>
                <li className="bg-default-surface px-4 py-3">문의 내역</li>
              </ul>
              <div className="bg-default-gray-5 h-2 overflow-hidden rounded-full">
                <div className="bg-default-blue h-full w-2/3 rounded-full" />
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Dropdown, popover, tooltip">
            <div className="flex flex-wrap items-start gap-4">
              <div className="border-default-separator bg-default-surface inline-block overflow-hidden rounded-lg border text-sm shadow-sm">
                <button className="text-default-label block w-full px-4 py-2 text-left font-semibold">
                  정렬
                </button>
                <button className="text-default-secondary-label block w-full px-4 py-2 text-left">
                  최신순
                </button>
                <button className="text-default-secondary-label block w-full px-4 py-2 text-left">
                  고정순
                </button>
              </div>
              <span className="bg-default-label rounded-md px-3 py-2 text-xs text-white">
                Tooltip
              </span>
              <span className="border-default-separator bg-default-surface text-default-label rounded-lg border px-4 py-3 text-sm shadow-sm">
                Popover content
              </span>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Carousel, spinner, toast">
            <div className="space-y-4">
              <div className="from-default-blue to-default-purple flex aspect-[16/7] items-center justify-center rounded-lg bg-gradient-to-br text-sm font-semibold text-white">
                대표 이미지 영역
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="border-default-blue size-6 animate-spin rounded-full border-2 border-t-transparent" />
                <span className="border-default-separator bg-default-label rounded-md border px-4 py-3 text-sm text-white shadow-sm">
                  클립보드에 복사되었습니다.
                </span>
              </div>
            </div>
          </PreviewPanel>
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Editor" title="WYSIWYG editor">
        <DefaultWysiwygEditor />
      </StyleGuideSection>
    </>
  );
}
