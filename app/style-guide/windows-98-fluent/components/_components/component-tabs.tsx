'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { windows98ComponentItems } from 'app/style-guide/windows-98-fluent/components/_components/component-items';

export function Windows98ComponentTabs() {
  const pathname = usePathname();

  return (
    <nav
      className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-fill)] p-1 shadow-[var(--windows-98-fluent-inset-pressed)]"
      aria-label="Windows 98 Fluent 컴포넌트 탭"
    >
      <div className="flex gap-1 overflow-x-auto">
        <Link
          className={`shrink-0 border border-[var(--windows-98-fluent-separator)] px-3 py-2 font-mono text-sm font-semibold shadow-[var(--windows-98-fluent-inset)] ${
            pathname === '/style-guide/windows-98-fluent/components'
              ? 'bg-[var(--windows-98-fluent-accent)] text-[var(--windows-98-fluent-accent-contrast)]'
              : 'bg-[var(--windows-98-fluent-surface)] text-[var(--windows-98-fluent-label)] hover:bg-[var(--windows-98-fluent-surface-elevated)]'
          }`}
          href="/style-guide/windows-98-fluent/components"
        >
          Index
        </Link>
        {windows98ComponentItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              className={`shrink-0 border border-[var(--windows-98-fluent-separator)] px-3 py-2 font-mono text-sm font-semibold shadow-[var(--windows-98-fluent-inset)] ${
                active
                  ? 'bg-[var(--windows-98-fluent-accent)] text-[var(--windows-98-fluent-accent-contrast)]'
                  : 'bg-[var(--windows-98-fluent-surface)] text-[var(--windows-98-fluent-label)] hover:bg-[var(--windows-98-fluent-surface-elevated)]'
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
