import {
  PageIntro,
  StyleGuideSection
} from 'app/style-guide/default/_components/style-guide-section';
import {
  defaultColors,
  defaultColorSteps,
  defaultNeutralColors
} from 'lib/style-guide';

function cssVariable(token: string): string {
  return `var(--${token})`;
}

export default function StyleGuideColorsPage() {
  return (
    <>
      <PageIntro title="Colors">
        시스템 색상에서 출발한 Tailwind 토큰입니다. 색상별로 `soft`, `base`,
        `muted`, `contrast` 단계를 두어 라이트/다크 모드에서 같은 역할의 밝기와
        대비를 유지합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Theme" title="Light · Dark mode">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="border-default-separator bg-default-surface rounded-lg border p-5">
            <p className="text-default-label text-sm font-semibold">
              현재 모드 토큰
            </p>
            <p className="text-default-secondary-label mt-2 text-sm leading-6">
              상단 토글로 `html.dark` 클래스를 변경하면 아래 팔레트와 모든
              컴포넌트 표면이 CSS 변수 기반으로 전환됩니다.
            </p>
          </div>
          <div className="border-default-separator bg-default-fill rounded-lg border p-5">
            <p className="text-default-label text-sm font-semibold">
              저장 정책
            </p>
            <p className="text-default-secondary-label mt-2 text-sm leading-6">
              사용자 선택은 `localStorage.seesaw-theme`에 저장합니다.
            </p>
          </div>
          <div className="border-default-separator bg-default-surface-elevated rounded-lg border p-5">
            <p className="text-default-label text-sm font-semibold">
              초기 정책
            </p>
            <p className="text-default-secondary-label mt-2 text-sm leading-6">
              저장값이 없으면 시스템 설정을 `matchMedia`로 읽습니다.
            </p>
          </div>
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Palette" title="Semantic color scale">
        <div className="space-y-4">
          {defaultColors.map((color) => (
            <div
              key={color.token}
              className="border-default-separator bg-default-surface overflow-hidden rounded-lg border"
            >
              <div className="border-default-separator border-b px-4 py-3">
                <h3 className="text-default-label text-sm font-semibold">
                  {color.name}
                </h3>
                <code className="text-default-secondary-label text-xs">
                  --{color.token}
                </code>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4">
                {defaultColorSteps.map((step) => {
                  const token = step.suffix
                    ? `${color.token}-${step.suffix}`
                    : color.token;
                  return (
                    <div
                      key={token}
                      className="border-default-separator min-h-28 border-t p-4 lg:border-t-0 lg:border-l lg:first:border-l-0"
                      style={{ backgroundColor: cssVariable(token) }}
                    >
                      <p className="text-default-secondary-label text-sm font-semibold mix-blend-difference invert">
                        {step.label}
                      </p>
                      <code className="text-default-secondary-label mt-1 block text-xs mix-blend-difference invert">
                        bg-{token}
                      </code>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Neutral" title="Surface and text tokens">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {defaultNeutralColors.map((color) => (
            <div
              key={color.token}
              className="border-default-separator bg-default-surface overflow-hidden rounded-lg border"
            >
              <div
                className="border-default-separator h-24 border-b"
                style={{ backgroundColor: cssVariable(color.token) }}
              />
              <div className="p-4">
                <p className="text-default-label text-sm font-semibold">
                  {color.name}
                </p>
                <code className="text-default-secondary-label mt-1 block text-xs">
                  bg-{color.token}
                </code>
              </div>
            </div>
          ))}
        </div>
      </StyleGuideSection>
    </>
  );
}
