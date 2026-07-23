'use client';

import type { MouseEvent, ReactNode } from 'react';
import Link from 'next/link';

export function CategoryAnchorLink({
  href,
  className,
  children
}: Readonly<{
  href: string;
  className: string;
  children: ReactNode;
}>) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!href.startsWith('#')) {
      return;
    }

    const target = document.getElementById(href.slice(1));
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', href);
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
