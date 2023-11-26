export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const referer = getRequestHeader(event, 'referer')
  const homePath = `${referer?.includes('/ar') ? '/ar' : '/'}`

  if (url.pathname.includes('/findings')) {
    return sendRedirect(event, homePath, 301)
  }
})
