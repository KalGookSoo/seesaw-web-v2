import Link from 'next/link';

const styleGuides = [
  {
    href: '/style-guide/default',
    label: 'Default',
    desc: '기본적인 스타일의 디자인 기준선입니다.'
  },
  {
    href: '/style-guide/editorial',
    label: 'Editorial',
    desc: '강한 보더 라인과 세리프 서체를 조합한 지면 매거진 스타일입니다.'
  },
  {
    href: '/style-guide/glassmorphism',
    label: 'Glassmorphism',
    desc: '배경 이미지를 받쳐주는 반투명 유리 질감의 디자인입니다.'
  },
  {
    href: '/style-guide/ios',
    label: 'iOS / iPadOS',
    desc: '큰 터치 영역과 부드러운 카드형 인터페이스의 모바일 친화 스타일입니다.'
  },
  {
    href: '/style-guide/mac-os-native',
    label: 'macOS Native',
    desc: '세밀한 블러와 정밀한 네이티브 데스크톱 감성의 스타일입니다.'
  },
  {
    href: '/style-guide/minimalism',
    label: 'Minimalism',
    desc: '불필요한 요소를 극도로 절제한 중립적 레이아웃입니다.'
  },
  {
    href: '/style-guide/neo-brutalism',
    label: 'Neo Brutalism',
    desc: '고대비의 원색과 단단한 하드 섀도우를 조합한 트렌디한 디자인입니다.'
  },
  {
    href: '/style-guide/neumorphism',
    label: 'Neumorphism',
    desc: '이중 부드러운 그림자를 통해 부드러운 입체감을 주는 스타일입니다.'
  },
  {
    href: '/style-guide/retro-web',
    label: 'Retro Web',
    desc: '고전 PC 베젤 감성 혹은 CLI 터미널 느낌의 레트로 테마입니다.'
  },
  {
    href: '/style-guide/windows-98-fluent',
    label: 'Windows 98 Fluent',
    desc: '아크릴릭 블러와 컴팩트한 레이어드 설정창 스타일입니다.'
  }
] as const;

export default function Page() {
  return (
    <div className="bg-neutral-50 text-neutral-900 min-h-dvh flex flex-col justify-between dark:bg-neutral-950 dark:text-neutral-100 transition-colors duration-200">
      <header className="border-neutral-200/50 bg-white/70 border-b backdrop-blur py-8 dark:border-neutral-800/50 dark:bg-neutral-900/70">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-neutral-500 text-xs font-bold tracking-widest uppercase dark:text-neutral-400">Seesaw Web v2</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight lg:text-4xl">Style Guide Portal</h1>
          <p className="text-neutral-600 mt-2 max-w-2xl text-sm leading-6 dark:text-neutral-400">
            점진적 이관을 위해 구축된 다양한 UI 테마 스타일 가이드 모음입니다. 각 링크를 통해 상세 컴포넌트 조합 및 룩앤필 사양을 확인하세요.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl flex-1 px-6 py-12 lg:px-8 w-full">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {styleGuides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="border-neutral-200 bg-white p-6 rounded-xl border flex flex-col justify-between hover:border-neutral-900 hover:-translate-y-1 transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-200 group"
            >
              <div>
                <h3 className="text-base font-bold text-neutral-950 dark:text-neutral-50 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                  {guide.label}
                </h3>
                <p className="text-neutral-500 mt-2 text-sm leading-6 dark:text-neutral-400 font-normal">
                  {guide.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-wider text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-neutral-50 transition-colors">
                Explore Theme
                <svg
                  className="ml-1.5 size-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-neutral-200/50 bg-white py-6 dark:border-neutral-800/50 dark:bg-neutral-900 text-center">
        <p className="text-neutral-400 text-xs dark:text-neutral-500">
          &copy; {new Date().getFullYear()} Seesaw Design System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
