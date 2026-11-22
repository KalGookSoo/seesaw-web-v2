import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from 'components/theme/theme-toggle';
import { StyleGuideNavigation } from 'app/style-guide/monochrome/_components/style-guide-navigation';
import monochromeTheme from 'app/style-guide/monochrome/monochrome.module.css';

export default function StyleGuideLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className={`${monochromeTheme.theme} min-h-dvh bg-[var(--monochrome-background)] font-sans text-[var(--monochrome-label)] transition-colors duration-200`}>
      <header className="border-b border-[var(--monochrome-separator)] bg-[var(--monochrome-surface)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8">
          <div>
            <Link className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--monochrome-secondary-label)] transition-colors hover:text-[var(--monochrome-label)]" href="/style-guide">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Style Guide Index
            </Link>
            <p className="text-sm font-medium text-[var(--monochrome-secondary-label)]">Seesaw Web v2</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight lg:text-5xl">Monochrome Style Guide</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--monochrome-secondary-label)]">차분한 회색조, 낮은 대비, 선명한 정보 위계로 콘텐츠와 사용자의 행동에 집중하는 제품형 디자인 시스템입니다.</p>
          </div>
          <div className="flex items-end justify-between gap-3 lg:flex-col lg:items-stretch">
            <div className="rounded-lg bg-[var(--monochrome-fill)] px-4 py-3 font-mono text-xs text-[var(--monochrome-secondary-label)]">/style-guide/monochrome</div>
            <ThemeToggle />
          </div>
        </div>
        <div className="border-t border-[var(--monochrome-separator)]"><div className="mx-auto max-w-7xl"><StyleGuideNavigation /></div></div>
      </header>
      <main className="mx-auto max-w-7xl space-y-12 px-6 py-10 lg:px-8">{children}</main>
    </div>
  );
}
