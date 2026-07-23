import type { BaseEntity } from '@/types/common';

export type SavePermissionRequest = Readonly<{
  targetId?: string | null;
  roleId?: string | null;
  mask?: number | null;
}>;

export type PermissionResponse = Readonly<{
  id: string;
  createdBy?: string | null;
  createdIp?: string | null;
  createdDate?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedIp?: string | null;
  lastModifiedDate?: string | null;
  targetId?: string | null;
  roleId?: string | null;
  mask?: number | null;
  baseModel?: BaseEntity | null;
}>;
