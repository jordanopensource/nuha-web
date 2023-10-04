import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const url = getRequestURL(event)

  if (
    event.headers.get('user-agent')?.toLowerCase().includes('oneoutlook') ||
    event.headers.get('x-native-host')?.toLowerCase().includes('oneoutlook')
  ) {
    setResponseStatus(event, 200)
    return {}
  }

  if (!session && url.pathname.startsWith('/api/upload')) {
    setResponseStatus(event, 401)
    return { authenticated: false }
  }
})
