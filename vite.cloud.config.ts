import { defineConfig } from 'vite'
import siteConfig from './vite.config'
// The development server serves the same assembled artifact as hosted Cloud.
export default defineConfig({ root: 'dist-cloud', publicDir: false, server: siteConfig.server })
