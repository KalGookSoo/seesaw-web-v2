import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/windows-98-fluent/_components/style-guide-section';
import { componentNames } from 'lib/style-guide';

export default function StyleGuideComponentsPage() {
  return (
    <>
      <PageIntro title="Components">
        Windows 98 Fluent 컴포넌트는 raised button, sunken panel, active title
        bar, 시스템 회색 표면을 기준으로 구성합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Coverage" title="Component inventory">
        <div className="flex flex-wrap gap-2">
          {componentNames.map((name) => (
            <button
              key={name}
              className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] px-3 py-2 font-mono text-sm font-medium text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)] transition-colors active:shadow-[var(--windows-98-fluent-inset-pressed)]"
            >
              {name}
            </button>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Navigation" title="Navigation components">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Navigation bar">
            <div className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
              <div className="flex items-center justify-between bg-[var(--windows-98-fluent-accent)] px-4 py-2 text-[var(--windows-98-fluent-accent-contrast)]">
                <button className="font-mono text-sm font-semibold underline">
                  이전
                </button>
                <span className="font-mono font-semibold">대전포스트잇</span>
                <button className="font-mono text-sm font-semibold underline">
                  설정
                </button>
              </div>
              <div className="px-4 py-10 text-center text-sm text-[var(--windows-98-fluent-secondary-label)]">
                콘텐츠 영역
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Segmented control and pagination">
            <div className="space-y-6">
              <div className="grid grid-cols-3 border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-fill)] p-1 shadow-[var(--windows-98-fluent-inset-pressed)]">
                <button className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] px-4 py-2 font-mono text-sm font-semibold text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)]">
                  목록
                </button>
                <button className="px-4 py-2 font-mono text-sm text-[var(--windows-98-fluent-secondary-label)]">
                  카드
                </button>
                <button className="px-4 py-2 font-mono text-sm text-[var(--windows-98-fluent-secondary-label)]">
                  캘린더
                </button>
              </div>
              <div className="flex gap-2">
                {['이전', '1', '2'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className={`border border-[var(--windows-98-fluent-separator)] px-4 py-2 font-mono text-sm font-medium ${
                      item === '1'
                        ? 'bg-[var(--windows-98-fluent-accent)] text-[var(--windows-98-fluent-accent-contrast)] shadow-[var(--windows-98-fluent-inset-pressed)]'
                        : 'bg-[var(--windows-98-fluent-surface)] text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)]'
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
              <article className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-5 shadow-[var(--windows-98-fluent-inset)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-[var(--windows-98-fluent-label)]">
                      7월 정기 독서 모임
                    </h4>
                    <p className="mt-2 text-sm text-[var(--windows-98-fluent-secondary-label)]">
                      노출 중인 일정 카드 예시입니다.
                    </p>
                  </div>
                  <span className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-accent)] px-3 py-1 font-mono text-xs font-semibold text-[var(--windows-98-fluent-accent-contrast)] shadow-[var(--windows-98-fluent-inset)]">
                    D-3
                  </span>
                </div>
              </article>
              <ul className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface-elevated)] text-sm shadow-[var(--windows-98-fluent-inset-pressed)]">
                <li className="border-b border-[var(--windows-98-fluent-separator)] px-4 py-3">
                  최근 공지
                </li>
                <li className="border-b border-[var(--windows-98-fluent-separator)] px-4 py-3">
                  이번 주 일정
                </li>
                <li className="px-4 py-3 font-semibold">문의 내역</li>
              </ul>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Progress, spinner, toast">
            <div className="space-y-6">
              <div className="h-4 border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface-elevated)] shadow-[var(--windows-98-fluent-inset-pressed)]">
                <div className="h-full w-2/3 bg-[var(--windows-98-fluent-blue)]" />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="size-6 animate-spin rounded-full border-2 border-[var(--windows-98-fluent-fill-strong)] border-t-[var(--windows-98-fluent-blue)]" />
                <span className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] px-5 py-3 font-mono text-sm text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)]">
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
