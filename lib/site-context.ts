import type { CategoryResponse } from '@/types/category';
import type { SiteResponse } from '@/types/site';
import type { SiteContextModel } from '@/types/site-context';

function toCategoryById(
  categories: readonly CategoryResponse[]
): Readonly<Record<string, CategoryResponse>> {
  return categories.reduce<Record<string, CategoryResponse>>(
    (accumulator, category) => {
      accumulator[category.id] = category;
      return accumulator;
    },
    {}
  );
}

function toNestedCategories(
  categories: readonly CategoryResponse[]
): readonly CategoryResponse[] {
  const categoriesById = new Map(
    categories.map((category) => [
      category.id,
      { ...category, children: [] as CategoryResponse[] }
    ])
  );

  return categories.reduce<CategoryResponse[]>((roots, category) => {
    const current = categoriesById.get(category.id);
    if (!current) {
      return roots;
    }

    if (!category.parentId) {
      return [...roots, current];
    }

    const parent = categoriesById.get(category.parentId);
    if (!parent) {
      return [...roots, current];
    }

    parent.children = [...(parent.children ?? []), current];
    return roots;
  }, []);
}

export function createSiteContext(site: SiteResponse): SiteContextModel {
  const categories = site.categories ?? [];

  return {
    SITE_CONTEXT: site,
    ALL_CATEGORIES: toCategoryById(categories),
    NESTED_CATEGORIES: toNestedCategories(categories)
  };
}
