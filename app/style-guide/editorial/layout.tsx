import type { ReactNode } from 'react';
import Link from 'next/link';
import { ThemeToggle } from 'components/theme/theme-toggle';
import { EditorialNavigation } from './_components/editorial-navigation';
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
        <EditorialNavigation />
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">{children}</main>
    </div>
  );
}
