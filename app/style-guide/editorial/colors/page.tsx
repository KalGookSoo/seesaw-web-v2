import {
  PageIntro,
  StyleGuideSection
} from 'app/style-guide/editorial/_components/style-guide-section';

const editorialAccentColors = [
  {
    name: 'Steel Cyan (차갑고 날카로운 청색)',
    lightClass: 'bg-[#006f94]',
    darkClass: 'bg-[#78d8f0]',
    textClass: 'text-[#006f94] dark:text-[#78d8f0]',
    hexLight: '#006f94',
    hexDark: '#78d8f0'
  },
  {
    name: 'Cold Emerald (절제된 에메랄드)',
    lightClass: 'bg-[#20715f]',
    darkClass: 'bg-[#78d6bd]',
    textClass: 'text-[#20715f] dark:text-[#78d6bd]',
    hexLight: '#20715f',
    hexDark: '#78d6bd'
  },
  {
    name: 'Acid Ochre (건조한 경고색)',
    lightClass: 'bg-[#8a6400]',
    darkClass: 'bg-[#f0c96a]',
    textClass: 'text-[#8a6400] dark:text-[#f0c96a]',
    hexLight: '#8a6400',
    hexDark: '#f0c96a'
  },
  {
    name: 'Razor Crimson (차가운 위험 신호)',
    lightClass: 'bg-[#a3223d]',
    darkClass: 'bg-[#ff809a]',
    textClass: 'text-[#a3223d] dark:text-[#ff809a]',
    hexLight: '#a3223d',
    hexDark: '#ff809a'
  }
] as const;

const monochromeColors = [
  {
    name: 'Cold Paper (차가운 지면 배경)',
    bgLight: 'bg-[#f1f3f5]',
    bgDark: 'bg-[#090b0f]',
    desc: '온기를 덜어낸 editorial background'
  },
  {
    name: 'Graphite Ink (흑연 잉크)',
    bgLight: 'bg-[#151922]',
    bgDark: 'bg-[#f1f5f9]',
    desc: '본문 텍스트용 고대비 잉크'
  },
  {
    name: 'Cold Caption (건조한 보조 텍스트)',
    bgLight: 'bg-[#4d5663]',
    bgDark: 'bg-[#b8c2cf]',
    desc: '설명 문구 및 비활성 레이블'
  },
  {
    name: 'Knife Line (샤프한 경계선)',
    bgLight: 'bg-[#1c2430]',
    bgDark: 'bg-[#d8e2f0]',
    desc: '섹션 구분과 아웃라인 선'
  }
] as const;

