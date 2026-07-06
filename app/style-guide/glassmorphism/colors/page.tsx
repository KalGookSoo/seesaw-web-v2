import { PageIntro, StyleGuideSection } from 'app/style-guide/glassmorphism/_components/style-guide-section';

const glassSurfaces = [
  { name: 'Background', token: '--glassmorphism-background', desc: '전체 화면의 밝은 공기감' },
  { name: 'Surface', token: '--glassmorphism-surface', desc: '기본 반투명 패널' },
  { name: 'Strong Surface', token: '--glassmorphism-surface-strong', desc: '모달, 헤더처럼 강조된 유리 표면' },
  { name: 'Muted Surface', token: '--glassmorphism-surface-muted', desc: '부드러운 보조 레이어' },
  { name: 'Line', token: '--glassmorphism-line', desc: '유리 가장자리 하이라이트' },
  { name: 'Soft Line', token: '--glassmorphism-line-soft', desc: '내부 구분선' }
] as const;

const glassAccents = [
  { name: 'Blue Glow', token: '--glassmorphism-accent', desc: '주요 액션과 포커스' },
  { name: 'Blue Soft', token: '--glassmorphism-accent-soft', desc: '정보성 배경' },
  { name: 'Green', token: '--glassmorphism-success', desc: '성공 상태' },
  { name: 'Amber', token: '--glassmorphism-warning', desc: '주의 상태' },
  { name: 'Rose', token: '--glassmorphism-danger', desc: '위험 상태' },
  { name: 'Ink', token: '--glassmorphism-ink', desc: '본문과 제목' }
] as const;

function cssVariable(token: string): string {
  return `var(${token})`;
}

export default function StyleGuideColorsPage() {
  return (
    <>
      <PageIntro title="Colors">
        Glassmorphism 컬러는 불투명한 면보다 배경과의 관계가 중요합니다. 반투명 surface, 밝은 edge, blur 위에서도 읽히는 ink, 그리고 은은한
        glow accent를 중심으로 구성합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Atmosphere" title="Background glow">
        <div className="grid gap-5 lg:grid-cols-3">
          {['--glassmorphism-background-accent-a', '--glassmorphism-background-accent-b', '--glassmorphism-background-accent-c'].map(
            (token) => (
              <div
                key={token}
                className="min-h-40 rounded-3xl border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface)] p-5 shadow-[var(--glassmorphism-shadow)] backdrop-blur-2xl"
              >
                <div className="h-24 rounded-2xl blur-sm" style={{ backgroundColor: cssVariable(token) }} />
                <code className="mt-4 block font-mono text-xs text-[var(--glassmorphism-ink-soft)]">{token}</code>
              </div>
            )
          )}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Surface" title="Glass surface tokens">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {glassSurfaces.map((color) => (
            <div
              key={color.token}
              className="overflow-hidden rounded-3xl border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface)] shadow-[var(--glassmorphism-shadow)] backdrop-blur-2xl"
            >
              <div
                className="h-28 border-b border-[var(--glassmorphism-line-soft)]"
                style={{ backgroundColor: cssVariable(color.token) }}
              />
              <div className="p-5">
                <p className="font-semibold text-[var(--glassmorphism-ink)]">{color.name}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--glassmorphism-ink-soft)]">{color.desc}</p>
                <code className="mt-3 block font-mono text-xs text-[var(--glassmorphism-ink-muted)]">{color.token}</code>
              </div>
            </div>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Accent" title="Status and action colors">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {glassAccents.map((color) => (
            <div
              key={color.token}
              className="rounded-3xl border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface-muted)] p-5 shadow-[var(--glassmorphism-shadow)] backdrop-blur-2xl"
            >
              <div className="size-16 rounded-full shadow-lg" style={{ backgroundColor: cssVariable(color.token) }} />
              <p className="mt-4 font-semibold text-[var(--glassmorphism-ink)]">{color.name}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--glassmorphism-ink-soft)]">{color.desc}</p>
              <code className="mt-3 block font-mono text-xs text-[var(--glassmorphism-ink-muted)]">{color.token}</code>
            </div>
          ))}
        </div>
      </StyleGuideSection>
    </>
  );
}
