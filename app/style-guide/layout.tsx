import type { ReactNode } from 'react';

export const metadata = { title: '스타일 가이드', robots: { index: false, follow: false } };

export default function Layout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return <>{children}</>;
}
