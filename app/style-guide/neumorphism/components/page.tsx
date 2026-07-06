import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/neumorphism/_components/style-guide-section';
import { componentNames } from 'lib/style-guide';

export default function StyleGuideComponentsPage() {
  return (
    <>
      <PageIntro title="Components">
        Neumorphism 컴포넌트는 낮은 대비의 표면과 부드러운 그림자, 파스텔 상태
        색상을 기준으로 구성합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Coverage" title="Component inventory">
        <div className="flex flex-wrap gap-2">
          {componentNames.map((name) => (
            <button
              key={name}
              className="rounded-2xl bg-[var(--neumorphism-surface)] px-4 py-2 text-sm font-medium text-[var(--neumorphism-label)] shadow-[var(--neumorphism-shadow-soft)] transition-shadow hover:shadow-[var(--neumorphism-shadow-inset)]"
            >
              {name}
            </button>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Navigation" title="Navigation components">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Navigation bar">
            <div className="overflow-hidden rounded-3xl border border-[var(--neumorphism-separator)] bg-[var(--neumorphism-surface)] p-3 shadow-[var(--neumorphism-shadow)]">
              <div className="flex items-center justify-between rounded-2xl bg-[var(--neumorphism-surface)] px-4 py-3 shadow-[var(--neumorphism-shadow-inset)]">
                <button className="text-sm font-semibold text-[var(--neumorphism-blue)]">
                  이전
                </button>
                <span className="font-semibold text-[var(--neumorphism-label)]">
                  대전포스트잇
                </span>
                <button className="text-sm font-semibold text-[var(--neumorphism-blue)]">
                  설정
                </button>
              </div>
              <div className="px-4 py-10 text-center text-sm text-[var(--neumorphism-secondary-label)]">
                콘텐츠 영역
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Segmented control and pagination">
            <div className="space-y-6">
              <div className="grid grid-cols-3 rounded-3xl bg-[var(--neumorphism-surface)] p-2 shadow-[var(--neumorphism-shadow-inset)]">
                <button className="rounded-2xl bg-[var(--neumorphism-surface)] px-4 py-2 text-sm font-semibold text-[var(--neumorphism-label)] shadow-[var(--neumorphism-shadow-soft)]">
                  목록
                </button>
                <button className="rounded-md px-4 py-2 text-sm text-[var(--neumorphism-secondary-label)]">
                  카드
                </button>
                <button className="rounded-md px-4 py-2 text-sm text-[var(--neumorphism-secondary-label)]">
                  캘린더
                </button>
              </div>
              <div className="flex gap-2">
                {['이전', '1', '2'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className={`rounded-2xl px-4 py-2 text-sm font-medium shadow-[var(--neumorphism-shadow-soft)] ${
                      item === '1'
                        ? 'bg-[var(--neumorphism-blue)] text-[var(--neumorphism-accent-contrast)]'
                        : 'bg-[var(--neumorphism-fill)] text-[var(--neumorphism-label)]'
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
              <article className="rounded-3xl border border-[var(--neumorphism-separator)] bg-[var(--neumorphism-surface)] p-5 shadow-[var(--neumorphism-shadow)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-[var(--neumorphism-label)]">
                      7월 정기 독서 모임
                    </h4>
                    <p className="mt-2 text-sm text-[var(--neumorphism-secondary-label)]">
                      노출 중인 일정 카드 예시입니다.
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--neumorphism-blue)] px-3 py-1 text-xs font-semibold text-[var(--neumorphism-accent-contrast)] shadow-[var(--neumorphism-shadow-soft)]">
                    D-3
                  </span>
                </div>
              </article>
              <ul className="overflow-hidden rounded-3xl border border-[var(--neumorphism-separator)] bg-[var(--neumorphism-surface)] text-sm shadow-[var(--neumorphism-shadow-inset)]">
                <li className="border-b border-[var(--neumorphism-separator)] px-4 py-3">
                  최근 공지
                </li>
                <li className="border-b border-[var(--neumorphism-separator)] px-4 py-3">
                  이번 주 일정
                </li>
                <li className="px-4 py-3 font-semibold">문의 내역</li>
              </ul>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Progress, spinner, toast">
            <div className="space-y-6">
              <div className="h-3 overflow-hidden rounded-full bg-[var(--neumorphism-fill)] shadow-[var(--neumorphism-shadow-inset)]">
                <div className="h-full w-2/3 rounded-full bg-[var(--neumorphism-blue)]" />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="size-6 animate-spin rounded-full border-2 border-[var(--neumorphism-fill-strong)] border-t-[var(--neumorphism-blue)]" />
                <span className="rounded-2xl bg-[var(--neumorphism-surface-elevated)] px-5 py-3 text-sm text-[var(--neumorphism-label)] shadow-[var(--neumorphism-shadow)]">
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
