import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

// Every public language route needs a real entry point on GitHub Pages.
const output = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const shell = readFileSync(join(output, 'index.html'), 'utf8')
const escapeHtml = value => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const server = await createServer({
  root: dirname(output),
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  appType: 'custom',
})
try {
  const { articles } = await server.ssrLoadModule('/src/content.ts')
  const { createArticleSeo, createDemoSeo, createRouteSeo, localizeSeo, absoluteSiteUrl } = await server.ssrLoadModule('/src/seo.ts')
  const { resolveRoute, legalPages } = await server.ssrLoadModule('/src/routing.ts')
  const { renderPricingContent, renderPublicLegalContent } = await server.ssrLoadModule('/src/commercial.ts')
  const { locales, localizedPath, t } = await server.ssrLoadModule('/src/localization.ts')
  const manifest = JSON.parse(readFileSync(join(output, 'demos/manifest.json'), 'utf8'))
  const basePath = (process.env.VITE_BASE_PATH ?? '/').replace(/\/$/, '')

  function writePage(meta, locale, body = '') {
    const url = absoluteSiteUrl(meta.path)
    const alternateLinks = [...locales, 'x-default'].map(language => `<link rel="alternate" hreflang="${language}" data-language-alternate href="${absoluteSiteUrl(localizedPath(meta.path, language === 'x-default' ? 'en' : language))}" />`).join('\n    ')
    const html = shell
      .replace('<html lang="en">', `<html lang="${locale}">`)
      .replace(/<title>.*?<\/title>/, () => `<title>${escapeHtml(meta.title)}</title>`)
      .replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*/g, (_, prefix) => `${prefix}${escapeHtml(meta.description)}`)
      .replace(/(<meta property="og:title" content=")[^"]*/, (_, prefix) => `${prefix}${escapeHtml(meta.title)}`)
      .replace(/(<meta property="og:type" content=")[^"]*/, (_, prefix) => `${prefix}${meta.type}`)
      .replace(/(<meta property="og:url" content=")[^"]*/, (_, prefix) => `${prefix}${url}`)
      .replace(/(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*/g, (_, prefix) => `${prefix}${escapeHtml(meta.image)}`)
      .replace(/(<meta (?:property="og:image:alt"|name="twitter:image:alt") content=")[^"]*/g, (_, prefix) => `${prefix}${escapeHtml(meta.title)}`)
      .replace(/(<link rel="canonical" href=")[^"]*/, (_, prefix) => `${prefix}${url}`)
      .replace('</head>', `    ${alternateLinks}\n    <meta property="og:locale" content="${locale === 'ru' ? 'ru_RU' : 'en_US'}" />\n  </head>`)
      .replace('<div id="app"></div>', () => `<div id="app">${body}</div>`)
    const directory = join(output, meta.path)
    mkdirSync(directory, { recursive: true })
    writeFileSync(join(directory, 'index.html'), html)
  }

  for (const locale of locales) {
    for (const path of ['/', '/download', '/studio', '/learn', '/community', '/donate', '/blog', '/demos', '/pricing', ...legalPages.map(page => `/legal/${page}`)]) {
      const route = resolveRoute(path, '/')
      const href = path => `${basePath}${localizedPath(path, locale)}`
      const body = route.name === 'pricing' ? renderPricingContent(href, locale) : route.name === 'legal' ? renderPublicLegalContent(route.page, href, locale) : ''
      writePage(localizeSeo(createRouteSeo(route), locale), locale, body)
    }
    for (const demo of manifest.demos) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(demo.slug)) throw new Error(`Invalid demo slug: ${demo.slug}`)
      writePage(createDemoSeo(demo, locale), locale)
    }
    // Editorial articles remain in their original language, with a clear notice.
    for (const article of articles) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) throw new Error(`Invalid article slug: ${article.slug}`)
      const meta = createArticleSeo(article, locale)
      const date = new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', { dateStyle: 'medium' }).format(new Date(article.date))
      const notice = locale === 'ru' ? `<p class="article-language-note">${t('This article is currently available in English.', locale)}</p>` : ''
      const body = `<main class="page-shell article-page-shell"><div class="container article-reading-layout"><article class="safe-area-insets article-page"><header class="article-hero"><a class="article-back-link" href="${basePath}${localizedPath('/blog', locale)}">${t('Back to News', locale)}</a><h1 lang="en">${escapeHtml(article.title)}</h1><div class="article_info">${locale === 'ru' ? 'Автор:' : 'By'} ${escapeHtml(article.author.name)} · <time datetime="${escapeHtml(article.date)}">${escapeHtml(date)}</time> · ${article.readingTime} ${locale === 'ru' ? 'мин чтения' : 'min read'}</div><p class="article-item-description" lang="en">${escapeHtml(meta.description)}</p></header>${notice}<div class="article-content" lang="en">${article.html}</div></article></div></main>`
      writePage(meta, locale, body)
    }
  }
  // The Cloud proxy serves dynamic asset links with the original SPA entry point.
  mkdirSync(join(output, 'store'), { recursive: true })
  writeFileSync(join(output, 'store/index.html'), shell)
} finally {
  await server.close()
}
