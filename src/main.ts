import './style.css'
import { highlightCode, languageClass, renderHighlightedCodeLines } from './codeHighlight'
import { articles, getArticleBySlug } from './content'
import { findDemoBySlug, groupDemosByTag, loadDemoSource, loadDemosManifest, type DemoEntry, type DemosManifest } from './demos'
import { hrefFor as createHref, resolveRoute, type StaticPageName } from './routing'

const app = document.querySelector<HTMLDivElement>('#app') ?? failMissingApp()
const baseUrl = import.meta.env.BASE_URL

function failMissingApp(): never {
  throw new Error('Root app container #app was not found')
}

type FeatureItem = {
  title: string
  description: string
  details: string
  code?: string
  image?: string
}

type ShowcaseItem = {
  title: string
  eyebrow: string
  description: string
  action: string
  href: string
  image: string
}

const siteTitle = 'AdaEngine'
const fallbackArticleImage = 'images/main/tilemap.png'
const blogArticleImages = ['images/main/tilemap.png', 'images/main/space_invaders.jpeg', 'images/main/duck_hunt.png']
const githubRepository = 'AdaEngine/AdaEngine'

const showcaseItems: ShowcaseItem[] = [
  {
    title: 'AdaEditor',
    eyebrow: 'Editor',
    description: 'A native scene editor and Swift-first workspace for building AdaEngine projects.',
    action: 'Open AdaEditor',
    href: 'https://github.com/AdaEngine/AdaEngine/tree/main/Editor',
    image: 'images/main/ada-editor.png',
  },
  {
    title: 'Sloppy Client',
    eyebrow: 'Client',
    description: 'A focused desktop client for project-oriented AI agent sessions and day-to-day work.',
    action: 'Open Sloppy Client',
    href: 'https://github.com/TeamSloppy/Sloppy/tree/main/Apps/Client',
    image: 'images/main/sloppy-client.png',
  },
]

type StaticPageContent = {
  title: string
  lead: string
  sections: Array<{
    title: string
    body: string
    links?: Array<{ label: string; href: string }>
  }>
}

type LearnCard = {
  title: string
  body: string
  href: string
  icon?: 'book' | 'play' | 'layout'
}

type CommunityLink = {
  title: string
  subtitle: string
  href: string
  icon?: string
  iconMarkup?: string
  iconClass?: string
}

type DonationOption = {
  title: string
  subtitle: string
  body: string
  href: string
  action: string
  icon: string
  tone: 'boosty' | 'donation-alerts'
}

const staticPages: Record<StaticPageName, StaticPageContent> = {
  learn: {
    title: 'Learn AdaEngine',
    lead: 'Master game development in Swift. From your first sprite to advanced Metal rendering techniques.',
    sections: [
      {
        title: 'Documentation',
        body: 'Read guides, API notes and examples for the engine core, ECS, renderer, physics and UI systems.',
        links: [{ label: 'Open documentation', href: 'https://github.com/AdaEngine/AdaEngine' }],
      },
      {
        title: 'Examples',
        body: 'Explore sample projects such as tilemaps, arcade games and Swift-first game prototypes.',
        links: [{ label: 'Browse examples', href: 'https://github.com/AdaEngine/AdaEngine/tree/main/Examples' }],
      },
      {
        title: 'Features',
        body: 'Return to the home page feature overview for a quick summary of what AdaEngine can do.',
        links: [{ label: 'View features', href: `${hrefFor('/')}#features` }],
      },
    ],
  },
  community: {
    title: 'Community',
    lead: 'Join AdaEngine discussions, follow development and help the project grow together with other Swift developers.',
    sections: [
      {
        title: 'GitHub Discussions',
        body: 'Ask questions, share ideas and discuss engine development directly with the community.',
        links: [{ label: 'Join discussions', href: 'https://github.com/AdaEngine/AdaEngine/discussions' }],
      },
      {
        title: 'Source Code',
        body: 'Report issues, contribute fixes and review the current engine implementation on GitHub.',
        links: [{ label: 'Open repository', href: 'https://github.com/AdaEngine/AdaEngine' }],
      },
    ],
  },
  donate: {
    title: 'Donate',
    lead: 'AdaEngine is free and open source forever. Donations help support ongoing development, examples and documentation.',
    sections: [
      {
        title: 'Support the project',
        body: 'If AdaEngine is useful to you, consider supporting development through the donation page.',
        links: [{ label: 'Donate on Boosty', href: 'https://boosty.to/adaengine' }],
      },
      {
        title: 'Contribute instead',
        body: 'Code contributions, bug reports, examples and documentation improvements are also a great way to help.',
        links: [{ label: 'Contribute on GitHub', href: 'https://github.com/AdaEngine/AdaEngine' }],
      },
    ],
  },
}

const learnSections: Array<{ title: string; cards: LearnCard[] }> = [
  {
    title: 'Getting Started',
    cards: [
      {
        title: 'Quick Start Guide',
        body: 'Install the engine and create your first window in under 5 minutes.',
        href: 'https://github.com/AdaEngine/AdaEngine',
        icon: 'book',
      },
      {
        title: 'ECS Fundamentals',
        body: 'Understand the Entity-Component-System architecture that powers AdaEngine.',
        href: 'https://github.com/AdaEngine/AdaEngine',
        icon: 'play',
      },
      {
        title: '2D Physics Tutorial',
        body: 'Add rigid bodies, collision shapes, and handle physics callbacks.',
        href: 'https://github.com/AdaEngine/AdaEngine',
        icon: 'layout',
      },
    ],
  },
  {
    title: 'API Reference & Documentation',
    cards: [
      {
        title: 'Core Framework',
        body: 'Math, Collections, and basic Engine systems.',
        href: 'https://github.com/AdaEngine/AdaEngine',
      },
      {
        title: 'Rendering Pipeline',
        body: 'Materials, Shaders, Render Graphs, and Metal integration.',
        href: 'https://github.com/AdaEngine/AdaEngine',
      },
      {
        title: 'Audio System',
        body: 'Spatial audio, sound effects, and music streaming.',
        href: 'https://github.com/AdaEngine/AdaEngine',
      },
    ],
  },
]

