import {
  PageIntro,
  StyleGuideSection
} from 'app/style-guide/neumorphism/_components/style-guide-section';

const surfaceTokens = [
  {
    name: 'Background',
    token: '--neumorphism-background',
    desc: '전체 화면의 기본 배경'
  },
  {
    name: 'Grouped',
    token: '--neumorphism-surface-grouped',
    desc: '눌린 표면과 조용한 그룹 배경'
  },
  {
    name: 'Surface',
    token: '--neumorphism-surface',
    desc: '카드, 셀, 내비게이션 표면'
  },
  {
    name: 'Elevated',
    token: '--neumorphism-surface-elevated',
    desc: '모달과 시트의 강조 표면'
  },
  {
    name: 'Fill',
    token: '--neumorphism-fill',
    desc: '입력, segmented control, 비활성 표면'
  },
  {
    name: 'Separator',
    token: '--neumorphism-separator',
    desc: '셀 구분선과 얇은 경계'
  }
] as const;

const systemColors = [
  {
    name: 'Blue',
    token: '--neumorphism-blue',
    desc: '주요 액션, 링크, 선택 상태'
  },
  { name: 'Green', token: '--neumorphism-green', desc: '성공과 활성 상태' },
  { name: 'Orange', token: '--neumorphism-orange', desc: '주의와 보조 강조' },
  { name: 'Red', token: '--neumorphism-red', desc: '오류와 위험 동작' },
  { name: 'Purple', token: '--neumorphism-purple', desc: '브랜드 보조 강조' },
  { name: 'Pink', token: '--neumorphism-pink', desc: '강한 시각적 포인트' }
] as const;

function cssVariable(token: string): string {
  return `var(${token})`;
}

export default function StyleGuideColorsPage() {
  return (
    <>
      <PageIntro title="Colors">
        Neumorphism 컬러는 배경과 표면을 비슷한 계열로 맞추고, 파스텔 포인트
        컬러를 제한적으로 사용합니다. 라이트/다크 모드 모두 부드러운 대비가
        유지되도록 토큰을 분리합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Surface" title="Grouped surface tokens">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {surfaceTokens.map((color) => (
            <div
              key={color.token}
              className="overflow-hidden rounded-3xl border border-[var(--neumorphism-separator)] bg-[var(--neumorphism-surface)] p-3 shadow-[var(--neumorphism-shadow)]"
            >
              <div
                className="h-24 rounded-2xl shadow-[var(--neumorphism-shadow-inset)]"
                style={{ backgroundColor: cssVariable(color.token) }}
              />
              <div className="p-5">
                <p className="font-semibold text-[var(--neumorphism-label)]">
                  {color.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--neumorphism-secondary-label)]">
                  {color.desc}
                </p>
                <code className="mt-3 block font-mono text-xs text-[var(--neumorphism-tertiary-label)]">
                  {color.token}
                </code>
              </div>
            </div>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="System" title="System colors">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {systemColors.map((color) => (
            <div
              key={color.token}
              className="rounded-3xl border border-[var(--neumorphism-separator)] bg-[var(--neumorphism-surface)] p-5 shadow-[var(--neumorphism-shadow)]"
            >
              <div
                className="size-14 rounded-2xl shadow-[var(--neumorphism-shadow-soft)]"
                style={{ backgroundColor: cssVariable(color.token) }}
              />
              <p className="mt-4 font-semibold text-[var(--neumorphism-label)]">
                {color.name}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--neumorphism-secondary-label)]">
                {color.desc}
              </p>
              <code className="mt-3 block font-mono text-xs text-[var(--neumorphism-tertiary-label)]">
                {color.token}
              </code>
            </div>
          ))}
        </div>
      </StyleGuideSection>
    </>
  );
}
