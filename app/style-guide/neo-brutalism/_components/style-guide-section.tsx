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
        <p className="w-fit border-2 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-accent)] px-3 py-1 text-sm font-black text-[var(--neo-brutalism-accent-contrast)] uppercase shadow-[var(--neo-brutalism-shadow)]">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-black text-[var(--neo-brutalism-label)] uppercase">
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
    <div className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] p-5 shadow-[var(--neo-brutalism-shadow)]">
      <h3 className="mb-4 border-b-4 border-[var(--neo-brutalism-separator)] pb-3 text-lg font-black text-[var(--neo-brutalism-label)] uppercase">
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
    <div className="border-4 border-[var(--neo-brutalism-separator)] bg-[var(--neo-brutalism-surface)] p-6 shadow-[var(--neo-brutalism-shadow)]">
      <h1 className="text-4xl font-black text-[var(--neo-brutalism-label)] uppercase">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-7 font-semibold text-[var(--neo-brutalism-secondary-label)]">
        {children}
      </p>
    </div>
  );
}
