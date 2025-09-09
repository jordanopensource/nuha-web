export const usePublications = () => {
  const addHeadingIds = (html: string | undefined) => {
    if (!html) return 
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const headings = doc.querySelectorAll("h1, h2, h3, h4")

    headings.forEach((el, idx) => {
      if (!el.id) {
        // add id for each heading
        const slug = el.textContent
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "") || `heading-${idx}`

        el.id = slug
      }
    })

    return doc.body.innerHTML
}
  return {
    addHeadingIds
  }
}
