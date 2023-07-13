import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const session = await getServerSession(event)

  if (session) {
    if (url.pathname === '/login') return sendRedirect(event, '/')
    if (url.pathname === '/ar/login') return sendRedirect(event, '/ar')
  }

  if (
    ![
      '/dashboard',
      '/ar/dashboard',
      '/dashboard/settings',
      '/ar/dashboard/settings',
      '/api/upload-file',
      '/api/upload-comment',
    ].includes(url.pathname)
  ) {
    return
  }

  if (!session) {
    return sendRedirect(event, '/login')
  }
})
