import Link from 'next/link';
import {
  PageIntro,
  StyleGuideSection
} from 'app/style-guide/neo-brutalism/_components/style-guide-section';
import { neoBrutalismComponentItems } from 'app/style-guide/neo-brutalism/components/_components/component-items';

export default function StyleGuideComponentsPage() {
  return (
    <>
      <PageIntro title="Components">
        Neo-Brutalism 컴포넌트는 굵은 외곽선, 불투명한 색면, 의도적인 offset
        shadow, 직설적인 상태 색상을 기준으로 구성합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Coverage" title="Component inventory">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {neoBrutalismComponentItems.map((item, index) => (
            <Link
              key={item.href}
              className="group border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] p-5 shadow-[var(--neo-brutalism-shadow)] transition-transform hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none"
              href={item.href}
            >
              <span className="inline-flex border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-warning)] px-2 py-1 text-xs font-black text-[var(--neo-brutalism-danger-contrast)]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="mt-4 block text-base font-black tracking-tight text-[var(--neo-brutalism-label)] uppercase">
                {item.label}
              </span>
              <span className="mt-2 block text-sm leading-6 font-semibold text-[var(--neo-brutalism-secondary-label)]">
                {item.slug} 컴포넌트 샘플 열기
              </span>
            </Link>
          ))}
        </div>
      </StyleGuideSection>
    </>
  );
}