const communityLinks: CommunityLink[] = [
  {
    title: 'GitHub',
    subtitle: 'Contribute to source code',
    href: 'https://github.com/AdaEngine/AdaEngine',
    icon: 'images/socials/github.svg',
  },
  {
    title: 'Discord',
    subtitle: 'Live chat & support',
    href: 'https://discord.gg/adaengine',
    icon: 'images/socials/discord.svg',
  },
  {
    title: 'Reddit',
    subtitle: 'r/AdaEngine discussions',
    href: 'https://www.reddit.com/r/AdaEngine/',
    icon: 'images/socials/reddit.svg',
  },
  {
    title: 'Telegram',
    subtitle: 'Announcements channel',
    href: 'https://t.me/adaengine',
    iconClass: 'community-link-icon-telegram',
    iconMarkup:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M42.2 8.7 35.8 39c-.5 2.1-1.8 2.6-3.6 1.6l-9.9-7.3-4.8 4.6c-.5.5-1 .9-2 .9l.7-10.1L34.6 12c.8-.7-.2-1.1-1.2-.4L10.6 25.9.8 22.8c-2.1-.7-2.2-2.1.4-3.1L39.5 4.9c1.8-.7 3.4.4 2.7 3.8Z"/></svg>',
  },
  {
    title: 'X (Twitter)',
    subtitle: 'Follow @AdaEngine',
    href: 'https://x.com/AdaEngine',
    iconClass: 'community-link-icon-x',
    iconMarkup:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M28.4 20.6 43.1 4h-3.5L26.9 18.4 16.7 4H5l15.5 21.9L5 43.4h3.5L22 28.1l10.8 15.3h11.7L28.4 20.6Zm-4.8 5.4-1.6-2.2L9.6 6.5H15l10 14 1.6 2.2 13 18.2h-5.4L23.6 26Z"/></svg>',
  },
]

const donationOptions: DonationOption[] = [
  {
    title: 'Boosty',
    subtitle: 'Monthly Sponsorship',
    body: 'Become a backer on Boosty to get early access to updates, exclusive tutorials, and your name in the engine credits.',
    href: 'https://boosty.to/adaengine',
    action: 'Support on Boosty',
    icon: 'images/icons/ic_boosty.svg',
    tone: 'boosty',
  },
  {
    title: 'DonationAlerts',
    subtitle: 'One-time Donation',
    body: 'Prefer to make a one-time contribution? You can support us via DonationAlerts with various payment methods.',
    href: 'https://www.donationalerts.com/r/adaengine',
    action: 'Donate via DA',
    icon: 'images/donation_alerts_logo.svg',
    tone: 'donation-alerts',
  },
]

