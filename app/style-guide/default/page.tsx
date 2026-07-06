import Link from 'next/link';
import {
  PageIntro,
  PreviewPanel,
  StyleGuideSection
} from 'app/style-guide/default/_components/style-guide-section';
import { styleGuideNavigationItems } from 'lib/style-guide';

export default function StyleGuidePage() {
  return (
    <>
      <PageIntro title="Overview">
        스타일 가이드는 페이지 단위로 나누어 관리합니다. 각 페이지는 컴포넌트의
        속성, 상태, 조합 사례를 분리해서 보여주며, `layout.html`의 header, main,
        footer 골격을 Next.js 컴포넌트로 옮기기 전 기준선으로 사용합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Structure" title="문서 구성">
        <div className="grid gap-4 lg:grid-cols-2">
          {styleGuideNavigationItems.slice(1).map((item) => (
            <Link key={item.href} href={item.href}>
              <PreviewPanel title={item.label}>
                <p className="text-default-secondary-label text-sm leading-6">
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
          <div className="border-default-separator overflow-hidden rounded-lg border">
            <header className="border-default-separator bg-default-surface flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="bg-default-blue size-8 rounded-md" />
                <span className="text-default-label font-semibold">
                  대전포스트잇
                </span>
              </div>
              <nav className="text-default-secondary-label hidden gap-4 text-sm sm:flex">
                <a href="#">홈</a>
                <a href="#">공지</a>
                <a href="#">일정</a>
              </nav>
            </header>
            <main className="bg-default-surface-grouped text-default-secondary-label px-4 py-10 text-sm">
              페이지 콘텐츠 영역
            </main>
            <footer className="border-default-separator bg-default-surface text-default-secondary-label border-t px-4 py-4 text-sm">
              문의 · 신고 · 버전 정보
            </footer>
          </div>
        </PreviewPanel>
      </StyleGuideSection>
    </>
  );
}
