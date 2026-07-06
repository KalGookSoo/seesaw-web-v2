import { PageIntro, StyleGuideSection } from 'app/style-guide/editorial/_components/style-guide-section';

const editorialAccentColors = [
  {
    name: 'Burgundy (지적인 와인 레드)',
    lightClass: 'bg-[#6b1d2f]',
    darkClass: 'bg-[#e05a76]',
    textClass: 'text-[#6b1d2f] dark:text-[#e05a76]',
    hexLight: '#6b1d2f',
    hexDark: '#e05a76'
  },
  {
    name: 'Forest Green (차분한 올리브 그린)',
    lightClass: 'bg-[#1e3f20]',
    darkClass: 'bg-[#6ba370]',
    textClass: 'text-[#1e3f20] dark:text-[#6ba370]',
    hexLight: '#1e3f20',
    hexDark: '#6ba370'
  },
  {
    name: 'Mustard Gold (따뜻한 머스터드)',
    lightClass: 'bg-[#a37f1a]',
    darkClass: 'bg-[#e5bf65]',
    textClass: 'text-[#a37f1a] dark:text-[#e5bf65]',
    hexLight: '#a37f1a',
    hexDark: '#e5bf65'
  },
  {
    name: 'Slate Blue (차분한 북 톤 블루)',
    lightClass: 'bg-[#2b3e50]',
    darkClass: 'bg-[#7b97b0]',
    textClass: 'text-[#2b3e50] dark:text-[#7b97b0]',
    hexLight: '#2b3e50',
    hexDark: '#7b97b0'
  }
] as const;

const monochromeColors = [
  {
    name: 'Main Background (종이 질감 배경)',
    bgLight: 'bg-[#faf9f6]',
    bgDark: 'bg-[#0a0a0a]',
    textLight: 'text-neutral-900',
    textDark: 'text-neutral-50',
    desc: '지면 느낌을 주는 백그라운드'
  },
  {
    name: 'Ink Primary (잉크 먹색 본문)',
    bgLight: 'bg-neutral-900',
    bgDark: 'bg-neutral-100',
    textLight: 'text-neutral-50',
    textDark: 'text-neutral-950',
    desc: '본문 텍스트용 메인 컬러'
  },
  {
    name: 'Ink Secondary (잉크 흑연 보조)',
    bgLight: 'bg-neutral-600',
    bgDark: 'bg-neutral-400',
    textLight: 'text-neutral-50',
    textDark: 'text-neutral-950',
    desc: '설명 문구 및 비활성 레이블'
  },
  {
    name: 'Editorial Line (경계선)',
    bgLight: 'bg-neutral-950',
    bgDark: 'bg-neutral-800',
    textLight: 'text-neutral-50',
    textDark: 'text-neutral-950',
    desc: '섹션 구분과 아웃라인 선'
  }
] as const;

