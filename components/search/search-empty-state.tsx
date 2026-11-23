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

export function SearchLoadingState() {
  return (
    <div className="border-default-separator bg-default-surface-grouped flex min-h-80 flex-col items-center justify-center border border-dashed px-6 py-12 text-center">
      <span className="border-default-label relative inline-flex size-12 items-center justify-center rounded-full border">
        <span className="border-default-tertiary-label absolute inset-1 animate-spin rounded-full border border-t-transparent" />
      </span>
      <p className="text-default-label mt-4 text-sm font-semibold">검색 중입니다</p>
      <p className="text-default-tertiary-label mt-2 text-xs">검색 가능한 콘텐츠를 확인하고 있습니다.</p>
    </div>
  );
}

export function SearchErrorState() {
  return (
    <div className="border-default-separator bg-default-surface-grouped flex min-h-80 flex-col items-center justify-center border border-dashed px-6 py-12 text-center">
      <span className="border-default-label bg-default-label text-default-background inline-flex size-12 items-center justify-center rounded-full text-lg font-semibold" aria-hidden>!</span>
      <p className="text-default-label mt-4 text-sm font-semibold">검색 결과를 불러오지 못했습니다</p>
      <p className="text-default-tertiary-label mt-2 max-w-xs text-xs leading-5">검색 서버와 연결할 수 없습니다.</p>
    </div>
  );
}
