import { PageIntro, PreviewPanel, StyleGuideSection } from 'app/style-guide/glassmorphism/_components/style-guide-section';
import { componentNames } from 'lib/style-guide';

export default function StyleGuideComponentsPage() {
  return (
    <>
      <PageIntro title="Components">
        컴포넌트 표면은 배경과 완전히 분리하지 않고, 뒤쪽 색과 빛을 은근히 통과시키는 방식으로 구성합니다. 탐색, 카드, 리스트, 피드백 요소가
        같은 blur depth를 공유하는지 확인합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Coverage" title="Component inventory">
        <div className="flex flex-wrap gap-2">
          {componentNames.map((name) => (
            <button
              key={name}
              className="rounded-full border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--glassmorphism-ink)] shadow-sm backdrop-blur-xl transition-colors hover:bg-[var(--glassmorphism-surface-strong)]"
            >
              {name}
            </button>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Navigation" title="Navigation components">
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewPanel title="Floating navbar">
            <div className="rounded-3xl border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface-muted)] p-4 shadow-[var(--glassmorphism-shadow)] backdrop-blur-2xl">
              <div className="flex items-center justify-between rounded-full border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface)] px-4 py-3 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-[var(--glassmorphism-accent)] shadow-[var(--glassmorphism-accent)]/25 shadow-lg" />
                  <span className="font-semibold text-[var(--glassmorphism-ink)]">대전포스트잇</span>
                </div>
                <nav className="hidden gap-5 text-sm text-[var(--glassmorphism-ink-soft)] sm:flex">
                  <a href="#">홈</a>
                  <a href="#">공지</a>
                  <a href="#">일정</a>
                </nav>
              </div>
              <div className="px-4 py-10 text-sm text-[var(--glassmorphism-ink-soft)]">본문 영역이 유리 표면 아래로 흐르는 예시입니다.</div>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Tabs and pagination">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface-muted)] p-1 backdrop-blur-xl">
                <button className="rounded-full bg-[var(--glassmorphism-surface-strong)] px-4 py-2 text-sm font-semibold text-[var(--glassmorphism-ink)] shadow-sm">
                  목록
                </button>
                <button className="rounded-full px-4 py-2 text-sm text-[var(--glassmorphism-ink-soft)]">카드</button>
                <button className="rounded-full px-4 py-2 text-sm text-[var(--glassmorphism-ink-soft)]">캘린더</button>
              </div>
              <div className="inline-flex gap-2">
                {['이전', '1', '2'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className={`rounded-full border border-[var(--glassmorphism-line)] px-4 py-2 text-sm backdrop-blur-xl ${
                      item === '1'
                        ? 'bg-[var(--glassmorphism-accent)] text-[var(--glassmorphism-accent-contrast)]'
                        : 'bg-[var(--glassmorphism-surface)] text-[var(--glassmorphism-ink)]'
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
          <PreviewPanel title="Glass card and list">
            <div className="space-y-5">
              <article className="rounded-3xl border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface-muted)] p-5 shadow-[var(--glassmorphism-shadow)] backdrop-blur-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-[var(--glassmorphism-ink)]">7월 정기 독서 모임</h4>
                    <p className="mt-2 text-sm text-[var(--glassmorphism-ink-soft)]">노출 중인 일정 카드 예시입니다.</p>
                  </div>
                  <span className="rounded-full bg-[var(--glassmorphism-accent)] px-3 py-1 text-xs font-semibold text-[var(--glassmorphism-accent-contrast)]">
                    D-3
                  </span>
                </div>
              </article>
              <ul className="overflow-hidden rounded-3xl border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface-muted)] text-sm backdrop-blur-xl">
                <li className="border-b border-[var(--glassmorphism-line-soft)] px-4 py-3">최근 공지</li>
                <li className="border-b border-[var(--glassmorphism-line-soft)] px-4 py-3">이번 주 일정</li>
                <li className="px-4 py-3 font-semibold">문의 내역</li>
              </ul>
            </div>
          </PreviewPanel>

          <PreviewPanel title="Feedback fragments">
            <div className="space-y-6">
              <div className="h-2 overflow-hidden rounded-full bg-[var(--glassmorphism-surface-muted)]">
                <div className="h-full w-2/3 rounded-full bg-[var(--glassmorphism-accent)]" />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="size-6 animate-spin rounded-full border-2 border-[var(--glassmorphism-line)] border-t-[var(--glassmorphism-accent)]" />
                <span className="rounded-2xl border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface)] px-5 py-3 text-sm text-[var(--glassmorphism-ink)] shadow-[var(--glassmorphism-shadow)] backdrop-blur-xl">
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
