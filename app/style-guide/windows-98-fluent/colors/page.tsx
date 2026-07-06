import {
  PageIntro,
  StyleGuideSection
} from 'app/style-guide/windows-98-fluent/_components/style-guide-section';

const surfaceTokens = [
  {
    name: 'Background',
    token: '--windows-98-fluent-background',
    desc: '전체 화면의 기본 배경'
  },
  {
    name: 'Grouped',
    token: '--windows-98-fluent-surface-grouped',
    desc: '리스트와 설정 화면의 그룹 배경'
  },
  {
    name: 'Surface',
    token: '--windows-98-fluent-surface',
    desc: '카드, 셀, 내비게이션 표면'
  },
  {
    name: 'Elevated',
    token: '--windows-98-fluent-surface-elevated',
    desc: '모달과 시트의 강조 표면'
  },
  {
    name: 'Fill',
    token: '--windows-98-fluent-fill',
    desc: '입력, segmented control, 비활성 표면'
  },
  {
    name: 'Separator',
    token: '--windows-98-fluent-separator',
    desc: '셀 구분선과 얇은 경계'
  }
] as const;

const systemColors = [
  {
    name: 'Blue',
    token: '--windows-98-fluent-blue',
    desc: '주요 액션, 링크, 선택 상태'
  },
  {
    name: 'Green',
    token: '--windows-98-fluent-green',
    desc: '성공과 활성 상태'
  },
  {
    name: 'Orange',
    token: '--windows-98-fluent-orange',
    desc: '주의와 보조 강조'
  },
  { name: 'Red', token: '--windows-98-fluent-red', desc: '오류와 위험 동작' },
  {
    name: 'Purple',
    token: '--windows-98-fluent-purple',
    desc: '브랜드 보조 강조'
  },
  {
    name: 'Pink',
    token: '--windows-98-fluent-pink',
    desc: '강한 시각적 포인트'
  }
] as const;

function cssVariable(token: string): string {
  return `var(${token})`;
}

export default function StyleGuideColorsPage() {
  return (
    <>
      <PageIntro title="Colors">
        Windows 98 Fluent 컬러는 시스템 회색, 데스크톱 청록, 타이틀바 블루, 검정
        텍스트와 흰 하이라이트를 기준으로 구성합니다. 라이트/다크 모드에서도 3D
        bevel 관계가 유지되도록 토큰을 나눕니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Surface" title="Grouped surface tokens">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {surfaceTokens.map((color) => (
            <div
              key={color.token}
              className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]"
            >
              <div
                className="h-24 border border-[var(--windows-98-fluent-line-soft)] shadow-[var(--windows-98-fluent-inset)]"
                style={{ backgroundColor: cssVariable(color.token) }}
              />
              <div className="p-5">
                <p className="font-mono font-semibold text-[var(--windows-98-fluent-label)]">
                  {color.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--windows-98-fluent-secondary-label)]">
                  {color.desc}
                </p>
                <code className="mt-3 block font-mono text-xs text-[var(--windows-98-fluent-tertiary-label)]">
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
              className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-5 shadow-[var(--windows-98-fluent-inset)]"
            >
              <div
                className="size-14 border border-[var(--windows-98-fluent-separator)] shadow-[var(--windows-98-fluent-shadow-soft)]"
                style={{ backgroundColor: cssVariable(color.token) }}
              />
              <p className="mt-4 font-mono font-semibold text-[var(--windows-98-fluent-label)]">
                {color.name}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--windows-98-fluent-secondary-label)]">
                {color.desc}
              </p>
              <code className="mt-3 block font-mono text-xs text-[var(--windows-98-fluent-tertiary-label)]">
                {color.token}
              </code>
            </div>
          ))}
        </div>
      </StyleGuideSection>
    </>
  );
}
