export type StaticPageName = 'learn' | 'community' | 'donate'

export type Route =
  | { name: 'home' }
  | { name: 'blog' }
  | { name: 'static-page'; page: StaticPageName }
  | { name: 'article'; slug: string }
  | { name: 'not-found'; path: string }

export function normalizeBasePath(baseUrl: string): string {
  const basePath = baseUrl.trim().replace(/\/$/, '')

  if (!basePath || basePath === '.' || basePath === '/') {
    return ''
  }

  return basePath.startsWith('/') ? basePath : `/${basePath}`
}

export function normalizeRoutePath(pathname: string, baseUrl: string): string {
  const basePath = normalizeBasePath(baseUrl)
  let normalizedPath = pathname || '/'

  if (!normalizedPath.startsWith('/')) {
    normalizedPath = `/${normalizedPath}`
  }

  if (basePath && (normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`))) {
    normalizedPath = normalizedPath.slice(basePath.length) || '/'
  }

  normalizedPath = normalizedPath.replace(/\/$/, '') || '/'

  return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`
}

export function hrefFor(path: string, baseUrl: string): string {
  const basePath = normalizeBasePath(baseUrl)
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (!basePath) {
    return normalizedPath
  }

  return `${basePath}${normalizedPath === '/' ? '/' : normalizedPath}`
}

const staticPages: StaticPageName[] = ['learn', 'community', 'donate']

export function resolveRoute(pathname: string, baseUrl: string): Route {
  const path = normalizeRoutePath(pathname, baseUrl)

  if (path === '/') {
    return { name: 'home' }
  }

  if (path === '/blog') {
    return { name: 'blog' }
  }

  const staticPage = staticPages.find((page) => path === `/${page}`)

  if (staticPage) {
    return { name: 'static-page', page: staticPage }
  }

  const articleMatch = path.match(/^\/articles\/([^/]+)$/)

  if (articleMatch) {
    return { name: 'article', slug: decodeURIComponent(articleMatch[1]) }
  }

  return { name: 'not-found', path }
}
