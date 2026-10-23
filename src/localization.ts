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
  const suffixIndex = path.search(/[?#]/)
  if (suffixIndex >= 0) return localizedPath(path.slice(0, suffixIndex) || '/', locale) + path.slice(suffixIndex)
  const plain = withoutLocale(path)
  return locale === 'en' ? plain : `/ru${plain === '/' ? '' : plain}`
}

export function message(key: string, ...values: unknown[]): string {
  return t(key).replace(/\{(\d+)\}/g, (_, index) => String(values[Number(index)] ?? ''))
}

export function localizedNavigation(path: string, locale: Locale, explicitChoice: string | null): string {
  const localized = localizedPath(path, locale)
  if (explicitChoice !== 'en' && explicitChoice !== 'ru') return localized
  const url = new URL(localized, 'https://ada.invalid')
  url.searchParams.set('lang', locale)
  return `${url.pathname}${url.search}${url.hash}`
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
