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
        <p className="text-default-blue text-xs font-semibold uppercase">{eyebrow}</p>
        <h2 className="text-default-label mt-1 text-2xl font-semibold">{title}</h2>
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
    <div className="border-default-separator bg-default-surface rounded-lg border p-5 shadow-sm">
      <h3 className="text-default-label text-base font-semibold">{title}</h3>
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
      <h1 className="text-default-label text-3xl font-semibold">{title}</h1>
      <p className="text-default-secondary-label max-w-3xl text-base leading-7">{children}</p>
    </div>
  );
}
