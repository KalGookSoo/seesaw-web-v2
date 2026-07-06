'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const editorialNavigationItems = [
  { href: '/style-guide/editorial', label: 'Overview' },
  { href: '/style-guide/editorial/colors', label: 'Colors' },
  { href: '/style-guide/editorial/forms', label: 'Forms' },
  { href: '/style-guide/editorial/feedback', label: 'Alert · Modal · Confirm' },
  { href: '/style-guide/editorial/components', label: 'Components' }
] as const;

export function StyleGuideNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-6 overflow-x-auto px-6 py-2 lg:px-8"
      aria-label="에디토리얼 스타일 가이드 내비게이션"
    >
      {editorialNavigationItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            className={`pb-2 text-sm font-medium whitespace-nowrap transition-colors ${
              active
                ? 'border-b-2 border-[var(--editorial-line)] font-bold text-[var(--editorial-ink)]'
                : 'border-b-2 border-transparent text-[var(--editorial-ink-muted)] hover:text-[var(--editorial-ink)]'
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
