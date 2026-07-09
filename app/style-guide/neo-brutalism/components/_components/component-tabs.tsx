'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { neoBrutalismComponentItems } from 'app/style-guide/neo-brutalism/components/_components/component-items';

export function NeoBrutalismComponentTabs() {
  const pathname = usePathname();

  return (
    <nav
      className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-fill)] p-2"
      aria-label="Neo-Brutalism 컴포넌트 탭"
    >
      <div className="flex gap-2 overflow-x-auto">
        <Link
          className={`shrink-0 border-2 border-[var(--neo-brutalism-separator)] px-3 py-2 text-sm font-black uppercase transition-transform hover:-translate-y-0.5 ${
            pathname === '/style-guide/neo-brutalism/components'
              ? 'bg-[var(--neo-brutalism-accent)] text-[var(--neo-brutalism-accent-contrast)] shadow-[3px_3px_0_var(--neo-brutalism-separator)]'
              : 'bg-[var(--neo-brutalism-surface)] text-[var(--neo-brutalism-label)]'
          }`}
          href="/style-guide/neo-brutalism/components"
        >
          Index
        </Link>
        {neoBrutalismComponentItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              className={`shrink-0 border-2 border-[var(--neo-brutalism-separator)] px-3 py-2 text-sm font-black uppercase transition-transform hover:-translate-y-0.5 ${
                active
                  ? 'bg-[var(--neo-brutalism-accent)] text-[var(--neo-brutalism-accent-contrast)] shadow-[3px_3px_0_var(--neo-brutalism-separator)]'
                  : 'bg-[var(--neo-brutalism-surface)] text-[var(--neo-brutalism-label)]'
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
