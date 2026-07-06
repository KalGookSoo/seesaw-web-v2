import Link from 'next/link';
import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/neo-brutalism/_components/style-guide-section';

const neoBrutalismNavigationItems = [
  { href: '/style-guide/neo-brutalism/colors', label: 'Colors' },
  { href: '/style-guide/neo-brutalism/forms', label: 'Forms' },
  {
    href: '/style-guide/neo-brutalism/feedback',
    label: 'Alert · Modal · Confirm'
  },
  { href: '/style-guide/neo-brutalism/components', label: 'Components' }
] as const;

export default function StyleGuidePage() {
  return (
    <>
      <PageIntro title="Overview">
        Neo-Brutalism 스타일 가이드는 굵은 경계선, 의도적으로 드러낸 그림자,
        원색에 가까운 강조색으로 UI를 설계합니다. 정제된 장식보다 구조와
        상호작용을 직설적으로 보여주는 화면에 어울립니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Structure" title="문서 구성">
        <div className="grid gap-6 lg:grid-cols-2">
          {neoBrutalismNavigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <PreviewPanel title={item.label}>
                <p className="text-sm leading-6 font-semibold text-[var(--neo-brutalism-ink-soft)]">
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
          <div className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface-grouped)] shadow-[var(--neo-brutalism-shadow)]">
            <header className="flex items-center justify-between border-b-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="size-8 border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-blue)] shadow-[3px_3px_0_var(--neo-brutalism-separator)]" />
                <span className="font-black text-[var(--neo-brutalism-label)] uppercase">
                  대전포스트잇
                </span>
              </div>
              <nav className="hidden gap-5 text-sm text-[var(--neo-brutalism-secondary-label)] sm:flex">
                <a href="#" className="hover:text-[var(--neo-brutalism-label)]">
                  홈
                </a>
                <a href="#" className="hover:text-[var(--neo-brutalism-label)]">
                  공지
                </a>
                <a href="#" className="hover:text-[var(--neo-brutalism-label)]">
                  일정
                </a>
              </nav>
            </header>
            <main className="border-b-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface-grouped)] px-4 py-12 text-sm font-black text-[var(--neo-brutalism-label)] uppercase">
              페이지 콘텐츠 영역
            </main>
            <footer className="bg-[var(--neo-brutalism-surface)] px-4 py-4 text-sm font-semibold text-[var(--neo-brutalism-secondary-label)]">
              문의 · 신고 · 버전 정보
            </footer>
          </div>
        </PreviewPanel>
      </StyleGuideSection>
    </>
  );
}
