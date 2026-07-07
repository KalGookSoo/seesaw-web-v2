import Link from 'next/link';
import {
  PageIntro,
  StyleGuideSection
} from 'app/style-guide/windows-98-fluent/_components/style-guide-section';
import { windows98ComponentItems } from 'app/style-guide/windows-98-fluent/components/_components/component-items';

export default function StyleGuideComponentsPage() {
  return (
    <>
      <PageIntro title="Components">
        Windows 98 Fluent 컴포넌트는 raised button, sunken panel, active title
        bar, 시스템 회색 표면을 기준으로 구성합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Coverage" title="Component inventory">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {windows98ComponentItems.map((item) => (
            <Link
              key={item.href}
              className="group border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)] transition-colors hover:bg-[var(--windows-98-fluent-surface-elevated)]"
              href={item.href}
            >
              <span className="block bg-[var(--windows-98-fluent-accent)] px-3 py-2 font-mono text-sm font-bold text-[var(--windows-98-fluent-accent-contrast)]">
                {item.label}
              </span>
              <span className="block px-3 py-4 text-sm text-[var(--windows-98-fluent-secondary-label)]">
                {item.slug}.exe 컴포넌트 샘플 열기
              </span>
            </Link>
          ))}
        </div>
      </StyleGuideSection>
    </>
  );
}
