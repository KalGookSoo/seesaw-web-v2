import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/minimalism/_components/style-guide-section';
import { componentNames } from 'lib/style-guide';

export default function StyleGuideComponentsPage() {
  return (
    <>
      <PageIntro title="Components">
        Minimalism 컴포넌트는 반복되는 표면을 단순화하고, 필요할 때만 경계선과
        색을 사용합니다. 눈에 띄는 장식보다 읽기 쉬운 위계와 일관된 간격을
        우선합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Coverage" title="Component inventory">
        <div className="flex flex-wrap gap-2">
          {componentNames.map((name) => (
            <button
              key={name}
              className="rounded-lg bg-[var(--minimalism-fill)] px-3 py-2 text-sm font-medium text-[var(--minimalism-label)] transition-colors hover:bg-[var(--minimalism-fill-strong)]"
            >
              {name}
            </button>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Navigation" title="Navigation components">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Navigation bar">
            <div className="overflow-hidden rounded-lg border border-[var(--minimalism-separator)] bg-[var(--minimalism-surface-grouped)]">
              <div className="flex items-center justify-between border-b border-[var(--minimalism-separator)] bg-[var(--minimalism-surface)] px-4 py-3">
                <button className="text-sm font-semibold text-[var(--minimalism-blue)]">
                  이전
                </button>
                <span className="font-semibold text-[var(--minimalism-label)]">
                  대전포스트잇
                </span>
                <button className="text-sm font-semibold text-[var(--minimalism-blue)]">
                  설정
                </button>
              </div>
              <div className="px-4 py-10 text-center text-sm text-[var(--minimalism-secondary-label)]">
                콘텐츠 영역
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Segmented control and pagination">
            <div className="space-y-6">
              <div className="grid grid-cols-3 rounded-lg bg-[var(--minimalism-fill)] p-1">
                <button className="rounded-md bg-[var(--minimalism-surface)] px-4 py-2 text-sm font-semibold text-[var(--minimalism-label)] shadow-sm">
                  목록
                </button>
                <button className="rounded-md px-4 py-2 text-sm text-[var(--minimalism-secondary-label)]">
                  카드
                </button>
                <button className="rounded-md px-4 py-2 text-sm text-[var(--minimalism-secondary-label)]">
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
                        ? 'bg-[var(--minimalism-blue)] text-[var(--minimalism-accent-contrast)]'
                        : 'bg-[var(--minimalism-fill)] text-[var(--minimalism-label)]'
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
              <article className="rounded-lg border border-[var(--minimalism-separator)] bg-[var(--minimalism-surface)] p-5 shadow-[var(--minimalism-shadow)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-[var(--minimalism-label)]">
                      7월 정기 독서 모임
                    </h4>
                    <p className="mt-2 text-sm text-[var(--minimalism-secondary-label)]">
                      노출 중인 일정 카드 예시입니다.
                    </p>
                  </div>
                  <span className="rounded-lg bg-[var(--minimalism-blue)] px-3 py-1 text-xs font-semibold text-[var(--minimalism-accent-contrast)]">
                    D-3
                  </span>
                </div>
              </article>
              <ul className="overflow-hidden rounded-lg border border-[var(--minimalism-separator)] bg-[var(--minimalism-surface)] text-sm">
                <li className="border-b border-[var(--minimalism-separator)] px-4 py-3">
                  최근 공지
                </li>
                <li className="border-b border-[var(--minimalism-separator)] px-4 py-3">
                  이번 주 일정
                </li>
                <li className="px-4 py-3 font-semibold">문의 내역</li>
              </ul>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Progress, spinner, toast">
            <div className="space-y-6">
              <div className="h-2 overflow-hidden rounded-full bg-[var(--minimalism-fill)]">
                <div className="h-full w-2/3 rounded-full bg-[var(--minimalism-blue)]" />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="size-6 animate-spin rounded-full border-2 border-[var(--minimalism-fill-strong)] border-t-[var(--minimalism-blue)]" />
                <span className="rounded-lg bg-[var(--minimalism-surface-elevated)] px-5 py-3 text-sm text-[var(--minimalism-label)] shadow-[var(--minimalism-shadow)]">
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
