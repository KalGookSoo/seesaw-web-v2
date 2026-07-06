import type { ReactNode } from 'react';
import { StyleGuideNavigation } from 'app/style-guide/neumorphism/_components/style-guide-navigation';
import { ThemeToggle } from 'components/theme/theme-toggle';
import neumorphismTheme from 'styles/themes/neumorphism.module.css';

export default function StyleGuideLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main
      className={`${neumorphismTheme.theme} min-h-dvh bg-[var(--neumorphism-background)] font-sans text-[var(--neumorphism-label)] transition-colors duration-200`}
    >
      <header className="bg-[var(--neumorphism-surface)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="w-fit rounded-full bg-[var(--neumorphism-surface)] px-4 py-2 text-sm font-semibold text-[var(--neumorphism-blue)] shadow-[var(--neumorphism-shadow-soft)]">
              Seesaw Web v2
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight lg:text-5xl">
              Neumorphism Style Guide
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--neumorphism-secondary-label)]">
              파스텔 표면, 낮은 대비, 부드러운 inset/outset 음영으로 화면을
              조용하게 분리하는 디자인 시스템 문서입니다.
            </p>
          </div>
          <div className="rounded-3xl bg-[var(--neumorphism-surface)] px-5 py-4 font-mono text-sm text-[var(--neumorphism-secondary-label)] shadow-[var(--neumorphism-shadow-soft)]">
            /style-guide/neumorphism
          </div>
          <ThemeToggle />
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-4 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <StyleGuideNavigation />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-10 px-6 py-8 lg:px-8">
        {children}
      </div>
    </main>
  );
}
