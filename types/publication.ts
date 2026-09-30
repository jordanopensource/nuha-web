import type {
  PublicationCategory as Category,
  PublicationRegion as Region,
  PublicationAuthor as Author,
  PublicationAttachment as Attachment,
} from './strapi'

export interface PublicationHeading {
  id: string
  text: string
  level: number
}

export interface ProcessedPublicationBody {
  html: string
  headings: PublicationHeading[]
}

/** where a publication card ended up getting its cover image from */
export type CoverSource = 'cms' | 'attachment'

export interface ResolvedCover {
  url: string
  source: CoverSource
}

export type { Category, Region, Author, Attachment }
