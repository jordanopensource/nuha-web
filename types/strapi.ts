export interface Publication {
  id: number
  documentId: string
  title: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  slug: string
  abstract: string | null
  featured: boolean
  body?: string
  cover?: PublicationCover
  category?: PublicationCategory
  regions?: PublicationRegion[]
  authors?: PublicationAuthor[]
}

export interface PublicationCover {
  url: string
  alt?: string
  id: number
  documentId: string
  name: string
  alternativeText: string | null
  caption: string | null
  width: number
  height: number
  formats: {
    thumbnail: object
    small: object
    medium: object
  }
  hash: string
  ext: string
  mime: string
  size: number
  previewUrl: string | null
  provider: string
  createdAt: Date
  updatedAt: Date
  publishedAt: Date
}

export interface PublicationCategory {
  id: number
  name: string
  documentId: number
  slug: string
  description: string | null
  locale: string
  updatedAt: Date
  publishedAt: Date
}

export interface PublicationRegion {
  id: number
  documentId: string
  code: string
  name: string
  flag_icon: string | null
  is_available: boolean | null
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
}

export interface PublicationAuthor {
  id: number
  documentId: string
  name: string
  email?: string
  bio?: string | null
  avatar?: PublicationCover
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
}

export interface AboutPage {
  id: number
  documentId: string
  title: string
  body: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
}

export interface TermsPage {
  id: number
  documentId: string
  title: string
  body: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
}

export interface PrivacyPage {
  id: number
  documentId: string
  title: string
  body: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
}
export interface MetaResponsePaginationByPage {
  page: number
  pageSize: number
  pageCount: number
  total: number
}
export interface MetaResponsePaginationByOffset {
  start: number
  limit: number
  total: number
}
export interface StrapiSystemFields {
  documentId: string
  locale?: string
}

export interface StrapiResponseSingle<T> {
  data: StrapiResponseData<T>
  meta: StrapiResponseMeta
}
export interface StrapiResponseMany<T> {
  data: StrapiResponseData<T>[]
  meta: StrapiResponseMeta
}
export interface StrapiResponseMeta {
  pagination: MetaResponsePaginationByPage | MetaResponsePaginationByOffset
  [key: string]: unknown
}

export type StrapiResponseData<T> = T extends object
  ? T extends Array<infer U>
    ? Array<StrapiResponseData<U>>
    : T extends Record<string, unknown>
      ? {
          [K in keyof T]: StrapiResponseData<T[K]>
        } & StrapiSystemFields
      : T
  : T
export interface StrapiResponseMetaPagination {
  page: number
  pageSize: number
}

export interface StrapiResponseMany<T> {
  data: StrapiResponseData<T>[]
  meta: StrapiResponseMeta
}

export interface StrapiFilters {
  [key: string]: unknown
}

export interface StrapiSort {
  [key: string]: 'asc' | 'desc'
}

export interface StrapiRequestPagination {
  page?: number
  pageSize?: number
  start?: number
  limit?: number
}
export interface StrapiParams {
  locale?: string
  populate?: string | string[] | Record<string, unknown>
  fields?: string[]
  filters?: StrapiFilters
  sort?: string[] | StrapiSort
  pagination?: StrapiRequestPagination
}
