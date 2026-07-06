'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { styleGuideNavigationItems } from 'lib/style-guide';

export function StyleGuideNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto px-6 py-3 lg:px-8" aria-label="스타일 가이드 내비게이션">
      {styleGuideNavigationItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            className={`rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition ${
              active ? 'bg-default-blue text-white' : 'bg-default-surface text-default-secondary-label hover:bg-default-fill hover:text-default-label'
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
