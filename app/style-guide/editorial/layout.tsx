import type { ReactNode } from 'react';
import { StyleGuideNavigation } from 'app/style-guide/editorial/_components/style-guide-navigation';
import { ThemeToggle } from 'components/theme/theme-toggle';
import editorialTheme from 'styles/themes/editorial.module.css';

export default function StyleGuideLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main
      className={`${editorialTheme.theme} min-h-dvh bg-[var(--editorial-background)] font-sans text-[var(--editorial-ink)] transition-colors duration-200`}
    >
      <header className="border-b border-[var(--editorial-line-soft)] bg-[var(--editorial-surface)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-[var(--editorial-accent)] uppercase">Seesaw Web v2</p>
            <h1 className="mt-2 font-serif text-4xl font-black tracking-tight lg:text-5xl">Editorial Style Guide</h1>
            <p className="mt-4 max-w-3xl font-serif text-base leading-7 text-[var(--editorial-ink-soft)] italic">
              타이포그래피와 단단한 직선 경계선 중심의 지면 레이아웃 감각으로 구성한 디자인 시스템 문서입니다.
            </p>
          </div>
          <div className="border border-[var(--editorial-line)] bg-[var(--editorial-surface-muted)] px-4 py-2 font-mono text-xs tracking-wider text-[var(--editorial-ink-soft)] uppercase">
            /style-guide/editorial
          </div>
          <ThemeToggle />
        </div>
        <div className="border-t border-[var(--editorial-line-soft)]">
          <div className="mx-auto max-w-7xl">
            <StyleGuideNavigation />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-12 px-6 py-12 lg:px-8">{children}</div>
    </main>
  );
}
