'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { neumorphismComponentItems } from 'app/style-guide/neumorphism/components/_components/component-items';

export function NeumorphismComponentTabs() {
  const pathname = usePathname();

  return (
    <nav
      className="rounded-3xl border border-[var(--neumorphism-separator)] bg-[var(--neumorphism-fill)] p-1 shadow-[var(--neumorphism-shadow-inset)]"
      aria-label="Neumorphism 컴포넌트 탭"
    >
      <div className="flex gap-1 overflow-x-auto">
        <Link
          className={`shrink-0 rounded-3xl border border-[var(--neumorphism-separator)] px-3 py-2 font-mono text-sm font-semibold shadow-[var(--neumorphism-shadow-soft)] ${
            pathname === '/style-guide/neumorphism/components'
              ? 'bg-[var(--neumorphism-accent)] text-[var(--neumorphism-accent-contrast)]'
              : 'bg-[var(--neumorphism-surface)] text-[var(--neumorphism-label)] hover:bg-[var(--neumorphism-surface-elevated)]'
          }`}
          href="/style-guide/neumorphism/components"
        >
          Index
        </Link>
        {neumorphismComponentItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              className={`shrink-0 rounded-3xl border border-[var(--neumorphism-separator)] px-3 py-2 font-mono text-sm font-semibold shadow-[var(--neumorphism-shadow-soft)] ${
                active
                  ? 'bg-[var(--neumorphism-accent)] text-[var(--neumorphism-accent-contrast)]'
                  : 'bg-[var(--neumorphism-surface)] text-[var(--neumorphism-label)] hover:bg-[var(--neumorphism-surface-elevated)]'
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
