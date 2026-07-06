'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const neoBrutalismNavigationItems = [
  { href: '/style-guide/neo-brutalism', label: 'Overview' },
  { href: '/style-guide/neo-brutalism/colors', label: 'Colors' },
  { href: '/style-guide/neo-brutalism/forms', label: 'Forms' },
  {
    href: '/style-guide/neo-brutalism/feedback',
    label: 'Alert · Modal · Confirm'
  },
  { href: '/style-guide/neo-brutalism/components', label: 'Components' }
] as const;

export function StyleGuideNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-3 overflow-x-auto px-6 py-3 lg:px-8"
      aria-label="Neo-Brutalism 스타일 가이드 내비게이션"
    >
      {neoBrutalismNavigationItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            className={`border-2 border-[var(--neo-brutalism-separator)] px-4 py-2 text-sm font-black whitespace-nowrap uppercase transition-transform hover:-translate-y-0.5 ${
              active
                ? 'bg-[var(--neo-brutalism-accent)] text-[var(--neo-brutalism-accent-contrast)] shadow-[var(--neo-brutalism-shadow)]'
                : 'bg-[var(--neo-brutalism-surface)] text-[var(--neo-brutalism-ink)]'
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
