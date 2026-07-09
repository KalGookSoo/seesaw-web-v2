import type { ReactNode } from 'react';
import { EditorialComponentTabs } from 'app/style-guide/editorial/components/_components/component-tabs';

export default function Layout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="space-y-6">
      <EditorialComponentTabs />
      {children}
    </div>
  );
}
