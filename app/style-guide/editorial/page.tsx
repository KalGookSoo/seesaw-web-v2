import Link from 'next/link';
import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/editorial/_components/style-guide-section';

const editorialNavigationItems = [
  { href: '/style-guide/editorial/colors', label: 'Colors' },
  { href: '/style-guide/editorial/forms', label: 'Forms' },
  { href: '/style-guide/editorial/feedback', label: 'Alert · Modal · Confirm' },
  { href: '/style-guide/editorial/components', label: 'Components' }
] as const;

export default function StyleGuidePage() {
  return (
    <>
      <PageIntro title="Overview">
        스타일 가이드는 페이지 단위로 나누어 관리합니다. 각 페이지는 컴포넌트의
        속성, 상태, 조합 사례를 분리해서 보여주며, `layout.html`의 header, main,
        footer 골격을 Next.js 컴포넌트로 옮기기 전 기준선으로 사용합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Structure" title="문서 구성">
        <div className="grid gap-6 lg:grid-cols-2">
          {editorialNavigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <PreviewPanel title={item.label}>
                <p className="font-serif text-sm leading-6 text-[var(--editorial-ink-soft)] italic">
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
          <div className="rounded-none border border-[var(--editorial-line)]">
            <header className="flex items-center justify-between border-b border-[var(--editorial-line-soft)] bg-[var(--editorial-surface)] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="size-6 rounded-none bg-[var(--editorial-line)]" />
                <span className="font-serif font-bold text-[var(--editorial-ink)]">
                  대전포스트잇
                </span>
              </div>
              <nav className="hidden gap-6 text-xs font-bold tracking-wider text-[var(--editorial-ink-muted)] uppercase sm:flex">
                <a href="#" className="hover:text-[var(--editorial-ink)]">
                  홈
                </a>
                <a href="#" className="hover:text-[var(--editorial-ink)]">
                  공지
                </a>
                <a href="#" className="hover:text-[var(--editorial-ink)]">
                  일정
                </a>
              </nav>
            </header>
            <main className="border-b border-[var(--editorial-line-soft)] bg-[var(--editorial-surface-muted)] px-4 py-12 font-serif text-sm text-[var(--editorial-ink-soft)] italic">
              페이지 콘텐츠 영역
            </main>
            <footer className="bg-[var(--editorial-surface)] px-4 py-4 text-xs tracking-widest text-[var(--editorial-ink-muted)] uppercase">
              문의 · 신고 · 버전 정보
            </footer>
          </div>
        </PreviewPanel>
      </StyleGuideSection>
    </>
  );
}
