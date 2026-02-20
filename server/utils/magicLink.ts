import jwt from 'jsonwebtoken'
import Redis from 'ioredis'

interface MagicLinkPayload {
  email: string
  exp: number
  iat: number
}

import { getRedisClient, getRedisKey } from '~/server/utils/redis'

// fallback in-memory storage for magic link tokens
const magicLinkTokens = new Map<string, { email: string; expires: Date }>()

// initialize redis client
function initRedis(): Redis | null {
  return getRedisClient()
}

// Store token with expiration
async function storeToken(
  token: string,
  email: string,
  expires: Date
): Promise<void> {
  const redis = initRedis()

  if (redis) {
    try {
      const expirationSeconds = Math.floor(
        (expires.getTime() - Date.now()) / 1000
      )

      const key = getRedisKey(`magic_link:${token}`)

      await redis.setex(
        key,
        expirationSeconds,
        JSON.stringify({ email, expires: expires.toISOString() })
      )
      return
    } catch (error) {
      console.warn('Redis store failed, falling back to in-memory:', error)
    }
  }

  // Fallback
  magicLinkTokens.set(token, { email, expires })
}

// Retrieve and remove token
async function retrieveAndRemoveToken(
  token: string
): Promise<{ email: string; expires: Date } | null> {
  const redis = initRedis()

  if (redis) {
    try {
      const key = getRedisKey(`magic_link:${token}`)

      const data = await redis.get(key)
      if (data) {
        await redis.del(key) // remove after retrieval
        const parsed = JSON.parse(data)
        return { email: parsed.email, expires: new Date(parsed.expires) }
      }
      return null
    } catch (error) {
      console.warn('Redis retrieve failed, falling back to in-memory:', error)
    }
  }

  // Fallback
  const tokenData = magicLinkTokens.get(token)
  if (tokenData) {
    magicLinkTokens.delete(token)
    return tokenData
  }
  return null
}

// Cleanup expired in-memory tokens every 60
setInterval(
  () => {
    const now = new Date()
    for (const [token, data] of magicLinkTokens.entries()) {
      if (data.expires < now) {
        magicLinkTokens.delete(token)
      }
    }
  },
  60 * 60 * 1000
)

export async function generateMagicLinkToken(email: string): Promise<string> {
  const config = useRuntimeConfig()
  const secret = config.session.password

  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Session password not configured',
    })
  }

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  const token = jwt.sign(
    { email, exp: Math.floor(expiresAt.getTime() / 1000) },
    secret,
    { algorithm: 'HS256' }
  )

  // Store token temporarily
  await storeToken(token, email, expiresAt)

  return token
}

export async function verifyMagicLinkToken(
  token: string
): Promise<{ email: string } | null> {
  const config = useRuntimeConfig()
  const secret = config.session.password

  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Session password not configured',
    })
  }

  try {
    // check if token is stored
    const storedToken = await retrieveAndRemoveToken(token)
    if (!storedToken) {
      return null
    }

    // check if token expired
    if (storedToken.expires < new Date()) {
      return null
    }

    // verify JWT
    const payload = jwt.verify(token, secret) as MagicLinkPayload

    return { email: payload.email }
  } catch (error) {
    console.error('Magic link verification error:', error)
    return null
  }
}

enum ListmonkEndpoint {
  // reference https://listmonk.app/docs/apis/transactional/
  SEND_TRANSACTIONAL_EMAIL = 'tx',
  SUBSCRIBE_EMAIL = 'subscribers',
}

export async function sendMagicLinkEmail(
  email: string,
  magicLink: string,
  locale: string = 'en'
): Promise<void> {
  const config = useRuntimeConfig()

  if (!config.listmonk.url || !config.listmonk.user || !config.listmonk.token) {
    console.error('Listmonk configuration missing!')
    return
  }

  // Get template ID based on locale
  const templateId = getTemplateIdByLocale(locale, config.listmonk)

  if (!templateId) {
    console.warn(
      `No template ID configured for locale ${locale}, logging magic link instead`
    )
    return
  }

  try {
    // subscribe the email to the list first
    await makeListmonkRequest(
      ListmonkEndpoint.SUBSCRIBE_EMAIL,
      config.listmonk,
      JSON.stringify({
        email,
        name: email.substring(0, email.indexOf('@')),
        status: 'enabled',
        lists: [config.listId].map(parseInt),
      })
    )
  } catch (error: any) {
    let errorMessage = ''
    if (typeof error?.response?.data?.message === 'string') {
      errorMessage = error.response.data.message
    } else if (typeof error?.message === 'string') {
      errorMessage = error.message
    }

    const isExpectedError = errorMessage?.toLowerCase().includes('conflict')

    if (!isExpectedError) {
      console.error('Failed to subscribe email:', error)
    }
  }

  try {
    // send the magic link
    await makeListmonkRequest(
      ListmonkEndpoint.SEND_TRANSACTIONAL_EMAIL,
      config.listmonk,
      JSON.stringify({
        subscriber_email: email,
        template_id: parseInt(templateId),
        data: {
          link: magicLink,
        },
        content_type: 'html',
      })
    )
  } catch (error) {
    console.error('Failed to send magic link email:', error)
  }
}

interface ListmonkConfig {
  url: string
  user: string
  token: string
  listId: string
  enTemplateId: string
  arTemplateId: string
  frTemplateId: string
  ckbTemplateId: string
}

function getTemplateIdByLocale(
  locale: string,
  config: ListmonkConfig
): string | null {
  switch (locale) {
    case 'en':
      return config.enTemplateId
    case 'ar':
      return config.arTemplateId
    case 'fr':
      return config.frTemplateId
    case 'ckb':
      return config.ckbTemplateId
    default:
      return config.enTemplateId // fallback to English
  }
}

async function makeListmonkRequest(
  path: ListmonkEndpoint,
  config: ListmonkConfig,
  body: BodyInit
): Promise<Response> {
  const response = await fetch(`${config.url}/api/${path}`, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `token ${config.user}:${config.token}`,
    }),
    body,
  })

  if (!response.ok) {
    throw new Error(`Listmonk API error: ${response.statusText}`)
  }

  return response
}
