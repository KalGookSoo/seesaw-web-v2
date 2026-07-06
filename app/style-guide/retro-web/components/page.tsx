import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/retro-web/_components/style-guide-section';
import { componentNames } from 'lib/style-guide';

export default function StyleGuideComponentsPage() {
  return (
    <>
      <PageIntro title="Components">
        Retro Web 컴포넌트는 얇은 패널 테두리, 작은 그림자, 메뉴바 형태의 구획,
        파스텔 상태 색상을 기준으로 구성합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Coverage" title="Component inventory">
        <div className="flex flex-wrap gap-2">
          {componentNames.map((name) => (
            <button
              key={name}
              className="border border-[var(--retro-web-separator)] bg-[var(--retro-web-fill)] px-3 py-2 font-mono text-sm font-medium text-[var(--retro-web-label)] shadow-[var(--retro-web-shadow-soft)] transition-colors hover:bg-[var(--retro-web-fill-strong)]"
            >
              {name}
            </button>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Navigation" title="Navigation components">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Navigation bar">
            <div className="border border-[var(--retro-web-separator)] bg-[var(--retro-web-surface-grouped)] p-1 shadow-[var(--retro-web-shadow)]">
              <div className="flex items-center justify-between border border-[var(--retro-web-line-soft)] bg-[var(--retro-web-surface)] px-4 py-3 shadow-[var(--retro-web-inset)]">
                <button className="font-mono text-sm font-semibold text-[var(--retro-web-blue)]">
                  이전
                </button>
                <span className="font-mono font-semibold text-[var(--retro-web-label)]">
                  대전포스트잇
                </span>
                <button className="font-mono text-sm font-semibold text-[var(--retro-web-blue)]">
                  설정
                </button>
              </div>
              <div className="px-4 py-10 text-center text-sm text-[var(--retro-web-secondary-label)]">
                콘텐츠 영역
              </div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Segmented control and pagination">
            <div className="space-y-6">
              <div className="grid grid-cols-3 border border-[var(--retro-web-separator)] bg-[var(--retro-web-fill)] p-1 shadow-[var(--retro-web-inset)]">
                <button className="border border-[var(--retro-web-line-soft)] bg-[var(--retro-web-surface)] px-4 py-2 font-mono text-sm font-semibold text-[var(--retro-web-label)] shadow-[var(--retro-web-shadow-soft)]">
                  목록
                </button>
                <button className="px-4 py-2 font-mono text-sm text-[var(--retro-web-secondary-label)]">
                  카드
                </button>
                <button className="px-4 py-2 font-mono text-sm text-[var(--retro-web-secondary-label)]">
                  캘린더
                </button>
              </div>
              <div className="flex gap-2">
                {['이전', '1', '2'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className={`border border-[var(--retro-web-separator)] px-4 py-2 font-mono text-sm font-medium shadow-[var(--retro-web-shadow-soft)] ${
                      item === '1'
                        ? 'bg-[var(--retro-web-blue)] text-[var(--retro-web-accent-contrast)]'
                        : 'bg-[var(--retro-web-fill)] text-[var(--retro-web-label)]'
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
              <article className="border border-[var(--retro-web-separator)] bg-[var(--retro-web-surface)] p-5 shadow-[var(--retro-web-shadow)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-[var(--retro-web-label)]">
                      7월 정기 독서 모임
                    </h4>
                    <p className="mt-2 text-sm text-[var(--retro-web-secondary-label)]">
                      노출 중인 일정 카드 예시입니다.
                    </p>
                  </div>
                  <span className="border border-[var(--retro-web-separator)] bg-[var(--retro-web-blue)] px-3 py-1 font-mono text-xs font-semibold text-[var(--retro-web-accent-contrast)] shadow-[var(--retro-web-shadow-soft)]">
                    D-3
                  </span>
                </div>
              </article>
              <ul className="border border-[var(--retro-web-separator)] bg-[var(--retro-web-surface)] text-sm shadow-[var(--retro-web-shadow)]">
                <li className="border-b border-[var(--retro-web-separator)] px-4 py-3">
                  최근 공지
                </li>
                <li className="border-b border-[var(--retro-web-separator)] px-4 py-3">
                  이번 주 일정
                </li>
                <li className="px-4 py-3 font-semibold">문의 내역</li>
              </ul>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Progress, spinner, toast">
            <div className="space-y-6">
              <div className="h-4 border border-[var(--retro-web-separator)] bg-[var(--retro-web-fill)] shadow-[var(--retro-web-inset)]">
                <div className="h-full w-2/3 bg-[var(--retro-web-blue)]" />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="size-6 animate-spin rounded-full border-2 border-[var(--retro-web-fill-strong)] border-t-[var(--retro-web-blue)]" />
                <span className="border border-[var(--retro-web-separator)] bg-[var(--retro-web-surface-elevated)] px-5 py-3 font-mono text-sm text-[var(--retro-web-label)] shadow-[var(--retro-web-shadow)]">
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
