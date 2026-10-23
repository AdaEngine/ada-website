import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import siteConfig from './vite.config'

// Account/catalog frontend for the existing Cloud host, built with the same
// site theme as Store. The Studio Playground build remains independent.
export default defineConfig({
  ...siteConfig,
  base: '/',
  publicDir: false,
  define: { 'import.meta.env.VITE_CLOUD_API_URL': JSON.stringify(''), 'import.meta.env.VITE_CLOUD_STANDALONE_SITE': 'true' },
  build: { outDir: 'dist-cloud-site' },
  plugins: [{
    name: 'cloud-site-static-assets',
    closeBundle() {
      const out = resolve('dist-cloud-site')
      mkdirSync(resolve(out, 'images'), { recursive: true })
      for (const path of ['fonts', 'images/auth', 'images/ae_logo.svg', 'images/ae_logo~dark.svg']) {
        if (path === 'fonts' && !existsSync(resolve('public', path))) continue
        cpSync(resolve('public', path), resolve(out, path), { recursive: true })
      }
    },
  }],
})
