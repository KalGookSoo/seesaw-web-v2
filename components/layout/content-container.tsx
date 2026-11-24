import type { ReactNode } from 'react';

type ContentContainerProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function ContentContainer({ children, className = '' }: ContentContainerProps) {
  return (
    <div className={`mx-auto w-full min-w-0 max-w-[1200px] px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
