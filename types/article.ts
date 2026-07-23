import type { AttachmentResponse } from '@/types/attachment';
import type { BaseEntity } from '@/types/common';
import type { ReplyResponse } from '@/types/reply';
import type { ViewResponse } from '@/types/view';
import type { VoteResponse } from '@/types/vote';

export type ArticleType =
  'MAP' | 'HTML' | 'CAROUSEL' | 'BUTTON_GROUP' | 'IMAGE' | 'TABLE' | 'VIDEO';

export type CreateArticleRequest = Readonly<{
  categoryId: string;
  type: ArticleType;
  fixed?: boolean | null;
  fixedOrder?: number | null;
  title: string;
  content: string;
  multipartFiles?: File[];
  inlineImages?: File[];
  multipartFilesSizeValid?: boolean | null;
  inlineImagesSizeValid?: boolean | null;
}>;

export type UpdateArticleRequest = Readonly<{
  categoryId: string;
  type: ArticleType;
  fixed?: boolean | null;
  fixedOrder?: number | null;
  title: string;
  content: string;
  multipartFiles?: File[];
  inlineImages?: File[];
  multipartFilesSizeValid?: boolean | null;
  inlineImagesSizeValid?: boolean | null;
}>;

export type MoveArticleRequest = Readonly<{
  categoryId: string;
}>;

export type SearchArticlesRequest = Readonly<{
  categoryId: string;
  categoryType?:
    | 'NONE'
    | 'STATIC_CONTENT'
    | 'BOARD'
    | 'QNA'
    | 'SCHEDULE'
    | 'STORE'
    | 'BUSINESS'
    | null;
  viewType?: 'TABLE' | 'CARD' | null;
  keyField?: string | null;
  keyWord?: string | null;
}>;

export type ArticleResponse = Readonly<{
  id: string;
  createdBy?: string | null;
  createdIp?: string | null;
  createdDate?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedIp?: string | null;
  lastModifiedDate?: string | null;
  parentId?: string | null;
  parent?: ArticleResponse | null;
  children?: ArticleResponse[];
  exposed?: boolean | null;
  fixed?: boolean | null;
  fixedOrder?: number | null;
  title?: string | null;
  content?: string | null;
  type?: ArticleType | null;
  categoryId?: string | null;
  attachments?: AttachmentResponse[];
  replies?: ReplyResponse[];
  views?: ViewResponse[];
  votes?: VoteResponse[];
  url?: string | null;
  inlineImages?: AttachmentResponse[];
  plainContent?: string | null;
  maskedAuthor?: string | null;
  recentlyGenerated?: boolean | null;
  root?: boolean | null;
  baseModel?: BaseEntity | null;
}>;