export default function StyleGuideColorsPage() {
  return (
    <>
      <PageIntro title="Colors">
        에디토리얼 매거진 감성을 차갑고 날카롭게 재해석한 컬러 토큰입니다. 웜톤
        종이와 와인 레드를 덜어내고, 흑연 잉크, 스틸 블루, 얇은 경계선 대비로
        냉소적이고 샤프한 레이아웃을 표현합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Theme" title="Light · Dark mode Contrast">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="border border-[var(--editorial-line)] bg-[var(--editorial-surface)] p-6 transition-colors duration-200">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--editorial-line)]" />
              <span className="text-[0.625rem] font-bold tracking-widest text-[var(--editorial-ink-muted)] uppercase">
                현재 테마
              </span>
            </div>
            <p className="font-serif text-sm font-bold text-[var(--editorial-ink)]">
              흑연 대비
            </p>
            <p className="mt-3 font-serif text-sm leading-6 text-[var(--editorial-ink-soft)] italic">
              본문은 따뜻한 아이보리 대신 차가운 paper gray와 graphite ink로
              표현합니다.
            </p>
          </div>
          <div className="border border-[var(--editorial-line)] bg-[var(--editorial-surface-muted)] p-6 transition-colors duration-200">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--editorial-accent)]" />
              <span className="text-[0.625rem] font-bold tracking-widest text-[var(--editorial-ink-muted)] uppercase">
                다크 모드
              </span>
            </div>
            <p className="font-serif text-sm font-bold text-[var(--editorial-ink)]">
              다크 모드 가독성
            </p>
            <p className="mt-3 font-serif text-sm leading-6 text-[var(--editorial-ink-soft)] italic">
              다크 모드에서는 검은 텍스트가 남지 않도록 ink 계열을 밝은
              blue-gray로 반전합니다.
            </p>
          </div>
          <div className="border border-[var(--editorial-line)] bg-[var(--editorial-surface)] p-6 transition-colors duration-200">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--editorial-accent)]" />
              <span className="text-[0.625rem] font-bold tracking-widest text-[var(--editorial-ink-muted)] uppercase">
                포인트 컬러
              </span>
            </div>
            <p className="font-serif text-sm font-bold text-[var(--editorial-ink)]">
              포인트 믹스
            </p>
            <p className="mt-3 font-serif text-sm leading-6 text-[var(--editorial-ink-soft)] italic">
              CTA와 활성 상태에는 스틸 블루를 얇고 선명하게 사용해 감정 과잉을
              줄입니다.
            </p>
          </div>
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Palette" title="Editorial Accent Palette">
        <div className="space-y-6">
          {editorialAccentColors.map((color) => (
            <div
              key={color.name}
              className="overflow-hidden border border-[var(--editorial-line)] transition-colors duration-200"
            >
              <div className="border-b border-[var(--editorial-line-soft)] bg-[var(--editorial-surface)] px-6 py-4 transition-colors duration-200">
                <h3
                  className={`font-serif text-sm font-bold ${color.textClass}`}
                >
                  {color.name}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="flex items-center justify-between border-b border-[#1c2430]/15 bg-[#f1f3f5] p-6 text-[#151922] md:border-r md:border-b-0">
                  <div>
                    <span className="text-xs font-bold tracking-widest text-[#7a8491] uppercase">
                      Light Mode
                    </span>
                    <p className="mt-1 font-serif font-semibold italic">
                      {color.hexLight}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`h-10 w-16 border border-[#1c2430]/20 ${color.lightClass}`}
                    />
                    <span className="font-mono text-[0.625rem] text-[#7a8491]">
                      Graphite
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-[#090b0f] p-6 text-[#f1f5f9]">
                  <div>
                    <span className="text-xs font-bold tracking-widest text-[#8b96a6] uppercase">
                      Dark Mode
                    </span>
                    <p className="mt-1 font-serif font-semibold italic">
                      {color.hexDark}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`h-10 w-16 border border-[#d8e2f0]/35 ${color.darkClass}`}
                    />
                    <span className="font-mono text-[0.625rem] text-[#8b96a6]">
                      High-Contrast
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Monochrome" title="Ink and Paper Palette">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {monochromeColors.map((color) => (
            <div
              key={color.name}
              className="flex flex-col justify-between overflow-hidden border border-[var(--editorial-line)] transition-colors duration-200"
            >
              <div>
                <div className="grid h-20 grid-cols-2 border-b border-[var(--editorial-line-soft)]">
                  <div
                    className={`${color.bgLight} border-r border-[var(--editorial-line-soft)]`}
                  />
                  <div className={color.bgDark} />
                </div>
                <div className="bg-[var(--editorial-surface)] p-4 transition-colors duration-200">
                  <p className="font-serif text-sm font-bold text-[var(--editorial-ink)]">
                    {color.name}
                  </p>
                  <p className="mt-2 font-serif text-xs leading-5 text-[var(--editorial-ink-soft)] italic">
                    {color.desc}
                  </p>
                </div>
              </div>
              <div className="border-t border-[var(--editorial-line-soft)] bg-[var(--editorial-surface-muted)] p-3 text-center transition-colors duration-200">
                <code className="font-mono text-[0.625rem] text-[var(--editorial-ink-muted)]">
                  {color.bgLight.replace('bg-', '')} /{' '}
                  {color.bgDark.replace('bg-', '')}
                </code>
              </div>
            </div>
          ))}
        </div>
      </StyleGuideSection>
    </>
  );
}
