'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const windows98FluentNavigationItems = [
  { href: '/style-guide/windows-98-fluent', label: 'Overview' },
  { href: '/style-guide/windows-98-fluent/colors', label: 'Colors' },
  { href: '/style-guide/windows-98-fluent/forms', label: 'Forms' },
  {
    href: '/style-guide/windows-98-fluent/feedback',
    label: 'Alert · Modal · Confirm'
  },
  { href: '/style-guide/windows-98-fluent/components', label: 'Components' }
] as const;

export function StyleGuideNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-2 overflow-x-auto px-6 py-2 lg:px-8"
      aria-label="Windows 98 Fluent 스타일 가이드 내비게이션"
    >
      {windows98FluentNavigationItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            className={`border border-[var(--windows-98-fluent-separator)] px-4 py-2 font-mono text-sm font-bold whitespace-nowrap transition-colors ${
              active
                ? 'bg-[var(--windows-98-fluent-accent)] text-[var(--windows-98-fluent-accent-contrast)] shadow-[var(--windows-98-fluent-inset-pressed)]'
                : 'bg-[var(--windows-98-fluent-surface)] text-[var(--windows-98-fluent-ink)] shadow-[var(--windows-98-fluent-inset)] hover:bg-[var(--windows-98-fluent-fill)]'
            }`}
            href={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
