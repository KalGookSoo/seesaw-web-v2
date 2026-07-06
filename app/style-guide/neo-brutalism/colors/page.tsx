import {
  PageIntro,
  StyleGuideSection
} from 'app/style-guide/neo-brutalism/_components/style-guide-section';

const surfaceTokens = [
  {
    name: 'Background',
    token: '--neo-brutalism-background',
    desc: '전체 화면의 기본 배경'
  },
  {
    name: 'Grouped',
    token: '--neo-brutalism-surface-grouped',
    desc: '강조 섹션과 충돌감 있는 배경'
  },
  {
    name: 'Surface',
    token: '--neo-brutalism-surface',
    desc: '카드, 셀, 내비게이션 표면'
  },
  {
    name: 'Elevated',
    token: '--neo-brutalism-surface-elevated',
    desc: '모달과 시트의 강조 표면'
  },
  {
    name: 'Fill',
    token: '--neo-brutalism-fill',
    desc: '입력, segmented control, 비활성 표면'
  },
  {
    name: 'Separator',
    token: '--neo-brutalism-separator',
    desc: '셀 구분선과 얇은 경계'
  }
] as const;

const systemColors = [
  {
    name: 'Blue',
    token: '--neo-brutalism-blue',
    desc: '주요 액션, 링크, 선택 상태'
  },
  { name: 'Green', token: '--neo-brutalism-green', desc: '성공과 활성 상태' },
  { name: 'Orange', token: '--neo-brutalism-orange', desc: '주의와 보조 강조' },
  { name: 'Red', token: '--neo-brutalism-red', desc: '오류와 위험 동작' },
  { name: 'Purple', token: '--neo-brutalism-purple', desc: '브랜드 보조 강조' },
  { name: 'Pink', token: '--neo-brutalism-pink', desc: '강한 시각적 포인트' }
] as const;

function cssVariable(token: string): string {
  return `var(${token})`;
}

export default function StyleGuideColorsPage() {
  return (
    <>
      <PageIntro title="Colors">
        Neo-Brutalism 컬러는 검정 경계선과 강한 포인트 컬러의 대비를 중심으로
        구성합니다. 색은 친절한 장식보다 선택, 위험, 성공 같은 상태를 강하게
        드러내는 역할을 맡습니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Surface" title="Grouped surface tokens">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {surfaceTokens.map((color) => (
            <div
              key={color.token}
              className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] shadow-[var(--neo-brutalism-shadow)]"
            >
              <div
                className="h-24 border-b-4 border-[var(--neo-brutalism-separator)]"
                style={{ backgroundColor: cssVariable(color.token) }}
              />
              <div className="p-5">
                <p className="font-black text-[var(--neo-brutalism-label)] uppercase">
                  {color.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--neo-brutalism-secondary-label)]">
                  {color.desc}
                </p>
                <code className="mt-3 block font-mono text-xs text-[var(--neo-brutalism-tertiary-label)]">
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
              className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] p-5 shadow-[var(--neo-brutalism-shadow)]"
            >
              <div
                className="h-14 border-4 border-[var(--neo-brutalism-separator)]"
                style={{ backgroundColor: cssVariable(color.token) }}
              />
              <p className="mt-4 font-black text-[var(--neo-brutalism-label)] uppercase">
                {color.name}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--neo-brutalism-secondary-label)]">
                {color.desc}
              </p>
              <code className="mt-3 block font-mono text-xs text-[var(--neo-brutalism-tertiary-label)]">
                {color.token}
              </code>
            </div>
          ))}
        </div>
      </StyleGuideSection>
    </>
  );
}
