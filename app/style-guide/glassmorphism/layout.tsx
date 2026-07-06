import type { ReactNode } from 'react';
import { StyleGuideNavigation } from 'app/style-guide/glassmorphism/_components/style-guide-navigation';
import { ThemeToggle } from 'components/theme/theme-toggle';
import glassmorphismTheme from 'styles/themes/glassmorphism.module.css';

export default function StyleGuideLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main
      className={`${glassmorphismTheme.theme} relative min-h-dvh overflow-hidden bg-[var(--glassmorphism-background)] font-sans text-[var(--glassmorphism-ink)] transition-colors duration-200`}
    >
      <div className="pointer-events-none absolute -top-32 left-1/2 size-96 -translate-x-1/2 rounded-full bg-[var(--glassmorphism-background-accent-a)]/45 blur-3xl" />
      <div className="pointer-events-none absolute top-48 -left-24 size-80 rounded-full bg-[var(--glassmorphism-background-accent-b)]/40 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 size-96 rounded-full bg-[var(--glassmorphism-background-accent-c)]/35 blur-3xl" />

      <header className="relative border-b border-[var(--glassmorphism-line-soft)] bg-[var(--glassmorphism-surface)]/70 shadow-[var(--glassmorphism-shadow)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-[var(--glassmorphism-accent)] uppercase">Seesaw Web v2</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight lg:text-5xl">Glassmorphism Style Guide</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--glassmorphism-ink-soft)]">
              배경 이미지와 컬러가 은은하게 비치는 반투명 표면, 깊은 blur, 부드러운 하이라이트로 구성한 디자인 시스템 문서입니다.
            </p>
          </div>
          <div className="rounded-full border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface-muted)] px-4 py-2 font-mono text-xs tracking-wider text-[var(--glassmorphism-ink-soft)] uppercase backdrop-blur-xl">
            /style-guide/glassmorphism
          </div>
          <ThemeToggle />
        </div>
        <div className="border-t border-[var(--glassmorphism-line-soft)]">
          <div className="mx-auto max-w-7xl">
            <StyleGuideNavigation />
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl space-y-12 px-6 py-12 lg:px-8">{children}</div>
    </main>
  );
}
