import type { BaseEntity } from '@/types/common';

export type RoleResponse = Readonly<{
  id: string;
  createdBy?: string | null;
  createdIp?: string | null;
  createdDate?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedIp?: string | null;
  lastModifiedDate?: string | null;
  name?: string | null;
  alias?: string | null;
  baseModel?: BaseEntity | null;
}>;
