import type { ReactNode } from 'react';
import { StyleGuideNavigation } from 'app/style-guide/neo-brutalism/_components/style-guide-navigation';
import { ThemeToggle } from 'components/theme/theme-toggle';
import neoBrutalismTheme from 'styles/themes/neo-brutalism.module.css';

export default function StyleGuideLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main
      className={`${neoBrutalismTheme.theme} min-h-dvh bg-[var(--neo-brutalism-background)] font-sans text-[var(--neo-brutalism-label)] transition-colors duration-200`}
    >
      <header className="border-b-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="w-fit border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface-grouped)] px-3 py-1 text-sm font-black text-[var(--neo-brutalism-label)] uppercase shadow-[var(--neo-brutalism-shadow)]">
              Seesaw Web v2
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight uppercase lg:text-7xl">
              Neo-Brutalism Style Guide
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 font-semibold text-[var(--neo-brutalism-secondary-label)]">
              굵은 선, 원색 포인트, 노골적인 그림자, 거친 타이포그래피로 화면의
              구조를 숨기지 않는 디자인 시스템 문서입니다.
            </p>
          </div>
          <div className="border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-accent)] px-4 py-3 font-mono text-sm font-black text-[var(--neo-brutalism-accent-contrast)] shadow-[var(--neo-brutalism-shadow)]">
            /style-guide/neo-brutalism
          </div>
          <ThemeToggle />
        </div>
        <div className="border-t-4 border-[var(--neo-brutalism-line-soft)] bg-[var(--neo-brutalism-surface-grouped)]">
          <div className="mx-auto max-w-7xl">
            <StyleGuideNavigation />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-10 px-6 py-10 lg:px-8">
        {children}
      </div>
    </main>
  );
}
