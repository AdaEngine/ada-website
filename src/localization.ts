import russian from './locales/ru.json' with { type: 'json' }

export type Locale = 'en' | 'ru'
export const localeStorageKey = 'ada-site-language'
export const locales: Locale[] = ['en', 'ru']
let currentLocale: Locale = 'en'

export function localeFromPath(path: string): Locale {
  return /^\/ru(?:\/|$)/.test(path) ? 'ru' : 'en'
}

export function withoutLocale(path: string): string {
  return path.replace(/^\/ru(?=\/|$)/, '') || '/'
}

export function localizedPath(path: string, locale: Locale): string {
  const plain = withoutLocale(path)
  return locale === 'en' ? plain : `/ru${plain === '/' ? '' : plain}`
}

export function preferredLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const code = language.toLowerCase().split(/[-_]/)[0]
    if (code === 'ru' || code === 'en') return code
  }
  return 'en'
}

export function initialLocale(path: string, saved: string | null, languages: readonly string[]): Locale {
  if (localeFromPath(path) === 'ru') return 'ru'
  if (saved === 'en' || saved === 'ru') return saved
  return preferredLocale(languages)
}

export function getLocale(): Locale { return currentLocale }
export function setLocale(locale: Locale) { currentLocale = locale }

// English source copy doubles as the message key and fallback for new content.
export function t(message: string, locale: Locale = currentLocale): string {
  return locale === 'ru' ? (russian as Record<string, string>)[message] ?? message : message
}

export function readSavedLocale(): string | null {
  try { return window.localStorage.getItem(localeStorageKey) } catch { return null }
}

export function saveLocale(locale: Locale): boolean {
  try { window.localStorage.setItem(localeStorageKey, locale); return true } catch { return false }
}
