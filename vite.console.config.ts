import { cpSync, mkdirSync, renameSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import siteConfig from './vite.config'

export default defineConfig({
  ...siteConfig,
  base: '/',
  publicDir: process.env.ADA_CLOUD_LOCAL_TESTS === '1' ? 'public' : false,
  define: { 'import.meta.env.VITE_CLOUD_API_URL': JSON.stringify(''), 'import.meta.env.VITE_OPERATOR_CONSOLE': 'true' },
  build: { outDir: 'dist-console', rollupOptions: { input: resolve('console.html') } },
  plugins: [{ name: 'console-entry', configureServer(server) { server.middlewares.use((req, _res, next) => { if (req.method === 'GET' && req.headers.accept?.includes('text/html') && !req.url?.startsWith('/v1/')) { const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''; req.url = '/console.html' + query }; next() }) } }, { name: 'console-assets', closeBundle() {
    const out = resolve('dist-console'); mkdirSync(resolve(out, 'images'), { recursive: true })
    for (const path of ['fonts', 'images/auth', 'images/ae_logo.svg', 'images/ae_logo~dark.svg']) cpSync(resolve('public', path), resolve(out, path), { recursive: true })
    renameSync(resolve(out, 'console.html'), resolve(out, 'index.html'))
  } }],
})
