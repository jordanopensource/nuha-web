import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const url = getRequestURL(event)

  if (
    event.method === 'HEAD' &&
    url.pathname.startsWith('/api/auth/callback/email')
  ) {
    setResponseStatus(event, 200)
    return {}
  }

  if (!session && url.pathname.startsWith('/api/upload')) {
    setResponseStatus(event, 401)
    return { authenticated: false }
  }
})
