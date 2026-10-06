import { cpSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import siteConfig from './vite.config'

// Reuse the same visual components, but emit and deploy Store independently.
export default defineConfig({
  ...siteConfig,
  base: '/',
  publicDir: false,
  // Sign-in must use Store's Identity proxy and host-only session cookie.
  define: { 'import.meta.env.VITE_CLOUD_API_URL': JSON.stringify('') },
  build: { outDir: 'dist-store' },
  plugins: [{
    name: 'store-static-assets',
    closeBundle() {
      const out = resolve('dist-store')
      mkdirSync(resolve(out, 'images'), { recursive: true })
      for (const path of ['fonts', 'images/auth', 'images/ae_logo.svg', 'images/ae_logo~dark.svg']) {
        cpSync(resolve('public', path), resolve(out, path), { recursive: true })
      }
    },
  }],
})
