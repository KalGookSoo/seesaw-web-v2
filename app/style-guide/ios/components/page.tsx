import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/ios/_components/style-guide-section';
import { componentNames } from 'lib/style-guide';

export default function StyleGuideComponentsPage() {
  return (
    <>
      <PageIntro title="Components">
        iOS 컴포넌트는 grouped background 위의 명확한 셀, 넉넉한 터치 영역,
        system color를 사용한 상태 표현을 기준으로 구성합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Coverage" title="Component inventory">
        <div className="flex flex-wrap gap-2">
          {componentNames.map((name) => (
            <button
              key={name}
              className="rounded-lg bg-[var(--ios-fill)] px-3 py-2 text-sm font-medium text-[var(--ios-label)] transition-colors hover:bg-[var(--ios-fill-strong)]"
            >
              {name}
            </button>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Navigation" title="Navigation components">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Navigation bar">
            <div className="overflow-hidden rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-surface-grouped)]">
              <div className="flex items-center justify-between border-b border-[var(--ios-separator)] bg-[var(--ios-surface)] px-4 py-3">
                <button className="text-sm font-semibold text-[var(--ios-blue)]">
                  이전
                </button>
                <span className="font-semibold text-[var(--ios-label)]">
                  대전포스트잇
                </span>
                <button className="text-sm font-semibold text-[var(--ios-blue)]">
                  설정
                </button>
              </div>
              <div className="px-4 py-10 text-center text-sm text-[var(--ios-secondary-label)]">
                콘텐츠 영역
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Segmented control and pagination">
            <div className="space-y-6">
              <div className="grid grid-cols-3 rounded-lg bg-[var(--ios-fill)] p-1">
                <button className="rounded-md bg-[var(--ios-surface)] px-4 py-2 text-sm font-semibold text-[var(--ios-label)] shadow-sm">
                  목록
                </button>
                <button className="rounded-md px-4 py-2 text-sm text-[var(--ios-secondary-label)]">
                  카드
                </button>
                <button className="rounded-md px-4 py-2 text-sm text-[var(--ios-secondary-label)]">
                  캘린더
                </button>
              </div>
              <div className="flex gap-2">
                {['이전', '1', '2'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                      item === '1'
                        ? 'bg-[var(--ios-blue)] text-white'
                        : 'bg-[var(--ios-fill)] text-[var(--ios-label)]'
                    }`}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </PreviewPanel>
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Content" title="Content components">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Card and grouped list">
            <div className="space-y-5">
              <article className="rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-surface)] p-5 shadow-[var(--ios-shadow)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-[var(--ios-label)]">
                      7월 정기 독서 모임
                    </h4>
                    <p className="mt-2 text-sm text-[var(--ios-secondary-label)]">
                      노출 중인 일정 카드 예시입니다.
                    </p>
                  </div>
                  <span className="rounded-lg bg-[var(--ios-blue)] px-3 py-1 text-xs font-semibold text-white">
                    D-3
                  </span>
                </div>
              </article>
              <ul className="overflow-hidden rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-surface)] text-sm">
                <li className="border-b border-[var(--ios-separator)] px-4 py-3">
                  최근 공지
                </li>
                <li className="border-b border-[var(--ios-separator)] px-4 py-3">
                  이번 주 일정
                </li>
                <li className="px-4 py-3 font-semibold">문의 내역</li>
              </ul>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Progress, spinner, toast">
            <div className="space-y-6">
              <div className="h-2 overflow-hidden rounded-full bg-[var(--ios-fill)]">
                <div className="h-full w-2/3 rounded-full bg-[var(--ios-blue)]" />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="size-6 animate-spin rounded-full border-2 border-[var(--ios-fill-strong)] border-t-[var(--ios-blue)]" />
                <span className="rounded-lg bg-[var(--ios-surface-elevated)] px-5 py-3 text-sm text-[var(--ios-label)] shadow-[var(--ios-shadow)]">
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
