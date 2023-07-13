import { getServerSession } from '#auth'
import { getToken } from 'next-auth/jwt'

export default eventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    return { status: 'unauthenticated' }
  }
  const token = await getToken(event)
  return {
    status: 'authenticated',
    token: token,
    session,
  }
})
