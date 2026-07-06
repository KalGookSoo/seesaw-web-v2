import Link from 'next/link';
import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/retro-web/_components/style-guide-section';

const retroWebNavigationItems = [
  { href: '/style-guide/retro-web/colors', label: 'Colors' },
  { href: '/style-guide/retro-web/forms', label: 'Forms' },
  { href: '/style-guide/retro-web/feedback', label: 'Alert · Modal · Confirm' },
  { href: '/style-guide/retro-web/components', label: 'Components' }
] as const;

export default function StyleGuidePage() {
  return (
    <>
      <PageIntro title="Overview">
        Retro Web 스타일 가이드는 초기 웹 페이지와 데스크톱 UI의 패널, 메뉴바,
        얇은 테두리, 작은 그림자를 현재 서비스 화면에 맞게 절제해 재해석합니다.
        색상은 파스텔 톤으로 낮춰 라이트/다크 모드 모두 튀지 않게 구성합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Structure" title="문서 구성">
        <div className="grid gap-6 lg:grid-cols-2">
          {retroWebNavigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <PreviewPanel title={item.label}>
                <p className="text-sm leading-6 text-[var(--retro-web-ink-soft)]">
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
          <div className="border border-[var(--retro-web-separator)] bg-[var(--retro-web-surface-grouped)] p-1 shadow-[var(--retro-web-shadow)]">
            <header className="flex items-center justify-between border border-[var(--retro-web-line-soft)] bg-[var(--retro-web-surface)] px-4 py-3 shadow-[var(--retro-web-inset)]">
              <div className="flex items-center gap-3">
                <div className="size-8 border border-[var(--retro-web-separator)] bg-[var(--retro-web-blue)] shadow-[var(--retro-web-shadow-soft)]" />
                <span className="font-mono font-semibold text-[var(--retro-web-label)]">
                  대전포스트잇
                </span>
              </div>
              <nav className="hidden gap-5 text-sm text-[var(--retro-web-secondary-label)] sm:flex">
                <a href="#" className="hover:text-[var(--retro-web-label)]">
                  홈
                </a>
                <a href="#" className="hover:text-[var(--retro-web-label)]">
                  공지
                </a>
                <a href="#" className="hover:text-[var(--retro-web-label)]">
                  일정
                </a>
              </nav>
            </header>
            <main className="my-1 border border-[var(--retro-web-line-soft)] bg-[var(--retro-web-surface-grouped)] px-4 py-12 text-center font-mono text-sm text-[var(--retro-web-secondary-label)] shadow-[var(--retro-web-inset)]">
              페이지 콘텐츠 영역
            </main>
            <footer className="border border-[var(--retro-web-line-soft)] bg-[var(--retro-web-surface)] px-4 py-4 text-sm text-[var(--retro-web-secondary-label)]">
              문의 · 신고 · 버전 정보
            </footer>
          </div>
        </PreviewPanel>
      </StyleGuideSection>
    </>
  );
}
