import { SearchX } from 'lucide-react';

type SearchEmptyStateProps = Readonly<{
  title: string;
  description: string;
  compact?: boolean;
}>;

export function SearchEmptyState({ title, description, compact = false }: SearchEmptyStateProps) {
  return (
    <div className={`border-default-separator bg-default-surface-grouped flex flex-col items-center justify-center border border-dashed text-center ${compact ? 'min-h-44 px-4 py-8' : 'min-h-80 px-6 py-12'}`}>
      <span className="border-default-separator bg-default-surface inline-flex size-12 items-center justify-center rounded-full border">
        <SearchX className="text-default-tertiary-label size-5" aria-hidden />
      </span>
      <p className="text-default-label mt-4 text-sm font-semibold">{title}</p>
      <p className="text-default-tertiary-label mt-2 max-w-xs text-xs leading-5">{description}</p>
    </div>
  );
}
