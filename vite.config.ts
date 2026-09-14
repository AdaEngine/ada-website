import { defineConfig, type ProxyOptions } from 'vite'

function cloudProxy(port: number): ProxyOptions {
  return {
    target: `http://127.0.0.1:${port}`,
    configure(proxy) {
      proxy.prependListener('error', (_error, _request, response) => {
        if ('writeHead' in response && !response.headersSent && !response.writableEnded) {
          response.writeHead(503, { 'Content-Type': 'application/json', 'Retry-After': '10' })
          response.end(JSON.stringify({ error: { code: '503', message: 'Cloud is temporarily unavailable. Please try again.' } }))
        }
      })
    },
  }
}

const base = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
  base,
  server: process.env.ADA_CLOUD_LOCAL_TESTS === '1' ? {
    proxy: {
      '/v1/auth': cloudProxy(18081),
      '^/v1/me(?:/|$)': cloudProxy(18081),
      '/v1/legal': cloudProxy(18081),
      '/v1/availability': cloudProxy(18081),
      '/v1/settings': cloudProxy(18082),
      '/v1/billing': cloudProxy(18083),
      '/v1/uploads': cloudProxy(18084),
      '/v1/publications': cloudProxy(18084),
      '/v1/catalog': cloudProxy(18085),
      '/v1/pages': cloudProxy(18085),
      '/v1/media': cloudProxy(18085),
      '/v1/admin': cloudProxy(18085),
    },
  } : undefined,
})
