'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { editorialComponentItems } from 'app/style-guide/editorial/components/_components/component-items';

export function EditorialComponentTabs() {
  const pathname = usePathname();

  return (
    <nav
      className="border border-[var(--editorial-line-soft)] bg-[var(--editorial-surface-muted)] p-1"
      aria-label="Editorial 컴포넌트 탭"
    >
      <div className="flex gap-1 overflow-x-auto">
        <Link
          className={`shrink-0 border border-[var(--editorial-line-soft)] px-3 py-2 font-mono text-sm font-semibold ${
            pathname === '/style-guide/editorial/components'
              ? 'bg-[var(--editorial-accent)] text-[var(--editorial-accent-contrast)]'
              : 'bg-[var(--editorial-surface)] text-[var(--editorial-ink)] hover:bg-[var(--editorial-surface-elevated)]'
          }`}
          href="/style-guide/editorial/components"
        >
          Index
        </Link>
        {editorialComponentItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              className={`shrink-0 border border-[var(--editorial-line-soft)] px-3 py-2 font-mono text-sm font-semibold ${
                active
                  ? 'bg-[var(--editorial-accent)] text-[var(--editorial-accent-contrast)]'
                  : 'bg-[var(--editorial-surface)] text-[var(--editorial-ink)] hover:bg-[var(--editorial-surface-elevated)]'
              }`}
              href={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
