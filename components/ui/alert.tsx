import type { ReactNode } from 'react';

const alertVariants = {
  info: 'border-default-blue/20 bg-default-blue/10 text-default-label',
  success: 'border-default-green/25 bg-default-green/10 text-default-label',
  warning: 'border-default-orange/25 bg-default-orange/10 text-default-label',
  danger: 'border-default-red/25 bg-default-red/10 text-default-label',
  neutral: 'border-default-separator bg-default-surface text-default-label'
} as const;

export type AlertVariant = keyof typeof alertVariants;

export function Alert({
  children,
  title,
  variant = 'info'
}: Readonly<{
  children: ReactNode;
  title?: string;
  variant?: AlertVariant;
}>) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm shadow-sm ${alertVariants[variant]}`} role="alert">
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={title ? 'text-default-secondary-label mt-1 leading-6' : 'leading-6'}>{children}</div>
    </div>
  );
}
