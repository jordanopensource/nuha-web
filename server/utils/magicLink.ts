// Utility functions for the magic link login method
import jwt from 'jsonwebtoken'

interface MagicLinkToken {
  email: string
  token: string
  expiresAt: Date
}

interface MagicLinkPayload {
  email: string
  exp: number
  iat: number
}

// In-memory store for tokens — WIP
// TODO!!!!!!! use Redis or database
const tokenStore = new Map<string, MagicLinkToken>()

export function generateMagicLinkToken(email: string): { token: string; expiresAt: Date } {
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
  tokenStore.set(token, { email, token, expiresAt })

  return { token, expiresAt }
}

export function verifyMagicLinkToken(token: string): { email: string } | null {
  const config = useRuntimeConfig()
  const secret = config.session.password
  
  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Session password not configured'
    })
  }

  try {
    // Check if token exists in store
    const storedToken = tokenStore.get(token)
    if (!storedToken) {
      return null
    }

    // Verify JWT
    const payload = jwt.verify(token, secret) as MagicLinkPayload
    
    // Remove token from store (single use)
    tokenStore.delete(token)
    
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
      console.log(`Magic link for ${email}: ${magicLink}`)
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

    console.log(`Magic link email sent successfully to ${email}`)

  } catch (error) {
    console.error('Failed to send magic link email:', error)
    console.log(`Magic link for ${email}: ${magicLink}`)
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
