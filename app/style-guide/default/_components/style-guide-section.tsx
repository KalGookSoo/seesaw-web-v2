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
    <section className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-[var(--default-blue)] uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--default-label)]">
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
    <div className="rounded-2xl border border-[var(--default-separator)] bg-[var(--default-surface)] p-5 shadow-[var(--default-shadow-soft)]">
      <h3 className="text-base font-semibold text-[var(--default-label)]">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
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
    <div className="space-y-3">
      <h1 className="text-3xl font-semibold text-[var(--default-label)]">
        {title}
      </h1>
      <p className="max-w-3xl text-base leading-7 text-[var(--default-secondary-label)]">
        {children}
      </p>
    </div>
  );
}
