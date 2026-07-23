import type { AttachmentResponse } from '@/types/attachment';
import type { BaseEntity } from '@/types/common';
import type { VoteResponse } from '@/types/vote';

export type CreateReplyRequest = Readonly<{
  exposed?: boolean | null;
  articleId: string;
  content: string;
  multipartFiles?: File[];
  multipartFilesSizeValid?: boolean | null;
}>;

export type UpdateReplyRequest = Readonly<{
  exposed?: boolean | null;
  content: string;
  multipartFiles?: File[];
  multipartFilesSizeValid?: boolean | null;
}>;

export type ReplyResponse = Readonly<{
  id: string;
  createdBy?: string | null;
  createdIp?: string | null;
  createdDate?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedIp?: string | null;
  lastModifiedDate?: string | null;
  parentId?: string | null;
  parent?: ReplyResponse | null;
  children?: ReplyResponse[];
  exposed?: boolean | null;
  content?: string | null;
  articleId?: string | null;
  attachments?: AttachmentResponse[];
  votes?: VoteResponse[];
  inlineImages?: AttachmentResponse[];
  maskedAuthor?: string | null;
  root?: boolean | null;
  baseModel?: BaseEntity | null;
}>;
