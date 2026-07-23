import type { ArticleResponse } from '@/types/article';
import type { BaseEntity } from '@/types/common';

export type CategoryType =
  | 'NONE'
  | 'STATIC_CONTENT'
  | 'BOARD'
  | 'QNA'
  | 'SCHEDULE'
  | 'STORE'
  | 'BUSINESS';

export type CreateCategoryRequest = Readonly<{
  name: string;
  description?: string | null;
  type: CategoryType;
  siteExposed?: boolean | null;
  siteExposedOrder?: number | null;
  exposed?: boolean | null;
  sequence: number;
  siteId: string;
  parentId?: string | null;
}>;

export type UpdateCategoryRequest = Readonly<{
  name: string;
  description?: string | null;
  type: CategoryType;
  siteExposed?: boolean | null;
  siteExposedOrder?: number | null;
  exposed?: boolean | null;
  sequence: number;
  siteId: string;
  parentId?: string | null;
}>;

export type MoveCategoryRequest = Readonly<{
  parentId?: string | null;
  sequence: number;
}>;

export type CategoryResponse = Readonly<{
  id: string;
  createdBy?: string | null;
  createdIp?: string | null;
  createdDate?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedIp?: string | null;
  lastModifiedDate?: string | null;
  parentId?: string | null;
  parent?: CategoryResponse | null;
  children?: CategoryResponse[];
  articles?: ArticleResponse[];
  name?: string | null;
  description?: string | null;
  type?: CategoryType | null;
  siteExposed?: boolean | null;
  siteExposedOrder?: number | null;
  exposed?: boolean | null;
  sequence?: number | null;
  siteId?: string | null;
  recentArticles?: ArticleResponse[];
  url?: string | null;
  root?: boolean | null;
  baseModel?: BaseEntity | null;
}>;
