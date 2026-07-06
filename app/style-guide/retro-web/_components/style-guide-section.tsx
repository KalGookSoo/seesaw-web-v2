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
        <p className="w-fit border border-[var(--retro-web-separator)] bg-[var(--retro-web-accent-soft)] px-3 py-1 font-mono text-sm font-bold text-[var(--retro-web-blue)] shadow-[var(--retro-web-shadow-soft)]">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--retro-web-label)]">
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
    <div className="border border-[var(--retro-web-separator)] bg-[var(--retro-web-surface)] p-1 shadow-[var(--retro-web-shadow)]">
      <h3 className="border border-[var(--retro-web-line-soft)] bg-[var(--retro-web-fill)] px-4 py-2 font-mono text-sm font-bold text-[var(--retro-web-label)]">
        {title}
      </h3>
      <div className="p-4">{children}</div>
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
    <div className="border border-[var(--retro-web-separator)] bg-[var(--retro-web-surface)] p-1 shadow-[var(--retro-web-shadow)]">
      <div className="border border-[var(--retro-web-line-soft)] bg-[var(--retro-web-fill)] px-4 py-2 font-mono text-sm font-bold text-[var(--retro-web-label)]">
        README.TXT
      </div>
      <div className="p-5">
        <h1 className="text-3xl font-semibold text-[var(--retro-web-label)]">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--retro-web-secondary-label)]">
          {children}
        </p>
      </div>
    </div>
  );
}
