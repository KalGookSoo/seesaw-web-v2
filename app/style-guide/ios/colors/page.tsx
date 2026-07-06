import {
  PageIntro,
  StyleGuideSection
} from 'app/style-guide/ios/_components/style-guide-section';

const surfaceTokens = [
  {
    name: 'Background',
    token: '--ios-background',
    desc: '전체 화면의 기본 배경'
  },
  {
    name: 'Grouped',
    token: '--ios-surface-grouped',
    desc: '리스트와 설정 화면의 그룹 배경'
  },
  {
    name: 'Surface',
    token: '--ios-surface',
    desc: '카드, 셀, 내비게이션 표면'
  },
  {
    name: 'Elevated',
    token: '--ios-surface-elevated',
    desc: '모달과 시트의 강조 표면'
  },
  {
    name: 'Fill',
    token: '--ios-fill',
    desc: '입력, segmented control, 비활성 표면'
  },
  { name: 'Separator', token: '--ios-separator', desc: '셀 구분선과 얇은 경계' }
] as const;

const systemColors = [
  { name: 'Blue', token: '--ios-blue', desc: '주요 액션, 링크, 선택 상태' },
  { name: 'Green', token: '--ios-green', desc: '성공과 활성 상태' },
  { name: 'Orange', token: '--ios-orange', desc: '주의와 보조 강조' },
  { name: 'Red', token: '--ios-red', desc: '오류와 위험 동작' },
  { name: 'Purple', token: '--ios-purple', desc: '브랜드 보조 강조' },
  { name: 'Pink', token: '--ios-pink', desc: '강한 시각적 포인트' }
] as const;

function cssVariable(token: string): string {
  return `var(${token})`;
}

export default function StyleGuideColorsPage() {
  return (
    <>
      <PageIntro title="Colors">
        iOS 컬러는 의미가 명확한 system color와 grouped surface의 조합으로
        구성합니다. 라이트/다크 모드에서 같은 역할의 대비가 유지되도록 토큰을
        분리합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Surface" title="Grouped surface tokens">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {surfaceTokens.map((color) => (
            <div
              key={color.token}
              className="overflow-hidden rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-surface)] shadow-[var(--ios-shadow)]"
            >
              <div
                className="h-24 border-b border-[var(--ios-separator)]"
                style={{ backgroundColor: cssVariable(color.token) }}
              />
              <div className="p-5">
                <p className="font-semibold text-[var(--ios-label)]">
                  {color.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--ios-secondary-label)]">
                  {color.desc}
                </p>
                <code className="mt-3 block font-mono text-xs text-[var(--ios-tertiary-label)]">
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
              className="rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-surface)] p-5 shadow-[var(--ios-shadow)]"
            >
              <div
                className="size-14 rounded-lg"
                style={{ backgroundColor: cssVariable(color.token) }}
              />
              <p className="mt-4 font-semibold text-[var(--ios-label)]">
                {color.name}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--ios-secondary-label)]">
                {color.desc}
              </p>
              <code className="mt-3 block font-mono text-xs text-[var(--ios-tertiary-label)]">
                {color.token}
              </code>
            </div>
          ))}
        </div>
      </StyleGuideSection>
    </>
  );
}
