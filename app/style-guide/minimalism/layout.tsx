import type { ReactNode } from 'react';
import Link from 'next/link';
import { StyleGuideNavigation } from 'app/style-guide/minimalism/_components/style-guide-navigation';
import { ThemeToggle } from 'components/theme/theme-toggle';
import { ArrowLeft } from 'lucide-react';

import {
  ThemeColorControls,
  ThemeColorPlayground
} from '@/app/style-guide/_components/theme-color-playground';
import minimalismTheme from '@/app/style-guide/minimalism/minimalism.module.css';

export default function StyleGuideLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ThemeColorPlayground
      className={`${minimalismTheme.theme} min-h-dvh bg-[var(--minimalism-background)] font-sans text-[var(--minimalism-label)] transition-colors duration-200`}
      initialAccentColor="#18181b"
      initialBackgroundColor="#ffffff"
    >
      <header className="border-b border-[var(--minimalism-separator)] bg-[var(--minimalism-surface)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-start lg:px-8">
          <div className="min-w-0">
            <Link
              className="mb-5 inline-flex w-fit items-center gap-2 rounded-lg border border-[var(--minimalism-separator)] bg-[var(--minimalism-surface)] px-3 py-1.5 text-sm font-medium text-[var(--minimalism-secondary-label)] transition hover:bg-[var(--minimalism-fill)] hover:text-[var(--minimalism-label)]"
              href="/style-guide"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Style Guide Index
            </Link>
            <p className="text-sm font-medium text-[var(--minimalism-secondary-label)]">
              Seesaw Web v2
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight lg:text-5xl">
              Minimalism Style Guide
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--minimalism-secondary-label)]">
              장식을 덜어내고 여백, 정렬, 타이포그래피, 얇은 경계선만으로 화면의
              질서를 만드는 디자인 시스템 문서입니다.
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <div className="w-full rounded-lg bg-[var(--minimalism-fill)] px-4 py-3 font-mono text-sm text-[var(--minimalism-secondary-label)]">
              /style-guide/minimalism
            </div>
            <ThemeColorControls
              className="w-full space-y-3 rounded-lg border border-[var(--minimalism-separator)] bg-[var(--minimalism-surface)] px-4 py-3"
              inputClassName="size-8 rounded border border-[var(--minimalism-separator)] bg-transparent p-0"
              labelClassName="text-xs font-medium text-[var(--minimalism-secondary-label)]"
              resetButtonClassName="rounded-md bg-[var(--minimalism-fill)] px-2.5 py-1 text-xs font-medium text-[var(--minimalism-secondary-label)] transition hover:text-[var(--minimalism-label)]"
            />
            <ThemeToggle />
          </div>
        </div>
        <div className="border-t border-[var(--minimalism-separator)]">
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
