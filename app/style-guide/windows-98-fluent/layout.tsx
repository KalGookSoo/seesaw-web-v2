import type { ReactNode } from 'react';
import Link from 'next/link';
import { StyleGuideNavigation } from 'app/style-guide/windows-98-fluent/_components/style-guide-navigation';
import { ThemeToggle } from 'components/theme/theme-toggle';
import { ArrowLeft } from 'lucide-react';

import {
  ThemeColorControls,
  ThemeColorPlayground
} from '@/app/style-guide/_components/theme-color-playground';
import windows98FluentTheme from '@/app/style-guide/windows-98-fluent/windows-98-fluent.module.css';

export default function StyleGuideLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ThemeColorPlayground
      className={`${windows98FluentTheme.theme} min-h-dvh bg-[var(--windows-98-fluent-background)] font-sans text-[var(--windows-98-fluent-label)] transition-colors duration-200`}
      initialAccentColor="#000080"
      initialBackgroundColor="#008080"
    >
      <header className="border-b-2 border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-start lg:px-8">
          <div className="min-w-0">
            <Link
              className="mb-5 inline-flex w-fit items-center gap-2 border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-fill)] px-3 py-1.5 font-mono text-sm font-bold text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-shadow)] transition hover:bg-[var(--windows-98-fluent-surface-elevated)]"
              href="/style-guide"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              ..\STYLE-GUIDE
            </Link>
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
          <div className="flex min-w-0 flex-col gap-4">
            <div className="w-full border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-fill)] px-4 py-3 font-mono text-sm text-[var(--windows-98-fluent-secondary-label)] shadow-[var(--windows-98-fluent-shadow)]">
              /style-guide/windows-98-fluent
            </div>
            <ThemeColorControls
              className="w-full space-y-3 border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-fill)] px-4 py-3 shadow-[var(--windows-98-fluent-shadow)]"
              inputClassName="size-8 rounded-none border border-[var(--windows-98-fluent-separator)] bg-transparent p-0 shadow-[var(--windows-98-fluent-inset)]"
              labelClassName="font-mono text-xs font-bold text-[var(--windows-98-fluent-label)]"
              resetButtonClassName="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] px-2 py-1 font-mono text-xs font-bold text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)] transition hover:bg-[var(--windows-98-fluent-surface-elevated)]"
            />
            <ThemeToggle />
          </div>
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
    </ThemeColorPlayground>
  );
}
