import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

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
