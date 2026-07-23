import type { BaseEntity } from '@/types/common';

export type AttachmentResponse = Readonly<{
  id: string;
  createdBy?: string | null;
  createdIp?: string | null;
  createdDate?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedIp?: string | null;
  lastModifiedDate?: string | null;
  referenceId?: string | null;
  originalName?: string | null;
  name?: string | null;
  pathName?: string | null;
  mimeType?: string | null;
  size?: number | null;
  previewable?: boolean | null;
  attachment?: boolean | null;
  inlineImage?: boolean | null;
  iconClass?: string | null;
  formattedSize?: string | null;
  baseModel?: BaseEntity | null;
}>;
