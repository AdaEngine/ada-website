import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Serve the download entry point with HTTP 200 on GitHub Pages, including direct links.
const output = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
mkdirSync(join(output, 'download'), { recursive: true })
copyFileSync(join(output, 'index.html'), join(output, 'download', 'index.html'))