const features: FeatureItem[] = [
  {
    title: 'Data Driven',
    description: 'AdaEngine build around custom Entity Component System. Simple to use, fast and cache-friendly for your game architecture.',
    details:
      'AdaEngine is built around a custom, data-oriented Entity Component System inspired by modern Swift APIs. Components keep game state small and explicit, while systems operate through typed queries, resources, schedules and macros such as @Component and @System. This makes gameplay code modular, cache-friendly and easier to scale from a tiny prototype to a full scene with input, animation, physics and rendering working together.',
    code: `@Component\nstruct Player: Entity { }\n\nstruct PlayerSystem: System {\n    func update(context: UpdateSceneContext) { }\n}`,
  },
  {
    title: '2D Renderer',
    description:
      'Supports real-time 2D rendering for your games and apps. Write custom shaders, materials and render pipelines.',
    details:
      'AdaEngine ships with a high-level 2D rendering stack for sprites, text, tilemaps, cameras and custom materials. The demos cover sprite animation, transparency, lighting, text rendering, WGSL experiments and stress scenes, while the renderer still leaves room for lower-level control when you need custom shaders or pipeline work. It is designed for Swift-first game code where drawing a scene should feel direct, but not boxed in.',
    image: 'images/icons/ic_duck.png',
  },
  {
    title: '2D Physics',
    description: 'AdaEngine supports Box2D v3 physics with parallel calculations, lightweight memory usage and fast simulation.',
    details:
      'The Physics2D plugin integrates Box2D with AdaEngine entities through components such as PhysicsBody2DComponent and Collision2DComponent. Simulation runs on the fixed-update schedule, then syncs transforms back into the scene so gameplay systems can react through the same ECS flow as the rest of the engine. It includes collision events, debug drawing support and world resources for direct access when a game needs deeper physics control.',
    image: 'images/icons/ic_box2d.svg',
  },
  {
    title: 'Render Graphs',
    description: 'Construct your own render pipeline using powerful render graphs.',
    details:
      'Rendering is organized around RenderGraph resources, nodes, slots, subgraphs and an executor that runs the graph each frame. Core 2D and 3D pipelines are assembled as graphs, and cameras can point at specific render subgraphs for flexible composition. Diagnostics can snapshot nodes, edges, subgraphs and frame records, which makes custom pipelines easier to reason about when you add post-processing, offscreen passes or specialized rendering stages.',
    image: 'images/icons/ic_render_graph.svg',
  },
  {
    title: 'Custom UI Engine',
    description: 'Create your own UI using a SwiftUI-like approach that fits naturally into AdaEngine scenes.',
    details:
      'AdaUI brings a SwiftUI-like declarative layer into AdaEngine with views, result builders, environment values, layout containers, gestures, animation, text fields, scroll views and navigation primitives. UI can live naturally beside game scenes, and the engine includes tooling such as a 3D AdaUI debug view for inspecting live UI trees. The goal is to make editor panels, HUDs and in-game interfaces feel native to the same Swift codebase as your gameplay.',
    code: `struct MainView: View {\n    @Environment(\\.scene) var scene\n\n    var body: some View {\n        Text("Hello, World!")\n    }\n}`,
  },
  {
    title: 'Free and Open Source',
    description: 'AdaEngine is 100% free for you. Licensed by MIT. Learn, modify or use without royalties or runtime fees.',
    details:
      'AdaEngine is MIT licensed and developed in the open, with source, tutorials, generated API documentation, demos and build guides available from the repository. You can study the engine internals, modify them for your project, ship without royalties or runtime fees, and contribute fixes, examples or documentation back to the community. The project is still evolving, so the roadmap is visible where the code actually lives.',
    image: 'images/icons/ic_opensource.svg',
  },
]

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function featureDetails(item: FeatureItem): string {
  return item.details
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

function hrefFor(path: string): string {
  return createHref(path, baseUrl)
}

function assetFor(path: string): string {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const normalizedPath = path.replace(/^\/+/, '')
  return `${normalizedBase}${normalizedPath}`
}

function formatStarCount(count: number): string {
  if (count < 1000) return String(count)
  if (count < 1_000_000) return `${(count / 1000).toFixed(count < 10_000 ? 1 : 0)}k`
  return `${(count / 1_000_000).toFixed(1)}m`
}

async function setupGitHubStars() {
  const starBadge = document.querySelector<HTMLElement>('[data-github-stars]')
  const starCount = document.querySelector<HTMLElement>('[data-github-stars-value]')
  if (!starCount) return

  try {
    const response = await fetch(`https://api.github.com/repos/${githubRepository}`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!response.ok) return
    const repository = (await response.json()) as { stargazers_count?: number }
    if (typeof repository.stargazers_count !== 'number') return
    const formattedCount = formatStarCount(repository.stargazers_count)
    starCount.textContent = formattedCount
    starBadge?.setAttribute('aria-label', `${formattedCount} GitHub stars`)
  } catch {
    // Keep the GitHub link usable even if the public API is unavailable.
  }
}

function renderHeader(): string {
  const currentRoute = resolveRoute(window.location.pathname, import.meta.env.BASE_URL)
  const activePage = currentRoute.name === 'static-page' ? currentRoute.page : currentRoute.name === 'demo' ? 'demos' : currentRoute.name
  const navItems = [
    { label: 'Home', href: hrefFor('/'), active: activePage === 'home' },
    ...(articles.length ? [{ label: 'News', href: hrefFor('/blog'), active: activePage === 'blog' }] : []),
    { label: 'Demos', href: hrefFor('/demos'), active: activePage === 'demos' },
    { label: 'Learn', href: hrefFor('/learn'), active: activePage === 'learn' },
    { label: 'Socials', href: hrefFor('/community'), active: activePage === 'community' },
    { label: 'Donate', href: hrefFor('/donate'), active: activePage === 'donate' },
  ]
  const isLearnPage = activePage === 'learn'

  return `
    <header class="header${isLearnPage ? ' header-learn' : ''}">
      <section class="container content-restriction header-container">
        <a class="header-logo" href="${hrefFor('/')}" aria-label="AdaEngine home">
          <picture class="header-logo-picture">
            <source srcset="${assetFor('images/ae_logo~dark.svg')}" media="(prefers-color-scheme: dark)" />
            <img src="${assetFor('images/ae_logo.svg')}" alt="AdaEngine" />
          </picture>
          <h2>${siteTitle}</h2>
        </a>
        <button class="burger-container" type="button" aria-label="Open menu" aria-expanded="false">
          <span id="burger" aria-hidden="true"><span class="bar topBar"></span><span class="bar bottomBar"></span></span>
        </button>
        <nav aria-label="Main navigation">
          <ul class="navigation">
            ${navItems.map((item) => `<li class="navigation-item"><a class="navigation-item-link${item.active ? ' is-active' : ''}" href="${item.href}">${item.label}</a></li>`).join('')}
            <li class="navigation-item download-button"><a class="navigation-item-link" href="https://github.com/AdaEngine/AdaEngine/releases">Download</a></li>
          </ul>
        </nav>
      </section>
    </header>
  `
}

function renderHero(): string {
  return `
    <section class="hero-section safe-area-insets">
      <div class="hero-copy">
        <p class="hero-eyebrow">AdaEngine for Swift developers</p>
        <h1 class="ae-header-title">The Open-Source Engine for Swift Developers</h1>
        <p class="hero-subtitle">Build high-performance 2D and 3D games using modern Swift. Clean architecture, native feeling, and developer-first tooling.</p>
        <div class="hero-actions">
          <a class="header-buttons" href="#features">Get Started</a>
          <a class="header-buttons-github" href="https://github.com/${githubRepository}" aria-label="AdaEngine on GitHub">
            <span class="github-button-label">
              <svg class="github-button-icon" viewBox="0 0 438.549 438.549" aria-hidden="true" focusable="false"><path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8C295.736 15.166 259.057 5.365 219.27 5.365c-39.78 0-76.47 9.804-110.062 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.853 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.42-1.996 2.474-2.282 3.71-5.14 3.71-8.562 0-.57-.05-5.708-.144-15.417-.098-9.71-.144-18.18-.144-25.406l-6.567 1.136c-4.187.767-9.47 1.092-15.846 1-6.375-.09-12.992-.757-19.843-2-6.854-1.23-13.23-4.085-19.13-8.558-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.9-9.233-8.992-14.56-4.093-5.33-8.232-8.944-12.42-10.847l-1.998-1.43c-1.332-.952-2.568-2.1-3.71-3.43-1.143-1.33-1.998-2.663-2.57-3.997-.57-1.335-.097-2.43 1.428-3.29 1.525-.858 4.28-1.275 8.28-1.275l5.708.853c3.807.763 8.516 3.042 14.133 6.85 5.615 3.807 10.23 8.755 13.847 14.843 4.38 7.807 9.657 13.755 15.846 17.848 6.184 4.093 12.42 6.136 18.7 6.136 6.28 0 11.703-.476 16.273-1.423 4.565-.95 8.848-2.382 12.847-4.284 1.713-12.758 6.377-22.56 13.988-29.41-10.847-1.14-20.6-2.857-29.263-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.98-3.9-12.373-5.852-26.647-5.852-42.825 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.38-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.284 18.794 7.953 23.84 10.995 5.046 3.04 9.09 5.618 12.135 7.708 17.706-4.947 35.977-7.42 54.82-7.42s37.116 2.473 54.822 7.42l10.85-6.85c7.418-4.57 16.18-8.757 26.26-12.564 10.09-3.806 17.803-4.854 23.135-3.14 8.562 21.51 9.325 40.923 2.28 58.24 15.035 16.18 22.558 35.788 22.558 58.818 0 16.178-1.958 30.497-5.853 42.966-3.9 12.47-8.94 22.457-15.125 29.98-6.19 7.52-13.9 13.85-23.13 18.985-9.233 5.14-18.183 8.85-26.84 11.135-8.663 2.286-18.416 4.004-29.264 5.146 9.894 8.563 14.842 22.078 14.842 40.54v60.237c0 3.422 1.19 6.28 3.572 8.562 2.38 2.278 6.136 2.95 11.276 1.994 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.16 41.826-81.126 41.826-128.906-.01-39.77-9.818-76.454-29.414-110.05z"/></svg>
              GitHub
            </span>
            <span class="github-stars" data-github-stars aria-label="Loading GitHub stars">
              <svg class="github-star-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 2.6 2.92 5.92 6.53.95-4.72 4.6 1.11 6.5L12 17.5l-5.84 3.07 1.11-6.5-4.72-4.6 6.53-.95L12 2.6z"/></svg>
              <span data-github-stars-value>...</span>
            </span>
          </a>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <picture class="ae-logo-header"><source srcset="${assetFor('images/ae_logo~dark.svg')}" media="(prefers-color-scheme: dark)" /><img src="${assetFor('images/ae_logo.svg')}" alt="" /></picture>
        <div class="hero-orbit hero-orbit-one"></div>
        <div class="hero-orbit hero-orbit-two"></div>
      </div>
    </section>
  `
}

function renderShowcaseGallery(): string {
  return `
    <section class="showcase-gallery safe-area-insets" aria-labelledby="showcase-gallery-title">
      <h2 class="showcase-gallery-title" id="showcase-gallery-title">Showcase</h2>
      <div class="showcase-carousel" aria-roledescription="carousel" aria-label="Project screenshots">
        ${showcaseItems
          .map(
            (item, index) => `
              <article class="showcase-slide${index === 0 ? ' is-active' : ''}" aria-label="${escapeHtml(item.title)}" aria-hidden="${index === 0 ? 'false' : 'true'}">
                <div class="showcase-slide-copy">
                  <div class="showcase-carousel-dots" aria-label="Choose project">
                    ${showcaseItems.map((dotItem, dotIndex) => `<button class="showcase-carousel-dot${dotIndex === index ? ' is-active' : ''}" type="button" data-showcase-index="${dotIndex}" aria-label="Show ${escapeHtml(dotItem.title)}" aria-current="${dotIndex === index ? 'true' : 'false'}"></button>`).join('')}
                  </div>
                  <span class="showcase-slide-kicker">${escapeHtml(item.eyebrow)}</span>
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.description)}</p>
                  <a class="showcase-slide-action" href="${item.href}" target="_blank" rel="noreferrer" tabindex="${index === 0 ? '0' : '-1'}">${escapeHtml(item.action)}</a>
                </div>
                <div class="showcase-slide-media">
                  <img src="${assetFor(item.image)}" alt="${escapeHtml(item.title)} screenshot" loading="lazy" />
                </div>
              </article>
            `,
          )
          .join('')}
      </div>
    </section>
  `
}

