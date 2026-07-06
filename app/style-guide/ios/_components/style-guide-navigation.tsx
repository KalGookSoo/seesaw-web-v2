'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const iosNavigationItems = [
  { href: '/style-guide/ios', label: 'Overview' },
  { href: '/style-guide/ios/colors', label: 'Colors' },
  { href: '/style-guide/ios/forms', label: 'Forms' },
  { href: '/style-guide/ios/feedback', label: 'Alert · Modal · Confirm' },
  { href: '/style-guide/ios/components', label: 'Components' }
] as const;

export function StyleGuideNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-6 overflow-x-auto px-6 py-2 lg:px-8"
      aria-label="iOS 스타일 가이드 내비게이션"
    >
      {iosNavigationItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            className={`pb-2 text-sm font-medium whitespace-nowrap transition-colors ${
              active
                ? 'border-b-2 border-[var(--ios-line)] font-bold text-[var(--ios-ink)]'
                : 'border-b-2 border-transparent text-[var(--ios-ink-muted)] hover:text-[var(--ios-ink)]'
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
