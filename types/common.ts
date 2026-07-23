export type BaseEntity = Readonly<{
  id?: string | null;
  createdBy?: string | null;
  createdIp?: string | null;
  createdDate?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedIp?: string | null;
  lastModifiedDate?: string | null;
  version?: number | null;
}>;

export type Address = Readonly<{
  zipcode?: string | null;
  value?: string | null;
}>;

export type Pageable = Readonly<{
  page?: number | null;
  size?: number | null;
  sort?: string[];
}>;

export type PageMetadata = Readonly<{
  size?: number | null;
  number?: number | null;
  totalElements?: number | null;
  totalPages?: number | null;
}>;

export type PagedModel<T> = Readonly<{
  content?: T[];
  page?: PageMetadata | null;
}>;