function renderTagList(tags: string[] = []): string {
  if (!tags.length) return ''

  return `<ul class="tags">${tags.map((tag) => `<li>${tag}</li>`).join('')}</ul>`
}

function renderLatestNews(): string {
  if (!articles.length) return ''

  return `
    <section id="latest-news" class="latest-news safe-area-insets">
      <h2 class="section-title">Latest News</h2>
      <div class="home-articles-grid">
        ${articles
          .slice(0, 4)
          .map(
            (article) => `
              <article class="home-article-preview">
                <a href="${hrefFor(`/articles/${article.slug}`)}">
                  <div class="article-preview-image">
                    <img class="background_image" src="${assetFor(fallbackArticleImage)}" alt="${escapeHtml(article.title)}" />
                    <div class="background_image_overlay"></div>
                    <div class="article-preview-content">
                      <p class="article-date">${formatDate(article.date)}</p>
                      ${renderTagList(article.tags)}
                      <h3>${article.title}</h3>
                      <p>AdaEngine Team</p>
                    </div>
                  </div>
                </a>
              </article>
            `,
          )
          .join('')}
      </div>
    </section>
  `
}

function renderBlogTag(tags: string[] = []): string {
  const tag = tags[0] ?? 'News'
  const tone = ['release', 'tutorial', 'engineering', 'markdown', 'frontmatter', 'vite'].find((value) =>
    tag.toLowerCase().includes(value),
  )

  return `<span class="blog-entry-tag blog-entry-tag-${tone ?? 'default'}">${escapeHtml(tag)}</span>`
}

function blogArticleImageFor(article: { image?: string }, index: number): string {
  return article.image ?? blogArticleImages[index % blogArticleImages.length] ?? fallbackArticleImage
}

function renderBlogPage() {
  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell blog-page-shell">
      <section class="container content-restriction blog-page">
        <header class="blog-page-hero">
          <h1>Engine News</h1>
          <p>Updates, release notes, and engineering deep dives from the AdaEngine team.</p>
        </header>
        ${
          articles.length
            ? `<div class="blog-timeline">
                ${articles
                  .map(
                    (article, index) => `
                      <article class="blog-entry">
                        <aside class="blog-entry-meta" aria-label="Article metadata">
                          <time datetime="${article.date}">${formatDate(article.date)}</time>
                          ${renderBlogTag(article.tags)}
                        </aside>
                        <a class="blog-entry-card" href="${hrefFor(`/articles/${article.slug}`)}">
                          <img class="blog-entry-cover" src="${assetFor(blogArticleImageFor(article, index))}" alt="" loading="lazy" />
                          <span class="blog-entry-cover-overlay" aria-hidden="true"></span>
                          <span class="blog-entry-content">
                            <h2>${escapeHtml(article.title)}</h2>
                            <p>${escapeHtml(article.description)}</p>
                            <span class="blog-entry-action">Read full article →</span>
                          </span>
                        </a>
                      </article>
                    `,
                  )
                  .join('')}
              </div>`
            : `<div class="blog-empty">
                <h2>No articles yet</h2>
                <p>Fresh AdaEngine updates will appear here soon.</p>
              </div>`
        }
      </section>
    </main>
    ${renderFooter()}
  `
}

function renderDemosPage(manifest: DemosManifest) {
  const groups = groupDemosByTag(manifest.demos)

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell demos-page-shell">
      <section class="container content-restriction demos-page">
        <header class="demos-hero">
          <p class="eyebrow">Live WebAssembly examples</p>
          <h1>AdaEngine Demos</h1>
          <p>Explore browser builds generated from the Swift files in the AdaEngine repository. Each demo page includes the embedded build and the source that produced it.</p>
        </header>
        ${
          groups.length
            ? `<div class="demo-groups">
                ${groups
                  .map(
                    (group) => `
                      <section class="demo-group" aria-labelledby="demo-group-${escapeHtml(group.tag)}">
                        <div class="demo-group-heading">
                          <h2 id="demo-group-${escapeHtml(group.tag)}">${escapeHtml(group.title)}</h2>
                          <span>${group.demos.length} ${group.demos.length === 1 ? 'demo' : 'demos'}</span>
                        </div>
                        <div class="demo-card-grid">
                          ${group.demos.map(renderDemoCard).join('')}
                        </div>
                      </section>
                    `,
                  )
                  .join('')}
              </div>`
            : `<div class="demo-empty">
                <h2>No demos published yet</h2>
                <p>The website will show demos after the AdaEngine export workflow publishes the first manifest.</p>
              </div>`
        }
      </section>
    </main>
    ${renderFooter()}
  `
}

