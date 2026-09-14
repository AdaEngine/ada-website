import type { Article } from './content'
import type { DemoEntry } from './demos'
import type { Route, StaticPageName } from './routing'

export type SeoMetadata = {
  title: string
  description: string
  path: string
  image: string
  type: 'website' | 'article'
  robots?: string
}

export const siteOrigin = 'https://adaengine.org'
export const siteName = 'Ada'
export const defaultSeoImage = `${siteOrigin}/images/main/tilemap.png`

const staticPageSeo: Record<StaticPageName, SeoMetadata> = {
  learn: {
    title: 'Learn Ada - Swift Game Engine Tutorials and Examples',
    description:
      'Learn Ada with Swift game development guides, ECS fundamentals, rendering notes, physics examples, and links to source code.',
    path: '/learn',
    image: defaultSeoImage,
    type: 'website',
  },
  community: {
    title: 'Ada Community - Swift Game Development Contributors',
    description:
      'Join the Ada community, follow development, discuss Swift game engine ideas, and contribute to the open-source project.',
    path: '/community',
    image: defaultSeoImage,
    type: 'website',
  },
  donate: {
    title: 'Support Ada - Open-Source Swift Game Engine',
    description:
      'Support Ada development through donations, code contributions, examples, bug reports, and documentation improvements.',
    path: '/donate',
    image: defaultSeoImage,
    type: 'website',
  },
}

export function absoluteSiteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${siteOrigin}${normalizedPath === '/' ? '/' : normalizedPath.replace(/\/$/, '')}`
}

export function createRouteSeo(route: Route): SeoMetadata {
  if (route.name === 'home') {
    return {
      title: 'Ada - Open-Source Swift Game Engine',
      description:
        'Ada is an open-source game engine for Swift developers, with ECS, 2D and 3D rendering, physics, UI, editor tooling, and WebAssembly demos.',
      path: '/',
      image: defaultSeoImage,
      type: 'website',
    }
  }

  if (route.name === 'download') {
    return { title: 'Download Ada — Mac, Windows, Linux and iOS', description: 'Download Ada for your platform. Find desktop releases, source code and the iOS app on the App Store.', path: '/download', image: defaultSeoImage, type: 'website' }
  }

  if (route.name === 'blog') {
    return {
      title: 'Ada News - Swift Game Engine Updates',
      description:
        'Read Ada updates, release notes, engineering deep dives, and Swift game development articles from the project team.',
      path: '/blog',
      image: defaultSeoImage,
      type: 'website',
    }
  }

  if (route.name === 'demos') {
    return {
      title: 'Ada Demos - Swift WebAssembly Game Examples',
      description:
        'Explore Ada WebAssembly demos built from Swift source files, including 2D rendering, UI, physics, and scene examples.',
      path: '/demos',
      image: defaultSeoImage,
      type: 'website',
    }
  }

  if (route.name === 'static-page') {
    return staticPageSeo[route.page]
  }

  if (route.name === 'demo') {
    return {
      title: 'Ada Demo - Swift WebAssembly Example',
      description: 'This Ada demo page lists a Swift WebAssembly example when the demo is available.',
      path: `/demos/${route.slug}`,
      image: defaultSeoImage,
      type: 'website',
      robots: 'noindex, follow',
    }
  }

  if (route.name === 'article') {
    return {
      title: 'Ada Article',
      description: 'This Ada article page is available when the requested article has been published.',
      path: `/articles/${route.slug}`,
      image: defaultSeoImage,
      type: 'article',
      robots: 'noindex, follow',
    }
  }

  return {
    title: 'Page Not Found - Ada',
    description: 'This Ada page could not be found. Return to the open-source Swift game engine homepage.',
    path: route.name === 'not-found' ? route.path : '/',
    image: defaultSeoImage,
    type: 'website',
    robots: 'noindex, follow',
  }
}

export function createArticleSeo(article: Article): SeoMetadata {
  return {
    title: `${article.title} - Ada News`,
    description: article.description,
    path: `/articles/${article.slug}`,
    image: absoluteSiteUrl(article.image ?? 'images/main/tilemap.png'),
    type: 'article',
  }
}

export function createDemoSeo(demo: DemoEntry): SeoMetadata {
  return {
    title: `${demo.title} - Ada WebAssembly Demo`,
    description: `${demo.description} View the Swift source and run the WebAssembly build for this Ada demo.`,
    path: `/demos/${demo.slug}`,
    image: defaultSeoImage,
    type: 'website',
  }
}

export function createStructuredData(meta: SeoMetadata): Array<Record<string, unknown>> {
  const url = absoluteSiteUrl(meta.path)

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteOrigin,
    description:
      'Ada is an open-source Swift game engine for 2D and 3D games, ECS architecture, rendering, physics, UI, and demos.',
  }

  if (meta.path === '/') {
    return [
      website,
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: siteName,
        codeRepository: 'https://github.com/AdaEngine/AdaEngine',
        programmingLanguage: 'Swift',
        license: 'https://github.com/AdaEngine/AdaEngine/blob/main/LICENSE',
        url,
        description: meta.description,
      },
    ]
  }

  if (meta.type === 'article') {
    return [
      website,
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: meta.title,
        description: meta.description,
        image: meta.image,
        mainEntityOfPage: url,
        publisher: {
          '@type': 'Organization',
          name: siteName,
          url: siteOrigin,
        },
      },
    ]
  }

  return [
    website,
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: meta.title,
      description: meta.description,
      url,
      isPartOf: {
        '@type': 'WebSite',
        name: siteName,
        url: siteOrigin,
      },
    },
  ]
}
