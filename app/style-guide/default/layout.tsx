import type { ReactNode } from 'react';
import Link from 'next/link';
import { StyleGuideNavigation } from 'app/style-guide/default/_components/style-guide-navigation';
import { ThemeToggle } from 'components/theme/theme-toggle';
import { ArrowLeft } from 'lucide-react';

import {
  ThemeColorControls,
  ThemeColorPlayground
} from '@/app/style-guide/_components/theme-color-playground';
import defaultTheme from '@/app/style-guide/default/default.module.css';

export default function StyleGuideLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ThemeColorPlayground
      className={`${defaultTheme.theme} min-h-dvh bg-[var(--default-surface-grouped)] text-[var(--default-label)] transition-colors duration-200`}
      initialAccentColor="#007aff"
      initialBackgroundColor="#f2f2f7"
    >
      <header className="border-b border-[var(--default-separator)] bg-[var(--default-surface)]/80 backdrop-blur-2xl">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-start lg:px-8">
          <div className="min-w-0">
            <Link
              className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--default-separator)] bg-[var(--default-surface)] px-3 py-1.5 text-sm font-medium text-[var(--default-secondary-label)] shadow-[var(--default-shadow-soft)] transition hover:bg-[var(--default-fill)] hover:text-[var(--default-label)]"
              href="/style-guide"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Style Guide Index
            </Link>
            <p className="text-sm font-semibold text-[var(--default-blue)] uppercase">
              Seesaw Web v2
            </p>
            <h1 className="mt-2 text-4xl font-semibold">Default Style Guide</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--default-secondary-label)]">
              Tailwind CSS와 기본 시스템 컬러 감각으로 구성하기 위한 디자인
              시스템 문서입니다.
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <div className="w-full rounded-2xl border border-[var(--default-separator)] bg-[var(--default-fill)] px-4 py-3 font-mono text-sm text-[var(--default-secondary-label)] shadow-[var(--default-shadow-soft)]">
              /style-guide/default
            </div>
            <ThemeColorControls
              className="w-full space-y-3 rounded-2xl border border-[var(--default-separator)] bg-[var(--default-surface)] px-4 py-3 shadow-[var(--default-shadow-soft)]"
              inputClassName="size-8 rounded-full border border-[var(--default-separator)] bg-transparent p-0"
              labelClassName="text-xs font-semibold text-[var(--default-secondary-label)]"
              resetButtonClassName="rounded-full bg-[var(--default-fill)] px-2.5 py-1 text-xs font-semibold text-[var(--default-secondary-label)] transition hover:text-[var(--default-label)]"
            />
            <ThemeToggle />
          </div>
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
    </ThemeColorPlayground>
  );
}
