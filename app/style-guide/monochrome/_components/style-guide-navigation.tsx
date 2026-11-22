'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { href: '/style-guide/monochrome', label: 'Overview' },
  { href: '/style-guide/monochrome/colors', label: 'Colors' },
  { href: '/style-guide/monochrome/forms', label: 'Forms' },
  { href: '/style-guide/monochrome/components', label: 'Components' }
] as const;

export function StyleGuideNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6 overflow-x-auto px-6 py-2 lg:px-8" aria-label="Monochrome 스타일 가이드 내비게이션">
      {navigationItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`border-b-2 pb-2 text-sm whitespace-nowrap transition-colors ${
              active
                ? 'border-[var(--monochrome-accent)] font-semibold text-[var(--monochrome-label)]'
                : 'border-transparent text-[var(--monochrome-tertiary-label)] hover:text-[var(--monochrome-label)]'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
