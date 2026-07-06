import type { ReactNode } from 'react';
import { StyleGuideNavigation } from 'app/style-guide/default/_components/style-guide-navigation';
import { ThemeToggle } from 'components/theme/theme-toggle';
import defaultTheme from 'styles/themes/default.module.css';

export default function StyleGuideLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main
      className={`${defaultTheme.theme} min-h-dvh bg-[var(--default-surface-grouped)] text-[var(--default-label)] transition-colors duration-200`}
    >
      <header className="border-b border-[var(--default-separator)] bg-[var(--default-surface)]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold text-[var(--default-blue)] uppercase">
              Seesaw Web v2
            </p>
            <h1 className="mt-2 text-4xl font-semibold">Default Style Guide</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--default-secondary-label)]">
              Tailwind CSS와 기본 시스템 컬러 감각으로 구성하기 위한 디자인
              시스템 문서입니다.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--default-separator)] bg-[var(--default-fill)] px-4 py-3 font-mono text-sm text-[var(--default-secondary-label)] shadow-[var(--default-shadow-soft)]">
            /style-guide
          </div>
          <ThemeToggle />
        </div>
        <div className="border-t border-[var(--default-separator)]">
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
