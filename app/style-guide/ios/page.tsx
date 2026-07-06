import Link from 'next/link';
import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/ios/_components/style-guide-section';

const iosNavigationItems = [
  { href: '/style-guide/ios/colors', label: 'Colors' },
  { href: '/style-guide/ios/forms', label: 'Forms' },
  { href: '/style-guide/ios/feedback', label: 'Alert · Modal · Confirm' },
  { href: '/style-guide/ios/components', label: 'Components' }
] as const;

export default function StyleGuidePage() {
  return (
    <>
      <PageIntro title="Overview">
        iOS 스타일 가이드는 grouped background, 선명한 system color, 넉넉한 터치
        영역, 부드러운 카드 표면을 기준으로 UI를 설계합니다. 모바일 우선 화면과
        iPad 확장 레이아웃을 함께 고려합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Structure" title="문서 구성">
        <div className="grid gap-6 lg:grid-cols-2">
          {iosNavigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <PreviewPanel title={item.label}>
                <p className="text-sm leading-6 text-[var(--ios-ink-soft)]">
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
          <div className="overflow-hidden rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-surface-grouped)] shadow-[var(--ios-shadow)]">
            <header className="flex items-center justify-between border-b border-[var(--ios-separator)] bg-[var(--ios-surface)] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-[var(--ios-blue)]" />
                <span className="font-semibold text-[var(--ios-label)]">
                  대전포스트잇
                </span>
              </div>
              <nav className="hidden gap-5 text-sm text-[var(--ios-secondary-label)] sm:flex">
                <a href="#" className="hover:text-[var(--ios-label)]">
                  홈
                </a>
                <a href="#" className="hover:text-[var(--ios-label)]">
                  공지
                </a>
                <a href="#" className="hover:text-[var(--ios-label)]">
                  일정
                </a>
              </nav>
            </header>
            <main className="border-b border-[var(--ios-separator)] bg-[var(--ios-surface-grouped)] px-4 py-12 text-sm text-[var(--ios-secondary-label)]">
              페이지 콘텐츠 영역
            </main>
            <footer className="bg-[var(--ios-surface)] px-4 py-4 text-sm text-[var(--ios-secondary-label)]">
              문의 · 신고 · 버전 정보
            </footer>
          </div>
        </PreviewPanel>
      </StyleGuideSection>
    </>
  );
}
