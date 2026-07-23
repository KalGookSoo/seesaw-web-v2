import type { CategoryResponse } from '@/types/category';
import type { SiteResponse } from '@/types/site';

export type SiteContextModel = Readonly<{
  SITE_CONTEXT: SiteResponse;
  ALL_CATEGORIES: Readonly<Record<string, CategoryResponse>>;
  NESTED_CATEGORIES: readonly CategoryResponse[];
}>;

export type CurrentSiteContextModel = SiteContextModel &
  Readonly<{
    CURRENT_CATEGORY: CategoryResponse | null;
  }>;
