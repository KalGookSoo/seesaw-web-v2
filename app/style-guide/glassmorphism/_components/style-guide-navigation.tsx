'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const glassmorphismNavigationItems = [
  { href: '/style-guide/glassmorphism', label: 'Overview' },
  { href: '/style-guide/glassmorphism/colors', label: 'Colors' },
  { href: '/style-guide/glassmorphism/forms', label: 'Forms' },
  { href: '/style-guide/glassmorphism/feedback', label: 'Alert · Modal · Confirm' },
  { href: '/style-guide/glassmorphism/components', label: 'Components' }
] as const;

export function StyleGuideNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6 overflow-x-auto px-6 py-2 lg:px-8" aria-label="글래스모피즘 스타일 가이드 내비게이션">
      {glassmorphismNavigationItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            className={`pb-2 text-sm font-medium whitespace-nowrap transition-colors ${
              active
                ? 'border-b-2 border-[var(--glassmorphism-line)] font-bold text-[var(--glassmorphism-ink)]'
                : 'border-b-2 border-transparent text-[var(--glassmorphism-ink-muted)] hover:text-[var(--glassmorphism-ink)]'
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