function renderDemoCard(demo: DemoEntry): string {
  return `
    <a class="demo-card" href="${hrefFor(`/demos/${demo.slug}`)}">
      <span class="demo-card-tag">${escapeHtml(demo.tagTitle)}</span>
      <h3>${escapeHtml(demo.title)}</h3>
      <p>${escapeHtml(demo.description)}</p>
      <span class="demo-card-meta">${escapeHtml(demo.sourcePath)}</span>
      ${demo.hasBuild ? '<span class="demo-card-action">Open demo</span>' : '<span class="demo-card-action demo-card-action-muted">Source only</span>'}
    </a>
  `
}

async function renderDemoPage(slug: string) {
  const manifest = await loadDemosManifest()
  const demo = findDemoBySlug(manifest, slug)

  if (!demo) {
    renderNotFound('Demo not found', 'Check the address or return to the demos page.')
    return
  }

  const source = await loadDemoSource(demo)
  const repositoryRef = manifest.commit ?? 'main'
  const sourceUrl = `https://github.com/${manifest.repository}/blob/${repositoryRef}/${demo.sourcePath}`

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell demo-detail-shell">
      <article class="container content-restriction demo-detail-page">
        <header class="demo-detail-hero">
          <a class="article-back-link" href="${hrefFor('/demos')}">Back to Demos</a>
          <span class="demo-card-tag">${escapeHtml(demo.tagTitle)}</span>
          <h1>${escapeHtml(demo.title)}</h1>
          <p>${escapeHtml(demo.description)}</p>
          <a class="demo-source-link" href="${sourceUrl}" target="_blank" rel="noreferrer">${escapeHtml(demo.sourcePath)}</a>
        </header>
        ${
          demo.hasBuild
            ? `<section class="demo-player" aria-label="${escapeHtml(demo.title)} embedded demo">
                <button class="demo-player-fullscreen" type="button" aria-label="Open demo fullscreen" title="Open fullscreen" data-demo-fullscreen>
                  <svg class="demo-player-fullscreen-enter-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg class="demo-player-fullscreen-exit-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <iframe title="${escapeHtml(demo.title)}" src="${assetFor(demo.embed)}" allow="fullscreen; gamepad; keyboard-map; clipboard-read; clipboard-write; webgpu"></iframe>
              </section>`
            : `<section class="demo-player demo-player-empty">
                <h2>Build artifact is not available</h2>
                <p>This demo is listed in the manifest, but the WebAssembly export was not published.</p>
              </section>`
        }
        <section class="demo-source-section" aria-labelledby="demo-source-title">
          <div class="demo-source-heading">
            <h2 id="demo-source-title">Source</h2>
            <a class="demo-source-github-link" href="${sourceUrl}" target="_blank" rel="noreferrer">
              <svg class="demo-source-github-icon" viewBox="0 0 438.549 438.549" aria-hidden="true" focusable="false"><path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8C295.736 15.166 259.057 5.365 219.27 5.365c-39.78 0-76.47 9.804-110.062 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.853 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.42-1.996 2.474-2.282 3.71-5.14 3.71-8.562 0-.57-.05-5.708-.144-15.417-.098-9.71-.144-18.18-.144-25.406l-6.567 1.136c-4.187.767-9.47 1.092-15.846 1-6.375-.09-12.992-.757-19.843-2-6.854-1.23-13.23-4.085-19.13-8.558-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.9-9.233-8.992-14.56-4.093-5.33-8.232-8.944-12.42-10.847l-1.998-1.43c-1.332-.952-2.568-2.1-3.71-3.43-1.143-1.33-1.998-2.663-2.57-3.997-.57-1.335-.097-2.43 1.428-3.29 1.525-.858 4.28-1.275 8.28-1.275l5.708.853c3.807.763 8.516 3.042 14.133 6.85 5.615 3.807 10.23 8.755 13.847 14.843 4.38 7.807 9.657 13.755 15.846 17.848 6.184 4.093 12.42 6.136 18.7 6.136 6.28 0 11.703-.476 16.273-1.423 4.565-.95 8.848-2.382 12.847-4.284 1.713-12.758 6.377-22.56 13.988-29.41-10.847-1.14-20.6-2.857-29.263-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.98-3.9-12.373-5.852-26.647-5.852-42.825 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.38-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.284 18.794 7.953 23.84 10.995 5.046 3.04 9.09 5.618 12.135 7.708 17.706-4.947 35.977-7.42 54.82-7.42s37.116 2.473 54.822 7.42l10.85-6.85c7.418-4.57 16.18-8.757 26.26-12.564 10.09-3.806 17.803-4.854 23.135-3.14 8.562 21.51 9.325 40.923 2.28 58.24 15.035 16.18 22.558 35.788 22.558 58.818 0 16.178-1.958 30.497-5.853 42.966-3.9 12.47-8.94 22.457-15.125 29.98-6.19 7.52-13.9 13.85-23.13 18.985-9.233 5.14-18.183 8.85-26.84 11.135-8.663 2.286-18.416 4.004-29.264 5.146 9.894 8.563 14.842 22.078 14.842 40.54v60.237c0 3.422 1.19 6.28 3.572 8.562 2.38 2.278 6.136 2.95 11.276 1.994 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.16 41.826-81.126 41.826-128.906-.01-39.77-9.818-76.454-29.414-110.05z"/></svg>
              <span>Open on GitHub</span>
              <svg class="demo-source-external-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
          <figure class="article-code-block demo-source-code">
            <figcaption>
              <span>${escapeHtml(demo.sourcePath)}</span>
              <span>Swift</span>
            </figcaption>
            <pre class="code-with-line-numbers"><code class="${languageClass('swift')}">${renderHighlightedCodeLines(source, 'swift')}</code></pre>
          </figure>
        </section>
      </article>
    </main>
    ${renderFooter()}
  `
}

function renderFeatures(): string {
  return `
    <section id="features" class="features-container safe-area-insets">
      <div class="section-heading">
        <p class="eyebrow">Capabilities</p>
        <h2 class="section-title">Features</h2>
      </div>
      <div class="features-grid">
        ${features
          .map(
            (item, index) => `
              <button class="engine-info-item-container feature-card feature-card-${index + 1}" type="button" data-feature-index="${index}" aria-haspopup="dialog">
                <div class="engine-info-item-text">
                  <span class="feature-number">0${index + 1}</span>
                  <h3>${item.title}</h3>
                  <p>${item.description}</p>
                </div>
                ${renderFeatureContent(item)}
                <span class="feature-card-action">Learn more</span>
              </button>
            `,
          )
          .join('')}
      </div>
    </section>
  `
}

function renderFeatureContent(item: FeatureItem): string {
  return `
    <div class="engine-info-item-content">
      ${item.image ? `<img src="${assetFor(item.image)}" alt="${item.title}" />` : `<pre><code class="swift-code ${languageClass('swift')}">${highlightCode(item.code ?? '', 'swift')}</code></pre>`}
    </div>
  `
}

function renderFeatureModal(): string {
  return `
    <div class="feature-modal" role="dialog" aria-modal="true" aria-labelledby="feature-modal-title" hidden>
      <div class="feature-modal-backdrop" data-modal-close></div>
      <section class="feature-modal-panel">
        <button class="feature-modal-close" type="button" aria-label="Close feature details" data-modal-close>×</button>
        <div class="feature-modal-visual" id="feature-modal-visual"></div>
        <p class="eyebrow" id="feature-modal-kicker">Feature</p>
        <h2 id="feature-modal-title"></h2>
        <p id="feature-modal-description"></p>
      </section>
    </div>
  `
}

function renderFooter(): string {
  return `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-columns">
          <section>
            <h3>Ada Engine</h3>
            <a href="https://github.com/AdaEngine/AdaEngine/releases">Download</a>
            <a href="https://github.com/AdaEngine/AdaEngine">Source code</a>
          </section>
          <section>
            <h3>Project</h3>
            ${articles.length ? `<a href="${hrefFor('/blog')}">Blog</a>` : ''}
            <a href="${hrefFor('/learn')}">Learn</a>
            <a href="${hrefFor('/community')}">Community</a>
          </section>
          <section>
            <h3>Foundation</h3>
            <a href="${hrefFor('/donate')}">Donate</a>
            <a href="https://github.com/AdaEngine/AdaEngine/blob/main/LICENSE">License</a>
          </section>
        </div>
        <div class="footer-bottom">
          <p>© 2021-2026 Vladislav Prusakov and contributors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `
}

function renderLearnIcon(icon?: LearnCard['icon']): string {
  if (!icon) return ''

  const paths = {
    book: '<path d="M7 5.5h8.5a2.5 2.5 0 0 1 2.5 2.5v11H9.5A2.5 2.5 0 0 0 7 21.5V5.5Z"/><path d="M7 5.5A2.5 2.5 0 0 1 9.5 3H18v16"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10.5 8.5 5 3.5-5 3.5v-7Z"/>',
    layout: '<rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="M9 5v14"/><path d="M4 10h16"/>',
  }

  return `
    <span class="learn-card-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
        ${paths[icon]}
      </svg>
    </span>
  `
}

function renderLearnPage() {
  const page = staticPages.learn

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell learn-page-shell">
      <section class="container content-restriction learn-page">
        <header class="learn-hero">
          <h1>${page.title}</h1>
          <p>${page.lead}</p>
        </header>
        ${learnSections
          .map((section) => {
            const sectionId = section.title.replace(/\W+/g, '-').toLowerCase()

            return `
              <section class="learn-section" aria-labelledby="${sectionId}">
                <h2 id="${sectionId}">${section.title}</h2>
                <div class="learn-grid">
                  ${section.cards
                    .map(
                      (card) => `
                        <a class="learn-card" href="${card.href}">
                          ${renderLearnIcon(card.icon)}
                          <h3>${card.title}</h3>
                          <p>${card.body}</p>
                        </a>
                      `,
                    )
                    .join('')}
                </div>
              </section>
            `
          })
          .join('')}
      </section>
    </main>
    ${renderFooter()}
  `
}

