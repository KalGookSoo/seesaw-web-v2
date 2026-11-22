import type { ReactNode } from 'react';

export function StyleGuideSection({
  children,
  eyebrow,
  title
}: Readonly<{ children: ReactNode; eyebrow: string; title: string }>) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold tracking-[0.16em] text-[var(--monochrome-accent)] uppercase">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--monochrome-label)]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function PreviewPanel({ children, title }: Readonly<{ children: ReactNode; title: string }>) {
  return (
    <div className="rounded-[var(--monochrome-radius)] border border-[var(--monochrome-separator)] bg-[var(--monochrome-surface)] p-5 shadow-[var(--monochrome-shadow)]">
      <h3 className="mb-4 border-b border-[var(--monochrome-separator)] pb-3 text-lg font-semibold text-[var(--monochrome-label)]">{title}</h3>
      {children}
    </div>
  );
}

export function PageIntro({ children, title }: Readonly<{ children: ReactNode; title: string }>) {
  return (
    <div className="rounded-[var(--monochrome-radius)] border border-[var(--monochrome-separator)] bg-[var(--monochrome-surface)] p-6 shadow-[var(--monochrome-shadow)] lg:p-8">
      <p className="text-sm font-semibold tracking-[0.16em] text-[var(--monochrome-accent)] uppercase">Seesaw design direction</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--monochrome-label)]">{title}</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--monochrome-secondary-label)]">{children}</p>
    </div>
  );
}
