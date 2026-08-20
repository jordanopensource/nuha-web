import type {
  PublicationCategory as Category,
  PublicationRegion as Region,
  PublicationAuthor as Author,
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

export type { Category, Region, Author }
