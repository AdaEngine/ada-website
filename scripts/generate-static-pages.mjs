import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

// Serve the download entry point with HTTP 200 on GitHub Pages, including direct links.
const output = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
mkdirSync(join(output, 'download'), { recursive: true })
copyFileSync(join(output, 'index.html'), join(output, 'download', 'index.html'))

// Studio also needs a real entry point and preview metadata for shared links.
mkdirSync(join(output, 'studio'), { recursive: true })
const studioTitle = 'Ada Studio - Game Creation on Desktop, iPad and Mobile'
const studioDescription = 'Meet Ada Studio. Build scenes, write Swift and AdaScript, and work with an AI agent on desktop and iPad. Bring your game ideas to life on mobile.'
const studioHtml = readFileSync(join(output, 'index.html'), 'utf8')
  .replace(/<title>.*?<\/title>/, `<title>${studioTitle}</title>`)
  .replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*/g, `$1${studioDescription}`)
  .replace(/(<meta property="og:title" content=")[^"]*/, `$1${studioTitle}`)
  .replace(/(<meta property="og:url" content=")[^"]*/, '$1https://adaengine.org/studio')
  .replace(/(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*/g, '$1https://adaengine.org/images/studio/desktop.png')
  .replace(/(<meta (?:property="og:image:alt"|name="twitter:image:alt") content=")[^"]*/g, `$1${studioTitle}`)
  .replace(/(<link rel="canonical" href=")[^"]*/, '$1https://adaengine.org/studio')
writeFileSync(join(output, 'studio', 'index.html'), studioHtml)

// The Cloud proxy serves dynamic asset links with the SPA entry point.
mkdirSync(join(output, 'store'), { recursive: true })
copyFileSync(join(output, 'index.html'), join(output, 'store', 'index.html'))

// Published articles need direct URLs and link previews before JavaScript runs.
// Load the same content parser and renderer used by the client.
const server = await createServer({
  root: dirname(output),
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  appType: 'custom',
})
try {
  const { articles } = await server.ssrLoadModule('/src/content.ts')
  const { createArticleSeo } = await server.ssrLoadModule('/src/seo.ts')
  const shell = readFileSync(join(output, 'index.html'), 'utf8')
  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  for (const article of articles) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
      throw new Error(`Invalid article slug: ${article.slug}`)
    }
    const meta = createArticleSeo(article)
    const url = `https://adaengine.org${meta.path}`
    const title = escapeHtml(meta.title)
    const description = escapeHtml(meta.description)
    const image = escapeHtml(meta.image)
    const body = `<main class="page-shell article-page-shell"><div class="container article-reading-layout"><article class="safe-area-insets article-page"><header class="article-hero"><a class="article-back-link" href="/blog">Back to News</a><h1>${escapeHtml(article.title)}</h1><div class="article_info">By ${escapeHtml(article.author.name)} · <time datetime="${escapeHtml(article.date)}">${escapeHtml(article.date)}</time> · ${article.readingTime} min read</div><p class="article-item-description">${description}</p></header><div class="article-content">${article.html}</div></article></div></main>`
    const html = shell
      .replace(/<title>.*?<\/title>/, () => `<title>${title}</title>`)
      .replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*/g, (_, prefix) => `${prefix}${description}`)
      .replace(/(<meta property="og:title" content=")[^"]*/, (_, prefix) => `${prefix}${title}`)
      .replace(/(<meta property="og:type" content=")[^"]*/, '$1article')
      .replace(/(<meta property="og:url" content=")[^"]*/, (_, prefix) => `${prefix}${url}`)
      .replace(/(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*/g, (_, prefix) => `${prefix}${image}`)
      .replace(/(<meta (?:property="og:image:alt"|name="twitter:image:alt") content=")[^"]*/g, (_, prefix) => `${prefix}${escapeHtml(article.title)}`)
      .replace(/(<link rel="canonical" href=")[^"]*/, (_, prefix) => `${prefix}${url}`)
      .replace('<div id="app"></div>', () => `<div id="app">${body}</div>`)
    const directory = join(output, 'articles', article.slug)
    mkdirSync(directory, { recursive: true })
    writeFileSync(join(directory, 'index.html'), html)
  }
} finally {
  await server.close()
}
