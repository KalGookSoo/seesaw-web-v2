import {
  PageIntro,
  StyleGuideSection
} from 'app/style-guide/minimalism/_components/style-guide-section';

const surfaceTokens = [
  {
    name: 'Background',
    token: '--minimalism-background',
    desc: '전체 화면의 기본 배경'
  },
  {
    name: 'Grouped',
    token: '--minimalism-surface-grouped',
    desc: '리스트와 설정 화면의 그룹 배경'
  },
  {
    name: 'Surface',
    token: '--minimalism-surface',
    desc: '카드, 셀, 내비게이션 표면'
  },
  {
    name: 'Elevated',
    token: '--minimalism-surface-elevated',
    desc: '모달과 시트의 강조 표면'
  },
  {
    name: 'Fill',
    token: '--minimalism-fill',
    desc: '입력, segmented control, 비활성 표면'
  },
  {
    name: 'Separator',
    token: '--minimalism-separator',
    desc: '셀 구분선과 얇은 경계'
  }
] as const;

const systemColors = [
  {
    name: 'Accent',
    token: '--minimalism-accent',
    desc: '주요 액션과 선택 상태'
  },
  { name: 'Ink', token: '--minimalism-label', desc: '제목과 본문' },
  {
    name: 'Secondary Ink',
    token: '--minimalism-secondary-label',
    desc: '설명과 보조 텍스트'
  },
  { name: 'Success', token: '--minimalism-success', desc: '성공 상태' },
  { name: 'Warning', token: '--minimalism-warning', desc: '주의 상태' },
  { name: 'Danger', token: '--minimalism-danger', desc: '위험 상태' }
] as const;

function cssVariable(token: string): string {
  return `var(${token})`;
}

export default function StyleGuideColorsPage() {
  return (
    <>
      <PageIntro title="Colors">
        Minimalism 컬러는 흑백과 회색을 중심으로 구성합니다. 상태색은 필요한
        순간에만 사용하고, 기본 화면은 surface, ink, separator의 관계로 위계를
        만듭니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Surface" title="Surface tokens">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {surfaceTokens.map((color) => (
            <div
              key={color.token}
              className="overflow-hidden rounded-lg border border-[var(--minimalism-separator)] bg-[var(--minimalism-surface)] shadow-[var(--minimalism-shadow)]"
            >
              <div
                className="h-24 border-b border-[var(--minimalism-separator)]"
                style={{ backgroundColor: cssVariable(color.token) }}
              />
              <div className="p-5">
                <p className="font-semibold text-[var(--minimalism-label)]">
                  {color.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--minimalism-secondary-label)]">
                  {color.desc}
                </p>
                <code className="mt-3 block font-mono text-xs text-[var(--minimalism-tertiary-label)]">
                  {color.token}
                </code>
              </div>
            </div>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Ink" title="Ink and status colors">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {systemColors.map((color) => (
            <div
              key={color.token}
              className="rounded-lg border border-[var(--minimalism-separator)] bg-[var(--minimalism-surface)] p-5 shadow-[var(--minimalism-shadow)]"
            >
              <div
                className="h-10 border border-[var(--minimalism-separator)]"
                style={{ backgroundColor: cssVariable(color.token) }}
              />
              <p className="mt-4 font-semibold text-[var(--minimalism-label)]">
                {color.name}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--minimalism-secondary-label)]">
                {color.desc}
              </p>
              <code className="mt-3 block font-mono text-xs text-[var(--minimalism-tertiary-label)]">
                {color.token}
              </code>
            </div>
          ))}
        </div>
      </StyleGuideSection>
    </>
  );
}
