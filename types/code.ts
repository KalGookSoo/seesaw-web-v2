import type { BaseEntity } from '@/types/common';

export type CodeResponse = Readonly<{
  id: string;
  createdBy?: string | null;
  createdIp?: string | null;
  createdDate?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedIp?: string | null;
  lastModifiedDate?: string | null;
  parentId?: string | null;
  parent?: CodeResponse | null;
  children?: CodeResponse[];
  name?: string | null;
  description?: string | null;
  sequence?: number | null;
  root?: boolean | null;
  baseModel?: BaseEntity | null;
}>;
