import type { ProcessedPublicationBody, PublicationHeading } from '~/types/publication'

export const usePublications = () => {
  // const strapiUrl = useStrapiUrl()

  // Adds ids to headings and returns html with table of contents
  const processBody = (
    html: string | undefined
  ): ProcessedPublicationBody => {
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

  const getPublicationCoverUrl = (coverUrl?: string | null): string | null => {
    if (!coverUrl || coverUrl.includes('undefined')) {
      return null
    }

    if (coverUrl.startsWith('http')) {
      return coverUrl
    }
    return null

    // Remove /api suffix from strapiUrl for media files
    // const baseUrl = strapiUrl.replace('/api', '')

    // return `${baseUrl}${coverUrl.startsWith('/') ? '' : '/'}${coverUrl}`
  }
  return {
    processBody,
    getPublicationCoverUrl,
  }
}
