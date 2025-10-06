/**
 * Server-side locale detection utility
 * Detects locale from cookies or Accept-Language header
 */

import type { H3Event } from 'h3'

const SUPPORTED_LOCALES = ['en', 'ar', 'fr', 'ckb'] as const
const DEFAULT_LOCALE = 'en'
const LOCALE_COOKIE_NAME = 'ui_lang'

type SupportedLocale = typeof SUPPORTED_LOCALES[number]

/**
 * Detects the user's preferred locale from cookies or headers
 */
export function detectLocale(event: H3Event): string {
  // attempt to get locale from cookie (highest priority)
  const cookieLocale = getCookie(event, LOCALE_COOKIE_NAME)
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as SupportedLocale)) {
    return cookieLocale
  }

  // fallback to Accept-Language header
  const acceptLanguage = getHeader(event, 'accept-language')
  if (acceptLanguage) {
    const preferredLocales = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase())
      .map(lang => lang.split('-')[0]) // Convert en-US to en
    
    for (const locale of preferredLocales) {
      if (SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
        return locale
      }
    }
  }

  return DEFAULT_LOCALE
}

/**
 * Generates a locale-aware path
 * Returns /path for default locale (en), /locale/path for others
 */
export function getLocalizedPath(path: string, locale: string): string {
  // empty path or just slash
  if (!path || path === '/') {
    return locale === DEFAULT_LOCALE ? '/' : `/${locale}/`
  }
  
  // remove leading '/'
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  if (locale === DEFAULT_LOCALE) {
    return `/${cleanPath}`
  }
  
  return `/${locale}/${cleanPath}`
}
