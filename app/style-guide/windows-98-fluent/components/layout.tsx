import type { ReactNode } from 'react';
import { Windows98ComponentTabs } from 'app/style-guide/windows-98-fluent/components/_components/component-tabs';

export default function Layout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="space-y-6">
      <Windows98ComponentTabs />
      {children}
    </div>
  );
}
