import type { BaseEntity } from '@/types/common';

export type VoteResponse = Readonly<{
  id: string;
  createdBy?: string | null;
  createdIp?: string | null;
  createdDate?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedIp?: string | null;
  lastModifiedDate?: string | null;
  referenceId?: string | null;
  approved?: boolean | null;
  baseModel?: BaseEntity | null;
}>;
