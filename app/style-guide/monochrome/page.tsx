import Link from 'next/link';
import { PageIntro, PreviewPanel, StyleGuideSection } from 'app/style-guide/monochrome/_components/style-guide-section';

const pages = [
  { href: '/style-guide/monochrome/colors', title: 'Colors', desc: '배경, 표면, 잉크, 선, 상태색의 역할과 대비 기준' },
  { href: '/style-guide/monochrome/forms', title: 'Forms', desc: '입력, 선택, 검색, 검증 상태를 위한 조용한 컨트롤' },
  { href: '/style-guide/monochrome/components', title: 'Components', desc: '게시글, 일정, 탐색에 사용하는 공통 UI 조합' }
] as const;

export default function MonochromeStyleGuidePage() {
  return (
    <>
      <PageIntro title="Quiet interfaces, clear decisions.">모노톤은 색을 없애는 것이 아니라, 색의 수를 줄여 정보의 위계와 사용자의 행동을 더 또렷하게 만드는 방향입니다. Seesaw의 콘텐츠와 커뮤니티가 화면의 주인공이 되도록 표면과 선, 잉크의 관계를 세심하게 조율합니다.</PageIntro>
      <StyleGuideSection eyebrow="Principles" title="Design principles">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Quiet surface', '배경과 표면은 가까운 회색조로 두어 오래 보아도 피로하지 않게 합니다.'],
            ['Strong hierarchy', '색 대신 크기, 굵기, 간격, 선으로 정보의 우선순위를 표현합니다.'],
            ['Useful contrast', '강한 대비는 링크, 포커스, 위험한 행동처럼 의미가 필요한 순간에만 사용합니다.']
          ].map(([title, description]) => <PreviewPanel key={title} title={title}><p className="text-sm leading-6 text-[var(--monochrome-secondary-label)]">{description}</p></PreviewPanel>)}
        </div>
      </StyleGuideSection>
      <StyleGuideSection eyebrow="Foundation" title="Explore the system">
        <div className="grid gap-4 md:grid-cols-3">
          {pages.map((page) => <Link key={page.href} href={page.href} className="group rounded-[var(--monochrome-radius)] border border-[var(--monochrome-separator)] bg-[var(--monochrome-surface)] p-5 shadow-[var(--monochrome-shadow)] transition-transform hover:-translate-y-0.5"><h3 className="font-semibold text-[var(--monochrome-label)]">{page.title}</h3><p className="mt-2 text-sm leading-6 text-[var(--monochrome-secondary-label)]">{page.desc}</p><span className="mt-5 block text-xs font-semibold tracking-[0.14em] text-[var(--monochrome-tertiary-label)] uppercase transition-colors group-hover:text-[var(--monochrome-accent)]">Open guide →</span></Link>)}
        </div>
      </StyleGuideSection>
    </>
  );
}
