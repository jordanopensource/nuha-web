export default defineEventHandler(async (event) => {
  const url = getRouterParam(event, 'url')

  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL parameter is required',
    })
  }

  // Decode the URL (it comes base64 encoded for safety)
  let avatarUrl: string
  try {
    avatarUrl = Buffer.from(url, 'base64').toString('utf-8')
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid URL encoding',
    })
  }

  // Validate that it's a Google or GitHub avatar URL for security
  const allowedDomains = [
    // Google avatar domains
    'lh3.googleusercontent.com',
    'lh4.googleusercontent.com',
    'lh5.googleusercontent.com',
    'lh6.googleusercontent.com',
    // GitHub avatar domains
    'avatars.githubusercontent.com',
    'avatars0.githubusercontent.com',
    'avatars1.githubusercontent.com',
    'avatars2.githubusercontent.com',
    'avatars3.githubusercontent.com',
  ]

  const urlObj = new URL(avatarUrl)
  if (!allowedDomains.includes(urlObj.hostname)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Only Google and GitHub avatar URLs are allowed',
    })
  }

  try {
    // Fetch the image from the avatar service
    const response = await fetch(avatarUrl)

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Failed to fetch avatar',
      })
    }

    // Get the image data and content type
    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    // Set appropriate headers
    setHeaders(event, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      'Cross-Origin-Resource-Policy': 'cross-origin',
    })

    // Return the image data
    return new Uint8Array(imageBuffer)
  } catch (error) {
    console.error('Avatar proxy error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to proxy avatar',
    })
  }
})
