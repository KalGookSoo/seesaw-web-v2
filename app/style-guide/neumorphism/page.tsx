import Link from 'next/link';
import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/neumorphism/_components/style-guide-section';

const neumorphismNavigationItems = [
  { href: '/style-guide/neumorphism/colors', label: 'Colors' },
  { href: '/style-guide/neumorphism/forms', label: 'Forms' },
  {
    href: '/style-guide/neumorphism/feedback',
    label: 'Alert · Modal · Confirm'
  },
  { href: '/style-guide/neumorphism/components', label: 'Components' }
] as const;

export default function StyleGuidePage() {
  return (
    <>
      <PageIntro title="Overview">
        Neumorphism 스타일 가이드는 표면과 배경을 같은 색 계열로 맞추고, 아주
        낮은 음영으로 정보 블록을 부드럽게 분리합니다. 과장된 입체감보다 편안한
        대비, 파스텔 포인트, 조용한 촉감을 우선합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Structure" title="문서 구성">
        <div className="grid gap-6 lg:grid-cols-2">
          {neumorphismNavigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <PreviewPanel title={item.label}>
                <p className="text-sm leading-6 text-[var(--neumorphism-ink-soft)]">
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
          <div className="overflow-hidden rounded-3xl border border-[var(--neumorphism-separator)] bg-[var(--neumorphism-surface)] p-3 shadow-[var(--neumorphism-shadow)]">
            <header className="flex items-center justify-between rounded-2xl bg-[var(--neumorphism-surface)] px-4 py-3 shadow-[var(--neumorphism-shadow-inset)]">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-2xl bg-[var(--neumorphism-blue)] shadow-[var(--neumorphism-shadow-soft)]" />
                <span className="font-semibold text-[var(--neumorphism-label)]">
                  대전포스트잇
                </span>
              </div>
              <nav className="hidden gap-5 text-sm text-[var(--neumorphism-secondary-label)] sm:flex">
                <a href="#" className="hover:text-[var(--neumorphism-label)]">
                  홈
                </a>
                <a href="#" className="hover:text-[var(--neumorphism-label)]">
                  공지
                </a>
                <a href="#" className="hover:text-[var(--neumorphism-label)]">
                  일정
                </a>
              </nav>
            </header>
            <main className="mx-2 my-3 rounded-3xl bg-[var(--neumorphism-surface-grouped)] px-4 py-12 text-center text-sm text-[var(--neumorphism-secondary-label)] shadow-[var(--neumorphism-shadow-inset)]">
              페이지 콘텐츠 영역
            </main>
            <footer className="px-4 py-4 text-sm text-[var(--neumorphism-secondary-label)]">
              문의 · 신고 · 버전 정보
            </footer>
          </div>
        </PreviewPanel>
      </StyleGuideSection>
    </>
  );
}
