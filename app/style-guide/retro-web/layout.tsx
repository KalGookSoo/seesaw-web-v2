import type { ReactNode } from 'react';
import Link from 'next/link';
import { StyleGuideNavigation } from 'app/style-guide/retro-web/_components/style-guide-navigation';
import { ThemeToggle } from 'components/theme/theme-toggle';
import { ArrowLeft } from 'lucide-react';
import retroWebTheme from '@/app/style-guide/retro-web/retro-web.module.css';

export default function StyleGuideLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main
      className={`${retroWebTheme.theme} min-h-dvh bg-[var(--retro-web-background)] font-sans text-[var(--retro-web-label)] transition-colors duration-200`}
    >
      <header className="border-b-2 border-[var(--retro-web-separator)] bg-[var(--retro-web-surface)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <Link
              className="mb-5 inline-flex w-fit items-center gap-2 border border-[var(--retro-web-separator)] bg-[var(--retro-web-fill)] px-3 py-1.5 font-mono text-sm font-bold text-[var(--retro-web-secondary-label)] shadow-[var(--retro-web-shadow-soft)] transition hover:bg-[var(--retro-web-accent-soft)] hover:text-[var(--retro-web-blue)]"
              href="/style-guide"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              ../STYLE-GUIDE
            </Link>
            <p className="w-fit border border-[var(--retro-web-separator)] bg-[var(--retro-web-accent-soft)] px-3 py-1 font-mono text-sm font-bold text-[var(--retro-web-blue)] shadow-[var(--retro-web-shadow-soft)]">
              SEESAW_WEB_V2.EXE
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight lg:text-5xl">
              Retro Web Style Guide
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--retro-web-secondary-label)]">
              초기 웹과 데스크톱 패널의 질서를 가져오되, 파스텔 톤과 낮은 대비로
              라이트/다크 모드에 자연스럽게 녹아드는 디자인 시스템 문서입니다.
            </p>
          </div>
          <div className="border border-[var(--retro-web-separator)] bg-[var(--retro-web-fill)] px-4 py-3 font-mono text-sm text-[var(--retro-web-secondary-label)] shadow-[var(--retro-web-shadow)]">
            /style-guide/retro-web
          </div>
          <ThemeToggle />
        </div>
        <div className="border-t border-[var(--retro-web-line-soft)] bg-[var(--retro-web-fill)]">
          <div className="mx-auto max-w-7xl">
            <StyleGuideNavigation />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-10 px-6 py-10 lg:px-8">
        {children}
      </div>
    </main>
  );
}
