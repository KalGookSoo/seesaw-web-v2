import type { ReactNode } from 'react';
import Link from 'next/link';
import { ThemeToggle } from 'components/theme/theme-toggle';
import editorial from './editorial.module.css';

export default function EditorialLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className={`${editorial.theme} min-h-dvh font-sans transition-colors duration-200`}>
      <header className="border-b px-6 py-5 lg:px-10" style={{ borderColor: 'var(--editorial-line-soft)' }}>
        <div className="mx-auto flex max-w-7xl items-start justify-between gap-6">
          <div>
            <Link href="/style-guide" className={`${editorial.label} text-[var(--editorial-ink-muted)] hover:text-[var(--editorial-ink)]`}>← Style Guide Index</Link>
            <p className="mt-8 text-xs font-bold tracking-[0.2em] text-[var(--editorial-ink-muted)] uppercase">Seesaw Web v2</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] uppercase sm:text-6xl">Editorial<br />Style Guide</h1>
          </div>
          <div className="flex flex-col items-end gap-4">
            <code className="hidden border px-4 py-3 text-xs sm:block" style={{ borderColor: 'var(--editorial-line-soft)' }}>/style-guide/editorial</code>
            <ThemeToggle />
          </div>
        </div>
        <nav className="mx-auto mt-10 flex max-w-7xl gap-5 overflow-x-auto overscroll-x-auto border-t pt-4 text-xs font-bold tracking-[0.14em] uppercase" style={{ borderColor: 'var(--editorial-line-soft)' }}>
          <Link href="/style-guide/editorial">Overview</Link>
          <Link href="/style-guide/editorial/foundations" className="text-[var(--editorial-ink-muted)]">Foundations</Link>
          <Link href="/style-guide/editorial/atoms" className="text-[var(--editorial-ink-muted)]">Atoms</Link>
          <Link href="/style-guide/editorial/molecules" className="text-[var(--editorial-ink-muted)]">Molecules</Link>
          <Link href="/style-guide/editorial/organisms" className="text-[var(--editorial-ink-muted)]">Organisms</Link>
          <Link href="/style-guide/editorial/patterns" className="text-[var(--editorial-ink-muted)]">Patterns</Link>
          <Link href="/style-guide/editorial/components" className="text-[var(--editorial-ink-muted)]">Component index</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">{children}</main>
    </div>
  );
}
