import type { ReactNode } from 'react';
import { NeoBrutalismComponentTabs } from 'app/style-guide/neo-brutalism/components/_components/component-tabs';

export default function Layout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="space-y-6">
      <NeoBrutalismComponentTabs />
      {children}
    </div>
  );
}
