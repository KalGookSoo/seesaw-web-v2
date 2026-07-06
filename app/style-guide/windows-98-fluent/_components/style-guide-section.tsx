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
        <p className="w-fit border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-fill)] px-3 py-1 font-mono text-sm font-bold text-[var(--windows-98-fluent-label)] shadow-[var(--windows-98-fluent-inset)]">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--windows-98-fluent-label)]">
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
    <div className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
      <h3 className="bg-[var(--windows-98-fluent-accent)] px-4 py-2 font-mono text-sm font-bold text-[var(--windows-98-fluent-accent-contrast)]">
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
    <div className="border border-[var(--windows-98-fluent-separator)] bg-[var(--windows-98-fluent-surface)] p-1 shadow-[var(--windows-98-fluent-inset)]">
      <div className="bg-[var(--windows-98-fluent-accent)] px-4 py-2 font-mono text-sm font-bold text-[var(--windows-98-fluent-accent-contrast)]">
        README.TXT - Notepad
      </div>
      <div className="p-5">
        <h1 className="text-3xl font-semibold text-[var(--windows-98-fluent-label)]">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--windows-98-fluent-secondary-label)]">
          {children}
        </p>
      </div>
    </div>
  );
}
