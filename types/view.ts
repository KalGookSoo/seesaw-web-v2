import type { BaseEntity } from '@/types/common';

export type ViewResponse = Readonly<{
  id: string;
  createdBy?: string | null;
  createdIp?: string | null;
  createdDate?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedIp?: string | null;
  lastModifiedDate?: string | null;
  articleId?: string | null;
  baseModel?: BaseEntity | null;
}>;
