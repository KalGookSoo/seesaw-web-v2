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
      <div className="border-b border-[var(--editorial-line-soft)] pb-2">
        <p className="text-xs font-bold tracking-widest text-[var(--editorial-accent)] uppercase">{eyebrow}</p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-[var(--editorial-ink)]">{title}</h2>
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
    <div className="border border-[var(--editorial-line)] bg-[var(--editorial-surface)] p-6 shadow-none">
      <h3 className="mb-4 border-b border-[var(--editorial-line-soft)] pb-2 font-serif text-lg font-bold text-[var(--editorial-ink)]">
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
    <div className="space-y-4 border-b-2 border-[var(--editorial-line)] pb-6">
      <h1 className="font-serif text-3xl font-black text-[var(--editorial-ink)]">{title}</h1>
      <p className="max-w-3xl font-serif text-base leading-7 text-[var(--editorial-ink-soft)] italic">{children}</p>
    </div>
  );
}
