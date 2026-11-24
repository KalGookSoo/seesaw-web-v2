import Link from 'next/link';

const styleGuides = [{
    href: '/style-guide/editorial',
    label: 'Editorial',
    desc: '강한 타이포그래피, 얇은 규칙선, 모듈형 그리드로 콘텐츠를 잡지처럼 편집하는 시스템입니다.'
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
            Seesaw Web의 단일 디자인 언어인 Editorial의 컴포넌트 조합과 룩앤필 사양을 확인하세요.
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
