import type { StrapiLocale } from '@nuxtjs/strapi'

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
  locale: StrapiLocale
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
  locale: StrapiLocale
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
  locale: StrapiLocale
}

export interface AboutPage {
  id: number
  documentId: string
  title: string
  body: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: StrapiLocale
}

export interface TermsPage {
  id: number
  documentId: string
  title: string
  body: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: StrapiLocale
}

export interface PrivacyPage {
  id: number
  documentId: string
  title: string
  body: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: StrapiLocale
}
