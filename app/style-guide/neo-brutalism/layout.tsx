import type { ReactNode } from 'react';
import Link from 'next/link';
import { StyleGuideNavigation } from 'app/style-guide/neo-brutalism/_components/style-guide-navigation';
import { ThemeToggle } from 'components/theme/theme-toggle';
import { ArrowLeft } from 'lucide-react';

import {
  ThemeColorControls,
  ThemeColorPlayground
} from '@/app/style-guide/_components/theme-color-playground';
import neoBrutalismTheme from '@/app/style-guide/neo-brutalism/neo-brutalism.module.css';

export default function StyleGuideLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ThemeColorPlayground
      className={`${neoBrutalismTheme.theme} min-h-dvh bg-[var(--neo-brutalism-background)] font-sans text-[var(--neo-brutalism-label)] transition-colors duration-200`}
      initialAccentColor="#0057ff"
      initialBackgroundColor="#f6f0df"
    >
      <header className="border-b-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-start lg:px-8">
          <div className="min-w-0">
            <Link
              className="mb-5 inline-flex w-fit items-center gap-2 border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-warning)] px-3 py-1.5 text-sm font-black text-[var(--neo-brutalism-label)] uppercase shadow-[var(--neo-brutalism-shadow)] transition hover:-translate-x-0.5 hover:-translate-y-0.5"
              href="/style-guide"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Style Guide Index
            </Link>
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
          <div className="flex min-w-0 flex-col gap-4">
            <div className="w-full border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-accent)] px-4 py-3 font-mono text-sm font-black text-[var(--neo-brutalism-accent-contrast)] shadow-[var(--neo-brutalism-shadow)]">
              /style-guide/neo-brutalism
            </div>
            <ThemeColorControls
              className="w-full space-y-3 border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface-grouped)] px-4 py-3 shadow-[var(--neo-brutalism-shadow)]"
              inputClassName="size-8 rounded-none border-2 border-[var(--neo-brutalism-separator)] bg-transparent p-0"
              labelClassName="text-xs font-black text-[var(--neo-brutalism-label)] uppercase"
              resetButtonClassName="border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] px-2 py-1 text-xs font-black text-[var(--neo-brutalism-label)] uppercase shadow-[3px_3px_0_var(--neo-brutalism-separator)] transition hover:-translate-x-0.5 hover:-translate-y-0.5"
            />
            <ThemeToggle />
          </div>
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
    </ThemeColorPlayground>
  );
}
