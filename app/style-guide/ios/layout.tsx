import type { ReactNode } from 'react';
import { StyleGuideNavigation } from 'app/style-guide/ios/_components/style-guide-navigation';
import { ThemeToggle } from 'components/theme/theme-toggle';
import iosTheme from 'styles/themes/ios.module.css';

export default function StyleGuideLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main
      className={`${iosTheme.theme} min-h-dvh bg-[var(--ios-background)] font-sans text-[var(--ios-label)] transition-colors duration-200`}
    >
      <header className="border-b border-[var(--ios-separator)] bg-[var(--ios-surface)]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold text-[var(--ios-blue)]">
              Seesaw Web v2
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight lg:text-5xl">
              iOS Style Guide
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--ios-secondary-label)]">
              iPhone과 iPad의 grouped surface, system color, 커다란 터치 영역,
              bottom sheet 감각을 기준으로 구성한 디자인 시스템 문서입니다.
            </p>
          </div>
          <div className="rounded-lg bg-[var(--ios-fill)] px-4 py-3 font-mono text-sm text-[var(--ios-secondary-label)]">
            /style-guide/ios
          </div>
          <ThemeToggle />
        </div>
        <div className="border-t border-[var(--ios-line-soft)]">
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
