import type { ReactNode } from 'react';

import { ThemeToggle } from 'components/theme/theme-toggle';
import { StyleGuideNavigation } from 'app/style-guide/default/_components/style-guide-navigation';

export default function StyleGuideLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="bg-default-surface-grouped text-default-label min-h-dvh">
      <header className="border-default-separator bg-default-surface/80 border-b backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-default-blue text-sm font-semibold uppercase">Seesaw Web v2</p>
            <h1 className="mt-2 text-4xl font-semibold">Default Style Guide</h1>
            <p className="text-default-secondary-label mt-3 max-w-3xl text-base leading-7">
              Tailwind CSS와 기본 시스템 컬러 감각으로 구성하기 위한 디자인 시스템 문서입니다.
            </p>
          </div>
          <div className="border-default-separator bg-default-fill text-default-secondary-label rounded-lg border px-4 py-3 font-mono text-sm">
            /style-guide
          </div>
          <ThemeToggle />
        </div>
        <div className="border-default-separator border-t">
          <div className="mx-auto max-w-7xl">
            <StyleGuideNavigation />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-10 px-6 py-10 lg:px-8">{children}</div>
    </main>
  );
}
