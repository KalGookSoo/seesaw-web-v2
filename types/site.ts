export type AddressResponse = Readonly<{
  zipcode?: string | null;
  roadAddress?: string | null;
  detailAddress?: string | null;
  extraAddress?: string | null;
}>;

export type AttachmentResponse = Readonly<{
  id: string;
  referenceId?: string | null;
  originalName?: string | null;
  name?: string | null;
  pathName?: string | null;
  mimeType?: string | null;
  size?: number | null;
}>;

export type ReplyResponse = Readonly<{
  id: string;
  articleId?: string | null;
}>;

export type ViewResponse = Readonly<{
  id: string;
  articleId?: string | null;
}>;

export type ArticleResponse = Readonly<{
  id: string;
  parentId?: string | null;
  createdBy?: string | null;
  exposed: boolean;
  fixed: boolean;
  fixedOrder?: number | null;
  title: string;
  content?: string | null;
  type?: string | null;
  categoryId: string;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  attachments?: AttachmentResponse[];
  inlineImages?: AttachmentResponse[];
  replies?: ReplyResponse[];
  views?: ViewResponse[];
  maskedAuthor?: string | null;
  plainContent?: string | null;
  url?: string | null;
}>;

export type PagedModel<T> = Readonly<{
  content: T[];
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}>;

export type VEventResponse = Readonly<{
  id: string;
  articleId?: string | null;
  article?: ArticleResponse | null;
  dtStart?: string | null;
  dtEnd?: string | null;
  title: string;
  description?: string | null;
  location?: string | null;
  status?: string | null;
  statusDescription?: string | null;
  tzid?: string | null;
  duration?: string | null;
}>;

export type CategoryResponse = Readonly<{
  id: string;
  parentId?: string | null;
  name: string;
  description?: string | null;
  type?: string | null;
  siteExposed: boolean;
  siteExposedOrder: number;
  exposed: boolean;
  sequence?: number | null;
  siteId: string;
  children?: CategoryResponse[];
  articles?: ArticleResponse[];
  recentArticles?: ArticleResponse[];
}>;

export type SiteResponse = Readonly<{
  id: string;
  parentId?: string | null;
  name: string;
  domainName: string;
  description?: string | null;
  distributionCode?: string | null;
  searchEngineExposed: boolean;
  imageExposed: boolean;
  themeColor: string;
  backgroundColor: string;
  tags?: string | null;
  address?: AddressResponse | null;
  contactNumber?: string | null;
  intro?: string | null;
  content?: string | null;
  children?: SiteResponse[];
  categories?: CategoryResponse[];
  attachments?: AttachmentResponse[];
  profileImage?: AttachmentResponse | null;
  backgroundImage?: AttachmentResponse | null;
}>;
