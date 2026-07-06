'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const minimalismNavigationItems = [
  { href: '/style-guide/minimalism', label: 'Overview' },
  { href: '/style-guide/minimalism/colors', label: 'Colors' },
  { href: '/style-guide/minimalism/forms', label: 'Forms' },
  {
    href: '/style-guide/minimalism/feedback',
    label: 'Alert · Modal · Confirm'
  },
  { href: '/style-guide/minimalism/components', label: 'Components' }
] as const;

export function StyleGuideNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-6 overflow-x-auto px-6 py-2 lg:px-8"
      aria-label="Minimalism 스타일 가이드 내비게이션"
    >
      {minimalismNavigationItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            className={`pb-2 text-sm font-medium whitespace-nowrap transition-colors ${
              active
                ? 'border-b-2 border-[var(--minimalism-line)] font-bold text-[var(--minimalism-ink)]'
                : 'border-b-2 border-transparent text-[var(--minimalism-ink-muted)] hover:text-[var(--minimalism-ink)]'
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
