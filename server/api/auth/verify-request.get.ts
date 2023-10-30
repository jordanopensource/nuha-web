export default eventHandler(async (event) => {
  const referer = getRequestHeader(event, 'referer')
  const provider = getQuery(event)['provider']
  const loginPathWithLocale = `${referer?.includes('/ar') ? '/ar' : ''}/login`
  if (provider !== 'email') {
    return sendRedirect(event, loginPathWithLocale, 301)
  }
  return sendRedirect(event, `${loginPathWithLocale}?email-login=true`, 301)
})
