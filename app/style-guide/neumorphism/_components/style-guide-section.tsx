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
      <div>
        <p className="w-fit rounded-full bg-[var(--neumorphism-surface)] px-4 py-2 text-sm font-semibold text-[var(--neumorphism-blue)] shadow-[var(--neumorphism-shadow-soft)]">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-[var(--neumorphism-label)]">
          {title}
        </h2>
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
    <div className="rounded-3xl border border-[var(--neumorphism-separator)] bg-[var(--neumorphism-surface)] p-5 shadow-[var(--neumorphism-shadow)]">
      <h3 className="mb-4 rounded-2xl bg-[var(--neumorphism-fill)] px-4 py-3 text-lg font-semibold text-[var(--neumorphism-label)] shadow-[var(--neumorphism-shadow-inset)]">
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
    <div className="rounded-3xl border border-[var(--neumorphism-separator)] bg-[var(--neumorphism-surface)] p-6 shadow-[var(--neumorphism-shadow)]">
      <h1 className="text-3xl font-semibold text-[var(--neumorphism-label)]">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--neumorphism-secondary-label)]">
        {children}
      </p>
    </div>
  );
}
