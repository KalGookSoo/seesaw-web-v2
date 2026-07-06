import {
  PageIntro,
  StyleGuideSection
} from 'app/style-guide/retro-web/_components/style-guide-section';

const surfaceTokens = [
  {
    name: 'Background',
    token: '--retro-web-background',
    desc: '전체 화면의 기본 배경'
  },
  {
    name: 'Grouped',
    token: '--retro-web-surface-grouped',
    desc: '리스트와 설정 화면의 그룹 배경'
  },
  {
    name: 'Surface',
    token: '--retro-web-surface',
    desc: '카드, 셀, 내비게이션 표면'
  },
  {
    name: 'Elevated',
    token: '--retro-web-surface-elevated',
    desc: '모달과 시트의 강조 표면'
  },
  {
    name: 'Fill',
    token: '--retro-web-fill',
    desc: '입력, segmented control, 비활성 표면'
  },
  {
    name: 'Separator',
    token: '--retro-web-separator',
    desc: '셀 구분선과 얇은 경계'
  }
] as const;

const systemColors = [
  {
    name: 'Blue',
    token: '--retro-web-blue',
    desc: '주요 액션, 링크, 선택 상태'
  },
  { name: 'Green', token: '--retro-web-green', desc: '성공과 활성 상태' },
  { name: 'Orange', token: '--retro-web-orange', desc: '주의와 보조 강조' },
  { name: 'Red', token: '--retro-web-red', desc: '오류와 위험 동작' },
  { name: 'Purple', token: '--retro-web-purple', desc: '브랜드 보조 강조' },
  { name: 'Pink', token: '--retro-web-pink', desc: '강한 시각적 포인트' }
] as const;

function cssVariable(token: string): string {
  return `var(${token})`;
}

export default function StyleGuideColorsPage() {
  return (
    <>
      <PageIntro title="Colors">
        Retro Web 컬러는 크림, 바랜 청록, 탁한 핑크, 오래된 회색 계열을 중심으로
        구성합니다. 초기 웹의 분위기는 유지하되 너무 쨍한 원색은 피합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Surface" title="Grouped surface tokens">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {surfaceTokens.map((color) => (
            <div
              key={color.token}
              className="border border-[var(--retro-web-separator)] bg-[var(--retro-web-surface)] p-1 shadow-[var(--retro-web-shadow)]"
            >
              <div
                className="h-24 border border-[var(--retro-web-line-soft)] shadow-[var(--retro-web-inset)]"
                style={{ backgroundColor: cssVariable(color.token) }}
              />
              <div className="p-5">
                <p className="font-mono font-semibold text-[var(--retro-web-label)]">
                  {color.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--retro-web-secondary-label)]">
                  {color.desc}
                </p>
                <code className="mt-3 block font-mono text-xs text-[var(--retro-web-tertiary-label)]">
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
              className="border border-[var(--retro-web-separator)] bg-[var(--retro-web-surface)] p-5 shadow-[var(--retro-web-shadow)]"
            >
              <div
                className="size-14 border border-[var(--retro-web-separator)] shadow-[var(--retro-web-shadow-soft)]"
                style={{ backgroundColor: cssVariable(color.token) }}
              />
              <p className="mt-4 font-mono font-semibold text-[var(--retro-web-label)]">
                {color.name}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--retro-web-secondary-label)]">
                {color.desc}
              </p>
              <code className="mt-3 block font-mono text-xs text-[var(--retro-web-tertiary-label)]">
                {color.token}
              </code>
            </div>
          ))}
        </div>
      </StyleGuideSection>
    </>
  );
}