function renderStaticPage(pageName: StaticPageName) {
  if (pageName === 'learn') {
    renderLearnPage()
    return
  }

  if (pageName === 'community') {
    renderCommunityPage()
    return
  }

  if (pageName === 'donate') {
    renderDonationPage()
    return
  }
}

function renderDonationPage() {
  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell donation-page-shell">
      <section class="container content-restriction donation-page">
        <header class="donation-hero">
          <h1>Support AdaEngine</h1>
          <p>AdaEngine is an independent open-source project. Your support helps us dedicate more time to development and tooling.</p>
        </header>
        <div class="donation-options" aria-label="Donation options">
          ${donationOptions
            .map(
              (option) => `
                <article class="donation-card donation-card-${option.tone}">
                  <span class="donation-card-logo" aria-hidden="true">
                    <img src="${assetFor(option.icon)}" alt="" loading="lazy" />
                  </span>
                  <div class="donation-card-brand">${option.title}</div>
                  <h2>${option.subtitle}</h2>
                  <p>${option.body}</p>
                  <a class="donation-card-action" href="${option.href}" target="_blank" rel="noreferrer">${option.action}</a>
                </article>
              `,
            )
            .join('')}
        </div>
        <section class="donation-contribute" aria-labelledby="donation-contribute-title">
          <h2 id="donation-contribute-title">Code Contributions</h2>
          <p>
            Can't support financially? Code contributions are equally valuable! Check out our
            <a href="https://github.com/AdaEngine/AdaEngine/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22" target="_blank" rel="noreferrer">good first issues</a>
            on GitHub to get started.
          </p>
        </section>
      </section>
    </main>
    ${renderFooter()}
  `
}

function renderCommunityPage() {
  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell community-page-shell">
      <section class="container content-restriction community-page">
        <header class="community-hero">
          <h1>Join the Community</h1>
          <p>Connect with other developers, share your projects, and contribute to the engine.</p>
        </header>
        <div class="community-link-grid" aria-label="AdaEngine community links">
          ${communityLinks
            .map(
              (link) => `
                <a class="community-link-card" href="${link.href}" target="_blank" rel="noreferrer">
                  <span class="community-link-icon ${link.iconClass ?? ''}">
                    ${
                      link.iconMarkup ??
                      `<img src="${assetFor(link.icon ?? '')}" alt="" width="42" height="42" loading="lazy" />`
                    }
                  </span>
                  <span class="community-link-copy">
                    <strong>${link.title}</strong>
                    <span>${link.subtitle}</span>
                  </span>
                </a>
              `,
            )
            .join('')}
        </div>
      </section>
    </main>
    ${renderFooter()}
  `
}

