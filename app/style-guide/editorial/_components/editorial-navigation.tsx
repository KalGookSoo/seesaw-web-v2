'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  ['Overview', '/style-guide/editorial'],
  ['Foundations', '/style-guide/editorial/foundations'],
  ['Atoms', '/style-guide/editorial/atoms'],
  ['Molecules', '/style-guide/editorial/molecules'],
  ['Organisms', '/style-guide/editorial/organisms'],
  ['Patterns', '/style-guide/editorial/patterns']
] as const;

export function EditorialNavigation() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto mt-10 flex max-w-7xl gap-5 overflow-x-auto overscroll-x-auto border-t pt-4 text-xs font-bold tracking-[0.14em] uppercase" style={{ borderColor: 'var(--editorial-line-soft)' }}>
      {items.map(([label, href]) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`shrink-0 border-b-2 pb-2 transition-colors ${isActive ? 'border-[var(--editorial-primary)] text-[var(--editorial-ink)]' : 'border-transparent text-[var(--editorial-ink-muted)] hover:border-[var(--editorial-line)] hover:text-[var(--editorial-ink)]'}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
