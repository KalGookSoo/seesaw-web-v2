'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const neumorphismNavigationItems = [
  { href: '/style-guide/neumorphism', label: 'Overview' },
  { href: '/style-guide/neumorphism/colors', label: 'Colors' },
  { href: '/style-guide/neumorphism/forms', label: 'Forms' },
  {
    href: '/style-guide/neumorphism/feedback',
    label: 'Alert · Modal · Confirm'
  },
  { href: '/style-guide/neumorphism/components', label: 'Components' }
] as const;

export function StyleGuideNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-3 overflow-x-auto rounded-3xl bg-[var(--neumorphism-surface)] p-3 shadow-[var(--neumorphism-shadow-inset)]"
      aria-label="Neumorphism 스타일 가이드 내비게이션"
    >
      {neumorphismNavigationItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
              active
                ? 'bg-[var(--neumorphism-surface)] text-[var(--neumorphism-ink)] shadow-[var(--neumorphism-shadow-soft)]'
                : 'text-[var(--neumorphism-ink-muted)] hover:text-[var(--neumorphism-ink)]'
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
