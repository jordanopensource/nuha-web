import type {
  Attachment,
  ProcessedPublicationBody,
  PublicationHeading,
  ResolvedCover,
} from '~/types/publication'

/** mime types for <img> element */
const RENDERABLE_IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
]

/** Strapi's generated copies in card's order (a card prefer smaller sizes) */
const PREFERRED_FORMATS = ['medium', 'small', 'large', 'thumbnail']

interface MediaFormat {
  url?: string
}

export const usePublications = () => {
  // const strapiUrl = useStrapiUrl()

  // Adds ids to headings and returns html with toc
  const processBody = (html: string | undefined): ProcessedPublicationBody => {
    if (!html) return { html: '', headings: [] }

    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const headings = doc.querySelectorAll('h1, h2, h3, h4')

    const toc: PublicationHeading[] = Array.from(headings).map((el, idx) => {
      if (!el.id) {
        // add id for each heading
        const slug = el.textContent
          ?.trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\p{L}\p{N}-]/gu, '') // match anything other than letters, numbers, and hyphens

        // HTML ids must begin with a letter and contain at least one char;
        // fall back to a unique id when the derived slug is unusable
        el.id = slug && /^\p{L}/u.test(slug) ? slug : `heading-${idx}`
      }

      return {
        id: el.id,
        text: el.textContent || '',
        level: parseInt(el.tagName.substring(1)),
      }
    })

    return { html: doc.body.innerHTML, headings: toc }
  }

  const getMediaUrl = (url?: string | null): string | null => {
    if (!url || url.includes('undefined')) {
      return null
    }

    if (url.startsWith('http')) {
      return url
    }
    return null
  }

  // for backwards compatibility
  const getPublicationCoverUrl = (coverUrl?: string | null): string | null =>
    getMediaUrl(coverUrl)

  /** an attachment can be a cover only if it is an image */
  const isUsableCoverImage = (file?: Attachment | null) =>
    !!file && RENDERABLE_IMAGE_MIMES.includes(file.mime)

  const getCoverImageUrl = (file: Attachment, url: string) => {
    const formats = (file.formats ?? {}) as Record<string, MediaFormat>
    const generated = PREFERRED_FORMATS.map((name) => formats[name]?.url).find(
      Boolean
    )

    return (generated && getMediaUrl(generated)) || url
  }

  /** first attachment that passes validation */
  const findCoverAttachment = (attachments?: Attachment[] | null) => {
    if (!attachments?.length) return null

    for (const file of attachments) {
      const url = getMediaUrl(file?.url)
      if (url && isUsableCoverImage(file)) return { file, url }
    }

    return null
  }

  /**
   * Resolves the image shown on a publication card, in priority order:
   *   1. the cover set explicitly in the CMS
   *   2. the first attachment that is a usable image
   *   3. null, and the card falls back to its placeholder
   */
  const resolveCover = (
    coverUrl?: string | null,
    attachments?: Attachment[] | null
  ): ResolvedCover | null => {
    const cmsCover = getMediaUrl(coverUrl)
    if (cmsCover) return { url: cmsCover, source: 'cms' }

    const candidate = findCoverAttachment(attachments)
    if (!candidate) return null

    return {
      url: getCoverImageUrl(candidate.file, candidate.url),
      source: 'attachment',
    }
  }

  return {
    processBody,
    getMediaUrl,
    getPublicationCoverUrl,
    resolveCover,
    findCoverAttachment,
    isUsableCoverImage,
  }
}
