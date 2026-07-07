import Link from 'next/link';
import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/windows-98-fluent/_components/style-guide-section';

const windows98FluentNavigationItems = [
  { href: '/style-guide/windows-98-fluent/colors', label: 'Colors' },
  { href: '/style-guide/windows-98-fluent/forms', label: 'Forms' },
  { href: '/style-guide/windows-98-fluent/components', label: 'Components' }
] as const;

export default function StyleGuidePage() {
  return (
    <>
      <PageIntro title="Overview">
        Windows 98 Fluent 스타일 가이드는 회색 시스템 표면, 파란 타이틀바,
        raised button, sunken input, 고전적인 대화상자 질감을 현재 서비스 화면에
        맞게 재해석합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Structure" title="문서 구성">
        <div className="grid gap-6 lg:grid-cols-2">
          {windows98FluentNavigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <PreviewPanel title={item.label}>
                <p className="text-sm leading-6 text-[var(--windows-98-fluent-ink-soft)]">
                  {item.label} 기준을 별도 페이지에서 확인합니다. 이후 개별
                  컴포넌트가 늘어나면 이 하위에 세부 페이지를 추가합니다.
                </p>
              </PreviewPanel>
            </Link>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Shell" title="Application layout preview">
        <PreviewPanel title="Header · Main · Footer">
          <div className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
            <header className="flex items-center justify-between bg-[var(--windows-98-fluent-accent)] px-4 py-2 text-[var(--windows-98-fluent-accent-contrast)]">
              <div className="flex items-center gap-3">
                <div className="size-5 border border-white bg-[var(--windows-98-fluent-fill)] shadow-[var(--windows-98-fluent-shadow-soft)]" />
                <span className="font-mono font-semibold">
                  daejeonstickybook.exe
                </span>
              </div>
              <nav className="hidden gap-5 text-sm sm:flex">
                <a href="#" className="underline">
                  홈
                </a>
                <a href="#" className="underline">
                  공지
                </a>
                <a href="#" className="underline">
                  일정
                </a>
              </nav>
            </header>
            <main className="my-1 border border-[var(--windows-98-fluent-line-soft)] bg-[var(--windows-98-fluent-surface-elevated)] px-4 py-12 text-center font-mono text-sm text-[var(--windows-98-fluent-secondary-label)] shadow-[var(--windows-98-fluent-inset-pressed)]">
              페이지 콘텐츠 영역
            </main>
            <footer className="border border-[var(--windows-98-fluent-line-soft)] bg-[var(--windows-98-fluent-surface)] px-4 py-4 text-sm text-[var(--windows-98-fluent-secondary-label)]">
              문의 · 신고 · 버전 정보
            </footer>
          </div>
        </PreviewPanel>
      </StyleGuideSection>
    </>
  );
}
