import type { ReactNode } from 'react';
import { StyleGuideNavigation } from 'app/style-guide/windows-98-fluent/_components/style-guide-navigation';
import { ThemeToggle } from 'components/theme/theme-toggle';
import windows98FluentTheme from 'styles/themes/windows-98-fluent.module.css';

export default function StyleGuideLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main
      className={`${windows98FluentTheme.theme} min-h-dvh bg-[var(--windows-98-fluent-background)] font-sans text-[var(--windows-98-fluent-label)] transition-colors duration-200`}
    >
      <header className="border-b-2 border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="w-fit border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-fill)] px-3 py-1 font-mono text-sm font-bold text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)]">
              C:\SEESAW\WEB_V2.EXE
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight lg:text-5xl">
              Windows 98 Fluent Style Guide
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--windows-98-fluent-secondary-label)]">
              회색 시스템 표면, 파란 타이틀바, raised/sunken bevel, 고전적인
              버튼 질감으로 구성한 Windows 98 스타일 디자인 시스템 문서입니다.
            </p>
          </div>
          <div className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-fill)] px-4 py-3 font-mono text-sm text-[var(--windows-98-fluent-secondary-label)] shadow-[var(--windows-98-fluent-shadow)]">
            /style-guide/windows-98-fluent
          </div>
          <ThemeToggle />
        </div>
        <div className="border-t border-[var(--windows-98-fluent-line-soft)] bg-[var(--windows-98-fluent-fill)] shadow-[var(--windows-98-fluent-inset)]">
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