export default function StyleGuideColorsPage() {
  return (
    <>
      <PageIntro title="Colors">
        에디토리얼 매거진 감성을 나타내기 위해 설계된 컬러 토큰입니다. 과도한 네온/원색을 지양하고, 잉크 느낌의 먹색과 웜 톤의 포인트 컬러를
        믹스매칭하여 오랜 독서에도 편안하고 지적인 레이아웃을 표현합니다.
      </PageIntro>

      <StyleGuideSection eyebrow="Theme" title="Light · Dark mode Contrast">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="border border-neutral-950 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 transition-colors duration-200">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-neutral-950 dark:bg-neutral-50" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                현재 테마
              </span>
            </div>
            <p className="text-sm font-bold font-serif text-neutral-950 dark:text-neutral-50">잉크 대비</p>
            <p className="mt-3 text-sm leading-6 font-serif italic text-neutral-600 dark:text-neutral-400">
              본문은 라이트 모드에서 완전한 흰색 대신 Warm White/Ivory 배경에 차콜 먹색으로 표현하여 눈의 피로를 최소화합니다.
            </p>
          </div>
          <div className="border border-neutral-950 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 p-6 transition-colors duration-200">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-neutral-950 dark:bg-[#e05a76]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                다크 모드
              </span>
            </div>
            <p className="text-sm font-bold font-serif text-neutral-950 dark:text-neutral-50">다크 모드 가독성</p>
            <p className="mt-3 text-sm leading-6 font-serif italic text-neutral-600 dark:text-neutral-400">
              다크 모드 전환 시 경계선과 포인트 컬러의 명도를 올려서 어두운 배경에서도 명확한 명도 대비를 확보합니다.
            </p>
          </div>
          <div className="border border-neutral-950 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 transition-colors duration-200">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#6b1d2f] dark:bg-[#e05a76]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                포인트 컬러
              </span>
            </div>
            <p className="text-sm font-bold font-serif text-neutral-950 dark:text-neutral-50">포인트 믹스</p>
            <p className="mt-3 text-sm leading-6 font-serif italic text-neutral-600 dark:text-neutral-400">
              대비가 확실한 한두 가지 포인트 컬러 조합을 통해 중요한 행동 유도 버튼(CTA)이나 상태 태그를 시각적으로 강조합니다.
            </p>
          </div>
        </div>
      </StyleGuideSection>

      <StyleGuideSection eyebrow="Palette" title="Editorial Accent Palette">
        <div className="space-y-6">
          {editorialAccentColors.map((color) => (
            <div key={color.name} className="overflow-hidden border border-neutral-950 dark:border-neutral-800 transition-colors duration-200">
              {/* 카드 헤더 - 다크모드 반응 */}
              <div className="border-b border-neutral-950/10 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 py-4 transition-colors duration-200">
                <h3 className={`text-sm font-bold font-serif ${color.textClass}`}>{color.name}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Light Mode Spec - 항상 라이트 배경으로 표시 (비교 목적) */}
                <div className="flex items-center justify-between border-b border-neutral-950/10 bg-[#faf9f6] p-6 text-neutral-900 md:border-b-0 md:border-r">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Light Mode</span>
                    <p className="mt-1 font-serif italic font-semibold">{color.hexLight}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`h-10 w-16 border border-neutral-950/20 ${color.lightClass}`} />
                    <span className="font-mono text-[10px] text-neutral-400">Ink-Contrast</span>
                  </div>
                </div>
                {/* Dark Mode Spec - 항상 다크 배경으로 표시 (비교 목적) */}
                <div className="flex items-center justify-between bg-neutral-950 p-6 text-neutral-50">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Dark Mode</span>
                    <p className="mt-1 font-serif italic font-semibold">{color.hexDark}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`h-10 w-16 border border-neutral-500/40 ${color.darkClass}`} />
                    <span className="font-mono text-[10px] text-neutral-500">High-Contrast</span>
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
              className="flex flex-col justify-between overflow-hidden border border-neutral-950 dark:border-neutral-800 transition-colors duration-200"
            >
              <div>
                {/* 라이트/다크 색상 비교 스와치 */}
                <div className="grid h-20 grid-cols-2 border-b border-neutral-950/10 dark:border-neutral-800">
                  <div className={`${color.bgLight} border-r border-neutral-950/10 dark:border-neutral-800`} />
                  <div className={color.bgDark} />
                </div>
                <div className="p-4 bg-white dark:bg-neutral-900 transition-colors duration-200">
                  <p className="text-sm font-bold font-serif text-neutral-950 dark:text-neutral-50">{color.name}</p>
                  <p className="mt-2 text-xs leading-5 font-serif italic text-neutral-600 dark:text-neutral-400">{color.desc}</p>
                </div>
              </div>
              <div className="border-t border-neutral-950/10 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-3 text-center transition-colors duration-200">
                <code className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
                  {color.bgLight.replace('bg-', '')} / {color.bgDark.replace('bg-', '')}
                </code>
              </div>
            </div>
          ))}
        </div>
      </StyleGuideSection>
    </>
  );
}

