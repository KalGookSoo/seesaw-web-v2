'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { styleGuideNavigationItems } from 'lib/style-guide';

export function StyleGuideNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-2 overflow-x-auto px-6 py-3 lg:px-8"
      aria-label="스타일 가이드 내비게이션"
    >
      {styleGuideNavigationItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            className={`rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition ${
              active
                ? 'bg-[var(--default-blue)] text-white shadow-[var(--default-shadow-soft)]'
                : 'bg-[var(--default-surface)] text-[var(--default-secondary-label)] hover:bg-[var(--default-fill)] hover:text-[var(--default-label)]'
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
