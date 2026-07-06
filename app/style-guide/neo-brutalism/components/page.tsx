import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/neo-brutalism/_components/style-guide-section';
import { componentNames } from 'lib/style-guide';

export default function StyleGuideComponentsPage() {
  return (
    <>
      <PageIntro title="Components">
        Neo-Brutalism 컴포넌트는 굵은 외곽선, 불투명한 표면, offset shadow,
        직설적인 상태 색상을 기준으로 구성합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Coverage" title="Component inventory">
        <div className="flex flex-wrap gap-2">
          {componentNames.map((name) => (
            <button
              key={name}
              className="border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-fill)] px-3 py-2 text-sm font-black text-[var(--neo-brutalism-label)] shadow-[3px_3px_0_var(--neo-brutalism-separator)] transition-transform hover:-translate-y-0.5"
            >
              {name}
            </button>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Navigation" title="Navigation components">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Navigation bar">
            <div className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface-grouped)] shadow-[var(--neo-brutalism-shadow)]">
              <div className="flex items-center justify-between border-b-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] px-4 py-3">
                <button className="text-sm font-black text-[var(--neo-brutalism-blue)] uppercase">
                  이전
                </button>
                <span className="font-black text-[var(--neo-brutalism-label)] uppercase">
                  대전포스트잇
                </span>
                <button className="text-sm font-black text-[var(--neo-brutalism-blue)] uppercase">
                  설정
                </button>
              </div>
              <div className="px-4 py-10 text-center text-sm text-[var(--neo-brutalism-secondary-label)]">
                콘텐츠 영역
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Segmented control and pagination">
            <div className="space-y-6">
              <div className="grid grid-cols-3 border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-fill)]">
                <button className="border-r-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface-grouped)] px-4 py-2 text-sm font-black text-[var(--neo-brutalism-label)]">
                  목록
                </button>
                <button className="border-r-4 border-[var(--neo-brutalism-separator)] px-4 py-2 text-sm font-semibold text-[var(--neo-brutalism-secondary-label)]">
                  카드
                </button>
                <button className="px-4 py-2 text-sm font-semibold text-[var(--neo-brutalism-secondary-label)]">
                  캘린더
                </button>
              </div>
              <div className="flex gap-2">
                {['이전', '1', '2'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className={`border-2 border-[var(--neo-brutalism-separator)] px-4 py-2 text-sm font-black shadow-[3px_3px_0_var(--neo-brutalism-separator)] ${
                      item === '1'
                        ? 'bg-[var(--neo-brutalism-blue)] text-[var(--neo-brutalism-accent-contrast)]'
                        : 'bg-[var(--neo-brutalism-fill)] text-[var(--neo-brutalism-label)]'
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
              <article className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] p-5 shadow-[var(--neo-brutalism-shadow)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-black text-[var(--neo-brutalism-label)] uppercase">
                      7월 정기 독서 모임
                    </h4>
                    <p className="mt-2 text-sm text-[var(--neo-brutalism-secondary-label)]">
                      노출 중인 일정 카드 예시입니다.
                    </p>
                  </div>
                  <span className="border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-blue)] px-3 py-1 text-xs font-black text-[var(--neo-brutalism-accent-contrast)] shadow-[3px_3px_0_var(--neo-brutalism-separator)]">
                    D-3
                  </span>
                </div>
              </article>
              <ul className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] text-sm font-semibold shadow-[var(--neo-brutalism-shadow)]">
                <li className="border-b-4 border-[var(--neo-brutalism-separator)] px-4 py-3">
                  최근 공지
                </li>
                <li className="border-b-4 border-[var(--neo-brutalism-separator)] px-4 py-3">
                  이번 주 일정
                </li>
                <li className="px-4 py-3 font-semibold">문의 내역</li>
              </ul>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Progress, spinner, toast">
            <div className="space-y-6">
              <div className="h-5 border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-fill)]">
                <div className="h-full w-2/3 bg-[var(--neo-brutalism-blue)]" />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="size-6 animate-spin rounded-full border-2 border-[var(--neo-brutalism-fill-strong)] border-t-[var(--neo-brutalism-blue)]" />
                <span className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface-elevated)] px-5 py-3 text-sm font-black text-[var(--neo-brutalism-label)] shadow-[var(--neo-brutalism-shadow)]">
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
