import Link from 'next/link';
import { PageIntro, PreviewPanel, StyleGuideSection } from 'app/style-guide/glassmorphism/_components/style-guide-section';

const glassmorphismNavigationItems = [
  { href: '/style-guide/glassmorphism/colors', label: 'Colors' },
  { href: '/style-guide/glassmorphism/forms', label: 'Forms' },
  { href: '/style-guide/glassmorphism/feedback', label: 'Alert · Modal · Confirm' },
  { href: '/style-guide/glassmorphism/components', label: 'Components' }
] as const;

export default function StyleGuidePage() {
  return (
    <>
      <PageIntro title="Overview">
        Glassmorphism 스타일 가이드는 투명한 레이어, 강한 blur, 빛 번짐과 부드러운 경계선을 기준으로 UI 표면을 설계합니다. 배경 이미지와
        사이트 컬러가 은근히 비치는 화면에 적합한 컴포넌트 조합을 확인합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Structure" title="문서 구성">
        <div className="grid gap-6 lg:grid-cols-2">
          {glassmorphismNavigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <PreviewPanel title={item.label}>
                <p className="text-sm leading-6 text-[var(--glassmorphism-ink-soft)]">
                  {item.label} 기준을 별도 페이지에서 확인합니다. 이후 개별 컴포넌트가 늘어나면 이 하위에 세부 페이지를 추가합니다.
                </p>
              </PreviewPanel>
            </Link>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Shell" title="Application layout preview">
        <PreviewPanel title="Header · Main · Footer">
          <div className="overflow-hidden rounded-3xl border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface-muted)] shadow-[var(--glassmorphism-shadow)] backdrop-blur-2xl">
            <header className="flex items-center justify-between border-b border-[var(--glassmorphism-line-soft)] bg-[var(--glassmorphism-surface)] px-4 py-3 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-[var(--glassmorphism-accent)] shadow-[var(--glassmorphism-accent)]/25 shadow-lg" />
                <span className="font-semibold text-[var(--glassmorphism-ink)]">대전포스트잇</span>
              </div>
              <nav className="hidden gap-6 text-xs font-bold tracking-wider text-[var(--glassmorphism-ink-muted)] uppercase sm:flex">
                <a href="#" className="hover:text-[var(--glassmorphism-ink)]">
                  홈
                </a>
                <a href="#" className="hover:text-[var(--glassmorphism-ink)]">
                  공지
                </a>
                <a href="#" className="hover:text-[var(--glassmorphism-ink)]">
                  일정
                </a>
              </nav>
            </header>
            <main className="border-b border-[var(--glassmorphism-line-soft)] bg-[var(--glassmorphism-surface-muted)] px-4 py-12 text-sm text-[var(--glassmorphism-ink-soft)] backdrop-blur-xl">
              페이지 콘텐츠 영역
            </main>
            <footer className="bg-[var(--glassmorphism-surface)] px-4 py-4 text-xs tracking-widest text-[var(--glassmorphism-ink-muted)] uppercase backdrop-blur-xl">
              문의 · 신고 · 버전 정보
            </footer>
          </div>
        </PreviewPanel>
      </StyleGuideSection>
    </>
  );
}
