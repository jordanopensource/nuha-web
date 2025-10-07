import jwt from 'jsonwebtoken'
import Redis from 'ioredis'

interface MagicLinkPayload {
  email: string
  exp: number
  iat: number
}

let redisClient: Redis | null = null
let redisInitialized = false

// fallback in-memory storage for magic link tokens
const magicLinkTokens = new Map<string, { email: string; expires: Date }>()

// initialize Redis client
function initRedis(): Redis | null {
  if (redisInitialized) {
    return redisClient
  }

  try {
    const config = useRuntimeConfig()

    if (!config.redis.host) {
      console.warn('Redis not configured, using in-memory token storage.')
      return null
    }

    redisClient = new Redis({
      host: config.redis.host,
      port: parseInt(config.redis.port || '6379'),
      password: config.redis.password || undefined,
      db: parseInt(config.redis.db || '0'),
      maxRetriesPerRequest: 3,
      lazyConnect: true
    })

    // Test connection
    redisClient.ping()
      .then(() => {
        console.info('Redis connection successful.')
      })
      .catch((error) => {
        console.warn('Redis connection failed, falling back to in-memory storage:', error.message)
        redisClient?.disconnect()
        redisClient = null
      })

    redisInitialized = true
    return redisClient
  } catch (error) {
    console.warn('Redis connection failed, falling back to in-memory storage:', error)
    redisClient = null
    return null
  }
}

// Store token with expiration
async function storeToken(token: string, email: string, expires: Date): Promise<void> {
  const redis = initRedis()
  
  if (redis) {
    try {
      const config = useRuntimeConfig()
      const keyPrefix = config.redis.keyPrefix || 'nuha_auth:'
      const key = `${keyPrefix}magic_link:${token}`
      const expirationSeconds = Math.floor((expires.getTime() - Date.now()) / 1000)

      await redis.setex(key, expirationSeconds, JSON.stringify({ email, expires: expires.toISOString() }))
      return
    } catch (error) {
      console.warn('Redis store failed, falling back to in-memory:', error)
    }
  }
  
  // Fallback
  magicLinkTokens.set(token, { email, expires })
}

// Retrieve and remove token
async function retrieveAndRemoveToken(token: string): Promise<{ email: string; expires: Date } | null> {
  const redis = initRedis()
  
  if (redis) {
    try {
      const config = useRuntimeConfig()
      const keyPrefix = config.redis.keyPrefix || 'nuha_auth:'
      const key = `${keyPrefix}magic_link:${token}`
      
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
setInterval(() => {
  const now = new Date()
  for (const [token, data] of magicLinkTokens.entries()) {
    if (data.expires < now) {
      magicLinkTokens.delete(token)
    }
  }
}, 60 * 60 * 1000)

export async function generateMagicLinkToken(email: string): Promise<string> {
  const config = useRuntimeConfig()
  const secret = config.session.password
  
  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Session password not configured'
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

export async function verifyMagicLinkToken(token: string): Promise<{ email: string } | null> {
  const config = useRuntimeConfig()
  const secret = config.session.password
  
  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Session password not configured'
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

  try {
    // Get template ID based on locale
    const templateId = getTemplateIdByLocale(locale, config.listmonk)
    
    if (!templateId) {
      console.warn(`No template ID configured for locale ${locale}, logging magic link instead`)
      return
    }

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
  enTemplateId: string
  arTemplateId: string
  frTemplateId: string
  ckbTemplateId: string
}

function getTemplateIdByLocale(locale: string, config: ListmonkConfig): string | null {
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
