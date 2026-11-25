import type { ReactNode } from 'react';

export const metadata = { title: '시스템 정보', robots: { index: false, follow: false } };

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
