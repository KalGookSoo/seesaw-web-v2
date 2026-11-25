import type { ReactNode } from 'react';

export const metadata = { title: '인증', robots: { index: false, follow: false } };

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
