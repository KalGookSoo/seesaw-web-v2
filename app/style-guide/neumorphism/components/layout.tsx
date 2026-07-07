import type { ReactNode } from 'react';
import { NeumorphismComponentTabs } from 'app/style-guide/neumorphism/components/_components/component-tabs';

export default function Layout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="space-y-6">
      <NeumorphismComponentTabs />
      {children}
    </div>
  );
}
