export const usePublications = () => {
  // const strapiUrl = useStrapiUrl()

  const addHeadingIds = (html: string | undefined) => {
    if (!html) return
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const headings = doc.querySelectorAll('h1, h2, h3, h4')

    headings.forEach((el, idx) => {
      if (!el.id) {
        // add id for each heading
        const slug =
          el.textContent
            ?.toLowerCase()
            // FIXME: text should be trimmed before replace spaces with '-'
            .replace(/\s+/g, '-')
            // FIXME: this does not work with arabic characters
            .replace(/[^\w-]/g, '') || `heading-${idx}`

        el.id = slug
      }
    })

    return doc.body.innerHTML
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
    addHeadingIds,
    getPublicationCoverUrl,
  }
}
