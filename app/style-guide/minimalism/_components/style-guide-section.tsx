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
        <p className="text-sm font-semibold text-[var(--minimalism-blue)]">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--minimalism-label)]">
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
    <div className="rounded-lg border border-[var(--minimalism-separator)] bg-[var(--minimalism-surface)] p-5 shadow-[var(--minimalism-shadow)]">
      <h3 className="mb-4 border-b border-[var(--minimalism-separator)] pb-3 text-lg font-semibold text-[var(--minimalism-label)]">
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
    <div className="rounded-lg border border-[var(--minimalism-separator)] bg-[var(--minimalism-surface)] p-6 shadow-[var(--minimalism-shadow)]">
      <h1 className="text-3xl font-semibold text-[var(--minimalism-label)]">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--minimalism-secondary-label)]">
        {children}
      </p>
    </div>
  );
}
