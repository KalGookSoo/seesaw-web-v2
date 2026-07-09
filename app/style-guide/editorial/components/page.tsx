import Link from 'next/link';
import {
  PageIntro,
  StyleGuideSection
} from 'app/style-guide/editorial/_components/style-guide-section';
import { editorialComponentItems } from 'app/style-guide/editorial/components/_components/component-items';

export default function StyleGuideComponentsPage() {
  return (
    <>
      <PageIntro title="Components">
        Editorial 컴포넌트는 강한 선, 여백, 세리프 타이포그래피, 날카로운 대비를
        기준으로 구성합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Coverage" title="Component inventory">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {editorialComponentItems.map((item) => (
            <Link
              key={item.href}
              className="group border border-[var(--editorial-line)] bg-[var(--editorial-surface)] p-5 transition-colors hover:bg-[var(--editorial-surface-muted)]"
              href={item.href}
            >
              <span className="block text-xs font-black tracking-[0.22em] text-[var(--editorial-ink)] uppercase">
                {item.label}
              </span>
              <span className="mt-3 block font-serif text-sm leading-7 text-[var(--editorial-ink-soft)] italic">
                {item.slug} 컴포넌트 샘플 열기
              </span>
            </Link>
          ))}
        </div>
      </StyleGuideSection>
    </>
  );
}
