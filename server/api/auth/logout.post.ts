export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed',
    })
  }

  try {
    if (await clearUserSession(event)) {
      return {
        success: true,
        message: 'Logged out successfully',
      }
    } else
      throw createError({
        statusCode: 500,
      })
  } catch (error) {
    console.error('Logout error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to logout',
    })
  }
})
