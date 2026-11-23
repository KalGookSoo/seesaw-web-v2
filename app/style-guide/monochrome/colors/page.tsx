import { PageIntro, StyleGuideSection } from 'app/style-guide/monochrome/_components/style-guide-section';

const tokens = [
  ['Background', '--monochrome-background', '전체 화면의 바탕'],
  ['Surface', '--monochrome-surface', '카드와 주요 콘텐츠 표면'],
  ['Grouped', '--monochrome-surface-grouped', '목록과 보조 영역'],
  ['Elevated', '--monochrome-surface-elevated', '모달과 떠 있는 표면'],
  ['Metal', '--monochrome-metal', '스틸과 스테인리스 느낌의 얇은 선'],
  ['Metal soft', '--monochrome-metal-soft', '금속 표면을 암시하는 보조 배경'],
  ['Fill', '--monochrome-fill', '입력과 비활성 컨트롤'],
  ['Separator', '--monochrome-separator', '구분선과 경계'],
  ['Label', '--monochrome-label', '제목과 핵심 본문'],
  ['Secondary', '--monochrome-secondary-label', '설명과 보조 정보'],
  ['Tertiary', '--monochrome-tertiary-label', '메타데이터와 비활성 정보']
] as const;

export default function MonochromeColorsPage() {
  return (
    <>
      <PageIntro title="Colors">따뜻한 회색조를 바탕으로 크롬 하이라이트와 스틸 경계를 절제해 사용합니다. 상태색도 채도와 밝기를 낮춰 금속성 무드를 깨지 않도록 하며, 액센트는 선택·포커스·주요 행동을 표시하는 도구로만 사용합니다.</PageIntro>
      <StyleGuideSection eyebrow="Neutral scale" title="Surfaces and ink">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tokens.map(([name, token, description]) => <div key={token} className="overflow-hidden rounded-[var(--monochrome-radius)] border border-[var(--monochrome-separator)] bg-[var(--monochrome-surface)] shadow-[var(--monochrome-shadow)]"><div className="h-20 border-b border-[var(--monochrome-separator)]" style={{ backgroundColor: `var(${token})` }} /><div className="p-4"><p className="font-semibold text-[var(--monochrome-label)]">{name}</p><p className="mt-1 text-sm text-[var(--monochrome-secondary-label)]">{description}</p><code className="mt-3 block text-xs text-[var(--monochrome-tertiary-label)]">{token}</code></div></div>)}
        </div>
      </StyleGuideSection>
      <StyleGuideSection eyebrow="States" title="Meaningful contrast">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Success', '--monochrome-success', '--monochrome-success-soft'],
            ['Warning', '--monochrome-warning', '--monochrome-warning-soft'],
            ['Danger', '--monochrome-danger', '--monochrome-danger-soft']
          ].map(([name, ink, fill]) => <div key={name} className="rounded-[var(--monochrome-radius)] border p-4" style={{ color: `var(${ink})`, backgroundColor: `var(${fill})`, borderColor: `var(${ink})` }}><p className="font-semibold">{name}</p><p className="mt-1 text-sm opacity-80">상태를 설명하는 텍스트와 함께 사용합니다.</p></div>)}
        </div>
      </StyleGuideSection>
    </>
  );
}
