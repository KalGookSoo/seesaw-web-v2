import type { ReactNode } from 'react';

export function StyleGuideSection({
  children,
  eyebrow,
  title
}: Readonly<{
  children: ReactNode;
  eyebrow: string;
  title: string;
}>) {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-[var(--glassmorphism-line-soft)] bg-[var(--glassmorphism-surface-muted)] px-5 py-4 shadow-[var(--glassmorphism-shadow)] backdrop-blur-2xl">
        <p className="text-xs font-bold tracking-widest text-[var(--glassmorphism-accent)] uppercase">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--glassmorphism-ink)]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function PreviewPanel({
  children,
  title
}: Readonly<{
  children: ReactNode;
  title: string;
}>) {
  return (
    <div className="rounded-3xl border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface)] p-6 shadow-[var(--glassmorphism-shadow)] backdrop-blur-2xl">
      <h3 className="mb-4 border-b border-[var(--glassmorphism-line-soft)] pb-3 text-lg font-semibold text-[var(--glassmorphism-ink)]">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}

export function PageIntro({
  children,
  title
}: Readonly<{
  children: ReactNode;
  title: string;
}>) {
  return (
    <div className="rounded-3xl border border-[var(--glassmorphism-line)] bg-[var(--glassmorphism-surface)] p-7 shadow-[var(--glassmorphism-shadow)] backdrop-blur-2xl">
      <h1 className="text-3xl font-semibold text-[var(--glassmorphism-ink)]">{title}</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--glassmorphism-ink-soft)]">{children}</p>
    </div>
  );
}
