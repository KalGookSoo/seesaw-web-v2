import Link from 'next/link';
import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/minimalism/_components/style-guide-section';

const minimalismNavigationItems = [
  { href: '/style-guide/minimalism/colors', label: 'Colors' },
  { href: '/style-guide/minimalism/forms', label: 'Forms' },
  {
    href: '/style-guide/minimalism/feedback',
    label: 'Alert · Modal · Confirm'
  },
  { href: '/style-guide/minimalism/components', label: 'Components' }
] as const;

export default function StyleGuidePage() {
  return (
    <>
      <PageIntro title="Overview">
        Minimalism 스타일 가이드는 적은 색, 얇은 경계선, 충분한 여백, 명확한
        타이포그래피로 UI를 설계합니다. 장식보다 정보의 위계와 반복 사용 시의
        피로도를 낮추는 데 집중합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Structure" title="문서 구성">
        <div className="grid gap-6 lg:grid-cols-2">
          {minimalismNavigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <PreviewPanel title={item.label}>
                <p className="text-sm leading-6 text-[var(--minimalism-ink-soft)]">
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
          <div className="overflow-hidden rounded-lg border border-[var(--minimalism-separator)] bg-[var(--minimalism-surface-grouped)]">
            <header className="flex items-center justify-between border-b border-[var(--minimalism-separator)] bg-[var(--minimalism-surface)] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="size-6 border border-[var(--minimalism-label)]" />
                <span className="font-semibold text-[var(--minimalism-label)]">
                  대전포스트잇
                </span>
              </div>
              <nav className="hidden gap-5 text-sm text-[var(--minimalism-secondary-label)] sm:flex">
                <a href="#" className="hover:text-[var(--minimalism-label)]">
                  홈
                </a>
                <a href="#" className="hover:text-[var(--minimalism-label)]">
                  공지
                </a>
                <a href="#" className="hover:text-[var(--minimalism-label)]">
                  일정
                </a>
              </nav>
            </header>
            <main className="border-b border-[var(--minimalism-separator)] bg-[var(--minimalism-surface-grouped)] px-4 py-12 text-sm text-[var(--minimalism-secondary-label)]">
              페이지 콘텐츠 영역
            </main>
            <footer className="bg-[var(--minimalism-surface)] px-4 py-4 text-sm text-[var(--minimalism-secondary-label)]">
              문의 · 신고 · 버전 정보
            </footer>
          </div>
        </PreviewPanel>
      </StyleGuideSection>
    </>
  );
}
