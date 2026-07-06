'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const retroWebNavigationItems = [
  { href: '/style-guide/retro-web', label: 'Overview' },
  { href: '/style-guide/retro-web/colors', label: 'Colors' },
  { href: '/style-guide/retro-web/forms', label: 'Forms' },
  { href: '/style-guide/retro-web/feedback', label: 'Alert · Modal · Confirm' },
  { href: '/style-guide/retro-web/components', label: 'Components' }
] as const;

export function StyleGuideNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-2 overflow-x-auto px-6 py-2 lg:px-8"
      aria-label="Retro Web 스타일 가이드 내비게이션"
    >
      {retroWebNavigationItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            className={`border border-[var(--retro-web-separator)] px-4 py-2 font-mono text-sm font-bold whitespace-nowrap shadow-[var(--retro-web-shadow-soft)] transition-colors ${
              active
                ? 'bg-[var(--retro-web-accent)] text-[var(--retro-web-accent-contrast)]'
                : 'bg-[var(--retro-web-surface)] text-[var(--retro-web-ink-muted)] hover:bg-[var(--retro-web-accent-soft)] hover:text-[var(--retro-web-ink)]'
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
