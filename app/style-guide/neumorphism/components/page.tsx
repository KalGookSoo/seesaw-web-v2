import Link from 'next/link';
import {
  PageIntro,
  StyleGuideSection
} from 'app/style-guide/neumorphism/_components/style-guide-section';
import { neumorphismComponentItems } from 'app/style-guide/neumorphism/components/_components/component-items';

export default function StyleGuideComponentsPage() {
  return (
    <>
      <PageIntro title="Components">
        Neumorphism 컴포넌트는 낮은 대비의 표면과 부드러운 그림자, 파스텔 상태
        색상을 기준으로 구성합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Coverage" title="Component inventory">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {neumorphismComponentItems.map((item) => (
            <Link
              key={item.href}
              className="group rounded-3xl border border-[var(--neumorphism-separator)] bg-[var(--neumorphism-surface)] p-5 shadow-[var(--neumorphism-shadow-soft)] transition-shadow hover:shadow-[var(--neumorphism-shadow-inset)]"
              href={item.href}
            >
              <span className="block text-sm font-semibold text-[var(--neumorphism-label)]">
                {item.label}
              </span>
              <span className="mt-3 block text-sm leading-6 text-[var(--neumorphism-secondary-label)]">
                {item.slug} 컴포넌트 샘플 열기
              </span>
            </Link>
          ))}
        </div>
      </StyleGuideSection>
    </>
  );
}