function renderHomePage() {
  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <div class="container content-restriction">
        ${renderHero()}
        ${renderShowcaseGallery()}
        ${renderLatestNews()}
        ${renderFeatures()}
      </div>
      ${renderFeatureModal()}
    </main>
    ${renderFooter()}
  `
}

function renderArticlePage(slug: string) {
  const article = getArticleBySlug(slug)

  if (!article) {
    renderNotFound('Article not found', 'Check the address or return to the blog.')
    return
  }

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell article-page-shell">
      <article class="container content-restriction safe-area-insets article-page">
        <header class="article-hero">
          <a class="article-back-link" href="${hrefFor('/blog')}">Back to News</a>
          ${renderBlogTag(article.tags)}
          <h1>${article.title}</h1>
          <div class="article_info">
            <span>By AdaEngine Team</span>
            <span aria-hidden="true">•</span>
            <time datetime="${article.date}">${formatDate(article.date)}</time>
            <span aria-hidden="true">•</span>
            <span>${article.readingTime} min read</span>
          </div>
          <p class="article-item-description">${article.description}</p>
        </header>
        <div class="article-content">${article.html}</div>
      </article>
    </main>
    ${renderFooter()}
  `
}

function renderNotFound(title = 'Page not found', description = 'This route does not exist yet.') {
  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">
      <section class="container content-restriction safe-area-insets status-page">
        <h1>${title}</h1>
        <p>${description}</p>
        <a class="header-buttons" href="${hrefFor('/')}">Home</a>
      </section>
    </main>
    ${renderFooter()}
  `
}

async function renderRoute() {
  const route = resolveRoute(window.location.pathname, import.meta.env.BASE_URL)

  if (route.name === 'home') {
    renderHomePage()
    return
  }

  if (route.name === 'blog') {
    renderBlogPage()
    return
  }

  if (route.name === 'demos') {
    renderDemosPage(await loadDemosManifest())
    return
  }

  if (route.name === 'demo') {
    await renderDemoPage(route.slug)
    return
  }

  if (route.name === 'static-page') {
    renderStaticPage(route.page)
    return
  }

  if (route.name === 'article') {
    renderArticlePage(route.slug)
    return
  }

  renderNotFound()
}

function setupInteractions() {
  const header = document.querySelector<HTMLElement>('.header')
  const burger = document.querySelector<HTMLButtonElement>('.burger-container')
  let menuOpenTimer: number | undefined
  let menuCloseTimer: number | undefined

  const setMenuOpen = (isOpen: boolean) => {
    if (!header || !burger) return

    window.clearTimeout(menuOpenTimer)
    window.clearTimeout(menuCloseTimer)
    header.classList.toggle('menu-opened', isOpen)
    document.body.classList.toggle('menu-opened', isOpen)
    burger.setAttribute('aria-expanded', String(isOpen))
    burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu')

    if (isOpen) {
      header.classList.remove('menu-closing')
      header.classList.add('menu-opening')
      menuOpenTimer = window.setTimeout(() => {
        header.classList.remove('menu-opening')
      }, 620)
      return
    }

    header.classList.remove('menu-opening')
    header.classList.add('menu-closing')
    menuCloseTimer = window.setTimeout(() => {
      header.classList.remove('menu-closing')
    }, 760)
  }

  burger?.addEventListener('click', () => {
    setMenuOpen(!header?.classList.contains('menu-opened'))
  })

  document.querySelectorAll('.navigation-item-link').forEach((link) => {
    link.addEventListener('click', () => {
      setMenuOpen(false)
    })
  })

  const modal = document.querySelector<HTMLElement>('.feature-modal')
  const modalTitle = document.querySelector<HTMLElement>('#feature-modal-title')
  const modalDescription = document.querySelector<HTMLElement>('#feature-modal-description')
  const modalKicker = document.querySelector<HTMLElement>('#feature-modal-kicker')
  const modalVisual = document.querySelector<HTMLElement>('#feature-modal-visual')

  const closeModal = () => {
    if (!modal) return
    modal.hidden = true
    document.body.classList.remove('modal-opened')
  }

  document.querySelectorAll<HTMLElement>('[data-feature-index]').forEach((card) => {
    card.addEventListener('click', () => {
      const index = Number(card.dataset.featureIndex)
      const feature = features[index]
      if (!feature || !modal || !modalTitle || !modalDescription || !modalKicker || !modalVisual) return
      modalTitle.textContent = feature.title
      modalDescription.textContent = featureDetails(feature)
      modalKicker.textContent = `Feature 0${index + 1}`
      modalVisual.innerHTML = feature.image
        ? `<img src="${assetFor(feature.image)}" alt="${escapeHtml(feature.title)}" />`
        : `<pre><code class="swift-code ${languageClass('swift')}">${highlightCode(feature.code ?? '', 'swift')}</code></pre>`
      modal.hidden = false
      document.body.classList.add('modal-opened')
    })
  })

  document.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', closeModal))
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal()
  })

  setupShowcaseCarousel()
  setupDemoFullscreen()
  setupDemoAmbientLight()
}

function setupDemoFullscreen() {
  const player = document.querySelector<HTMLElement>('.demo-player:not(.demo-player-empty)')
  const button = player?.querySelector<HTMLButtonElement>('[data-demo-fullscreen]')
  if (!player || !button) return

  const fullscreenDocument = document as Document & {
    webkitFullscreenElement?: Element | null
    webkitFullscreenEnabled?: boolean
    webkitExitFullscreen?: () => Promise<void> | void
  }
  const fullscreenPlayer = player as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void
  }
  const canUseFullscreen =
    document.fullscreenEnabled ||
    fullscreenDocument.webkitFullscreenEnabled ||
    typeof player.requestFullscreen === 'function' ||
    typeof fullscreenPlayer.webkitRequestFullscreen === 'function'

  if (!canUseFullscreen) {
    button.hidden = true
    return
  }

  const fullscreenElement = () => document.fullscreenElement ?? fullscreenDocument.webkitFullscreenElement ?? null

  const requestPlayerFullscreen = async () => {
    if (typeof player.requestFullscreen === 'function') {
      await player.requestFullscreen()
      return
    }

    await fullscreenPlayer.webkitRequestFullscreen?.()
  }

  const exitPlayerFullscreen = async () => {
    if (typeof document.exitFullscreen === 'function') {
      await document.exitFullscreen()
      return
    }

    await fullscreenDocument.webkitExitFullscreen?.()
  }

  const updateFullscreenState = () => {
    const isFullscreen = fullscreenElement() === player
    player.classList.toggle('is-fullscreen', isFullscreen)
    button.setAttribute('aria-label', isFullscreen ? 'Exit demo fullscreen' : 'Open demo fullscreen')
    button.title = isFullscreen ? 'Exit fullscreen' : 'Open fullscreen'
  }

  button.addEventListener('click', async () => {
    try {
      if (fullscreenElement() === player) {
        await exitPlayerFullscreen()
        return
      }

      await requestPlayerFullscreen()
    } catch (error) {
      console.error('Failed to toggle demo fullscreen', error)
    }
  })

  document.addEventListener('fullscreenchange', updateFullscreenState)
  document.addEventListener('webkitfullscreenchange', updateFullscreenState)
  updateFullscreenState()
}

function setupDemoAmbientLight() {
  const player = document.querySelector<HTMLElement>('.demo-player:not(.demo-player-empty)')
  const iframe = player?.querySelector<HTMLIFrameElement>('iframe')
  if (!player || !iframe) return

  const sampler = document.createElement('canvas')
  sampler.width = 1
  sampler.height = 1
  const context = sampler.getContext('2d', { willReadFrequently: true })
  if (!context) return

  let frameHandle = 0
  let idleFrames = 0
  let ambientColor = { red: 34, green: 211, blue: 238 }

  const updateAmbientColor = (red: number, green: number, blue: number) => {
    ambientColor = {
      red: Math.round(ambientColor.red * 0.7 + red * 0.3),
      green: Math.round(ambientColor.green * 0.7 + green * 0.3),
      blue: Math.round(ambientColor.blue * 0.7 + blue * 0.3),
    }
    player.style.setProperty('--demo-ambient', `${ambientColor.red} ${ambientColor.green} ${ambientColor.blue}`)
    player.classList.add('has-ambient-light')
  }

  const handleAmbientMessage = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return

    const data = event.data
    if (!data || typeof data !== 'object' || data.type !== 'ada-demo-ambient') return
    if (!Array.isArray(data.color) || data.color.length < 3) return

    const [red, green, blue] = data.color.map(Number)
    if (![red, green, blue].every(Number.isFinite)) return

    updateAmbientColor(red, green, blue)
  }

  const sampleAmbient = () => {
    try {
      const canvas = iframe.contentDocument?.querySelector('canvas')
      if (!canvas || canvas.width <= 0 || canvas.height <= 0) {
        idleFrames += 1
        frameHandle = window.setTimeout(sampleAmbient, idleFrames < 120 ? 250 : 1000)
        return
      }

      const sampleX = Math.max(0, Math.floor(canvas.width * 0.5))
      const sampleY = Math.max(0, Math.floor(canvas.height * 0.42))
      context.clearRect(0, 0, 1, 1)
      context.drawImage(canvas, sampleX, sampleY, 1, 1, 0, 0, 1, 1)

      const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data
      if (alpha > 0 && red + green + blue > 8) {
        updateAmbientColor(red, green, blue)
      }
      idleFrames = 0
      frameHandle = window.setTimeout(sampleAmbient, 450)
    } catch {
      idleFrames += 1
      frameHandle = window.setTimeout(sampleAmbient, idleFrames < 12 ? 450 : 1200)
    }
  }

  iframe.addEventListener('load', () => {
    window.clearTimeout(frameHandle)
    idleFrames = 0
    frameHandle = window.setTimeout(sampleAmbient, 500)
  })
  window.addEventListener('message', handleAmbientMessage)
  frameHandle = window.setTimeout(sampleAmbient, 500)
}

function setupShowcaseCarousel() {
  const carousel = document.querySelector<HTMLElement>('.showcase-carousel')
  const slides = Array.from(document.querySelectorAll<HTMLElement>('.showcase-slide'))
  const dots = Array.from(document.querySelectorAll<HTMLButtonElement>('.showcase-carousel-dot'))
  if (!carousel || slides.length < 2) return

  let activeIndex = 0
  let timer: number | undefined

  const setActiveSlide = (nextIndex: number) => {
    activeIndex = (nextIndex + slides.length) % slides.length
    slides.forEach((slide, index) => {
      const isActive = index === activeIndex
      slide.classList.toggle('is-active', isActive)
      slide.setAttribute('aria-hidden', String(!isActive))
      slide.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
        link.tabIndex = isActive ? 0 : -1
      })
    })
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === activeIndex)
      dot.setAttribute('aria-current', index === activeIndex ? 'true' : 'false')
    })
  }

  const start = () => {
    window.clearInterval(timer)
    timer = window.setInterval(() => {
      setActiveSlide(activeIndex + 1)
    }, 5000)
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      setActiveSlide(index)
      start()
    })
  })

  carousel.addEventListener('mouseenter', () => window.clearInterval(timer))
  carousel.addEventListener('mouseleave', start)
  carousel.addEventListener('focusin', () => window.clearInterval(timer))
  carousel.addEventListener('focusout', start)

  setActiveSlide(0)
  start()
}

renderRoute()
  .then(() => {
    setupInteractions()
    setupGitHubStars()
  })
  .catch((error) => {
    console.error(error)
    renderNotFound('Page failed to load', 'Refresh the page or try again in a moment.')
    setupInteractions()
  })
