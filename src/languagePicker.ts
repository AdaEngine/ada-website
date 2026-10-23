import { getLocale, localizedPath, locales, saveLocale, t, type Locale } from './localization'
import { hrefFor, normalizeRoutePath } from './routing'

export function renderLanguageSwitcher(): string {
  return `<div class="footer-language">
    <label for="site-language" title="${t('Language')}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg>
    </label>
    <span class="footer-language-control">
      <select id="site-language" aria-label="${t('Language')}" data-site-language>
        ${locales.map(locale => `<option value="${locale}" lang="${locale}"${getLocale() === locale ? ' selected' : ''}>${locale === 'en' ? 'English' : 'Русский'}</option>`).join('')}
      </select>
    </span>
  </div>`
}

export function setupLanguageSwitcher(baseUrl = '/') {
  document.querySelectorAll<HTMLSelectElement>('[data-site-language]').forEach(select => {
    if (select.dataset.languageReady) return
    select.dataset.languageReady = 'true'
    select.addEventListener('change', () => {
      const locale = select.value as Locale
      if (!locales.includes(locale)) return
      const url = new URL(window.location.href)
      url.pathname = hrefFor(localizedPath(normalizeRoutePath(url.pathname, baseUrl), locale), baseUrl)
      if (saveLocale(locale)) url.searchParams.delete('lang')
      else url.searchParams.set('lang', locale)
      window.location.assign(url.href)
    })
  })
}
