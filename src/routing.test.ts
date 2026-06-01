import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { markdownToHtml } from './content.ts'
import { hrefFor, normalizeBasePath, normalizeRoutePath, resolveRoute } from './routing.ts'
import { absoluteSiteUrl, createRouteSeo, siteOrigin } from './seo.ts'

const analyticsScript = '<script defer src="https://metrics.adaengine.org/script.js" data-website-id="560e03b9-085c-4df4-b9e8-2beb7e76b575"></script>'

assert.equal(normalizeBasePath('/adawebsite/'), '/adawebsite')
assert.equal(normalizeBasePath('/'), '')
assert.equal(normalizeBasePath('.'), '')
assert.equal(normalizeBasePath('adawebsite'), '/adawebsite')

assert.equal(normalizeRoutePath('/', '/'), '/')
assert.equal(normalizeRoutePath('/blog', '/'), '/blog')
assert.equal(normalizeRoutePath('/adawebsite/', '/adawebsite/'), '/')
assert.equal(normalizeRoutePath('/adawebsite/articles/release-notes', '/adawebsite/'), '/articles/release-notes')
assert.equal(normalizeRoutePath('/articles/release-notes/', '/'), '/articles/release-notes')
assert.equal(normalizeRoutePath('articles/release-notes', '/'), '/articles/release-notes')
assert.equal(normalizeRoutePath('/adawebsite-other/articles/release-notes', '/adawebsite/'), '/adawebsite-other/articles/release-notes')

assert.equal(hrefFor('/', '/'), '/')
assert.equal(hrefFor('/blog', '/'), '/blog')
assert.equal(hrefFor('/', '/adawebsite/'), '/adawebsite/')
assert.equal(hrefFor('/articles/release-notes', '/adawebsite/'), '/adawebsite/articles/release-notes')
assert.equal(hrefFor('articles/release-notes', '/'), '/articles/release-notes')

assert.deepEqual(resolveRoute('/', '/'), { name: 'home' })
assert.deepEqual(resolveRoute('/blog', '/'), { name: 'blog' })
assert.deepEqual(resolveRoute('/demos', '/'), { name: 'demos' })
assert.deepEqual(resolveRoute('/demos/sprite-example', '/'), { name: 'demo', slug: 'sprite-example' })
assert.deepEqual(resolveRoute('/adawebsite/', '/adawebsite/'), { name: 'home' })
assert.deepEqual(resolveRoute('/adawebsite/blog', '/adawebsite/'), { name: 'blog' })
assert.deepEqual(resolveRoute('/adawebsite/demos', '/adawebsite/'), { name: 'demos' })
assert.deepEqual(resolveRoute('/adawebsite/demos/sprite-example', '/adawebsite/'), { name: 'demo', slug: 'sprite-example' })
assert.deepEqual(resolveRoute('/adawebsite/learn', '/adawebsite/'), { name: 'static-page', page: 'learn' })
assert.deepEqual(resolveRoute('/adawebsite/community', '/adawebsite/'), { name: 'static-page', page: 'community' })
assert.deepEqual(resolveRoute('/adawebsite/donate', '/adawebsite/'), { name: 'static-page', page: 'donate' })
assert.deepEqual(resolveRoute('/adawebsite/articles/release-notes', '/adawebsite/'), {
  name: 'article',
  slug: 'release-notes',
})
assert.deepEqual(resolveRoute('/adawebsite/missing', '/adawebsite/'), { name: 'not-found', path: '/missing' })

assert.equal(siteOrigin, 'https://adaengine.org')
assert.equal(absoluteSiteUrl('/learn'), 'https://adaengine.org/learn')
assert.deepEqual(createRouteSeo({ name: 'home' }), {
  title: 'AdaEngine - Open-Source Swift Game Engine',
  description: 'AdaEngine is an open-source game engine for Swift developers, with ECS, 2D and 3D rendering, physics, UI, editor tooling, and WebAssembly demos.',
  path: '/',
  image: 'https://adaengine.org/images/main/tilemap.png',
  type: 'website',
})
assert.deepEqual(createRouteSeo({ name: 'static-page', page: 'learn' }), {
  title: 'Learn AdaEngine - Swift Game Engine Tutorials and Examples',
  description: 'Learn AdaEngine with Swift game development guides, ECS fundamentals, rendering notes, physics examples, and links to source code.',
  path: '/learn',
  image: 'https://adaengine.org/images/main/tilemap.png',
  type: 'website',
})

const renderedArticle = markdownToHtml(`
## What is AdaEngine?

### Entity Component System

### Entity Component System
`)
assert.match(renderedArticle.html, /<h2 id="what-is-adaengine">What is AdaEngine\?<\/h2>/)
assert.match(renderedArticle.html, /<h3 id="entity-component-system">Entity Component System<\/h3>/)
assert.match(renderedArticle.html, /<h3 id="entity-component-system-2">Entity Component System<\/h3>/)
assert.deepEqual(renderedArticle.toc, [
  { id: 'what-is-adaengine', title: 'What is AdaEngine?', level: 2 },
  { id: 'entity-component-system', title: 'Entity Component System', level: 3 },
  { id: 'entity-component-system-2', title: 'Entity Component System', level: 3 },
])

const renderedInlineMarkdown = markdownToHtml(
  'For more control, use [`EmptyWindow`](https://adaengine.org/adaengine-docs/documentation/adaapp/emptywindow) and [`disable(_:)`](https://adaengine.org/adaengine-docs/documentation/adaengine/defaultplugins/disable(_:)).',
)
assert.match(
  renderedInlineMarkdown.html,
  /use <a href="https:\/\/adaengine\.org\/adaengine-docs\/documentation\/adaapp\/emptywindow" target="_blank" rel="noreferrer"><code>EmptyWindow<\/code><\/a>/,
)
assert.match(
  renderedInlineMarkdown.html,
  /<a href="https:\/\/adaengine\.org\/adaengine-docs\/documentation\/adaengine\/defaultplugins\/disable\(_:\)" target="_blank" rel="noreferrer"><code>disable\(_:\)<\/code><\/a>/,
)
assert.doesNotMatch(renderedInlineMarkdown.html, /&lt;code&gt;/)

const robots = readFileSync('public/robots.txt', 'utf8')
assert.match(robots, /User-agent: \*/)
assert.match(robots, /Sitemap: https:\/\/adaengine\.org\/sitemap\.xml/)

const sitemap = readFileSync('public/sitemap.xml', 'utf8')
assert.match(sitemap, /<loc>https:\/\/adaengine\.org\/<\/loc>/)
assert.match(sitemap, /<loc>https:\/\/adaengine\.org\/learn<\/loc>/)
assert.match(sitemap, /<loc>https:\/\/adaengine\.org\/demos\/sprite-example<\/loc>/)

const llms = readFileSync('public/llms.txt', 'utf8')
assert.match(llms, /^# AdaEngine/m)
assert.match(llms, /open-source Swift game engine/i)
assert.match(llms, /https:\/\/github\.com\/AdaEngine\/AdaEngine/)

const releaseArticleSource = readFileSync('src/content/articles/introducing-adaengine-0-1-0.md', 'utf8')
assert.match(releaseArticleSource, /author: "SpectralDragon"/)

const mainSource = readFileSync('src/main.ts', 'utf8')
assert.doesNotMatch(mainSource, /AdaEngine Team/)
assert.match(mainSource, /class="article-author-link"/)
assert.match(mainSource, /rel="author noreferrer"/)
assert.match(mainSource, /https:\/\/docs\.adaengine\.org\//)
assert.match(mainSource, /https:\/\/docs\.adaengine\.org\/tutorials\/adaengine/)
assert.match(mainSource, /https:\/\/docs\.adaengine\.org\/documentation\/adaecs\//)
assert.match(mainSource, /https:\/\/docs\.adaengine\.org\/documentation\/adaphysics\//)
assert.match(mainSource, /https:\/\/docs\.adaengine\.org\/documentation\/adaengine\//)
assert.match(mainSource, /https:\/\/docs\.adaengine\.org\/documentation\/adarender\//)
assert.match(mainSource, /https:\/\/docs\.adaengine\.org\/documentation\/adaaudio\//)
assert.match(mainSource, /class="feature-modal-close demo-player-fullscreen"/)
assert.doesNotMatch(mainSource, /data-modal-close>×<\/button>/)

const stylesheet = readFileSync('src/style.css', 'utf8')
assert.match(stylesheet, /\.feature-modal-close \{[\s\S]*?top: -29px/)
assert.match(stylesheet, /\.feature-modal-close \{[\s\S]*?right: -29px/)
assert.match(stylesheet, /@media \(max-width: 803px\) \{[\s\S]*?\.feature-modal-close \{[\s\S]*?top: 12px/)
assert.match(stylesheet, /@media \(max-width: 803px\) \{[\s\S]*?\.feature-modal-close \{[\s\S]*?right: 12px/)
const mobileReaderSurface = stylesheet.match(/\.article-mobile-reader-nav::before \{[\s\S]*?\n\s*\}/)?.[0] ?? ''
const mobileReaderSurfaceAnimation = stylesheet.match(/@keyframes articleMobileReaderSurfaceWobble \{[\s\S]*?\n\s*\}/)?.[0] ?? ''
const mobileReaderClosingSurface = stylesheet.match(/\.article-mobile-reader-nav\.is-closing::before \{[\s\S]*?\n\s*\}/)?.[0] ?? ''
const mobileReaderNavBlocks = Array.from(stylesheet.matchAll(/\.article-mobile-reader-nav \{[\s\S]*?\n\s*\}/g), ([block]) => block)
const mobileReaderNav = mobileReaderNavBlocks.find((block) => block.includes('--reader-capsule-height')) ?? ''
const mobileReaderButton = stylesheet.match(/\.article-mobile-reader-button \{[\s\S]*?\n\s*\}/)?.[0] ?? ''
const mobileReaderProgressBlocks = Array.from(stylesheet.matchAll(/\.article-mobile-progress \{[\s\S]*?\n\s*\}/g), ([block]) => block)
const mobileReaderProgress = mobileReaderProgressBlocks.find((block) => block.includes('inset: 1px')) ?? ''
const mobileReaderProgressFillBlocks = Array.from(stylesheet.matchAll(/\.article-mobile-progress span \{[\s\S]*?\n\s*\}/g), ([block]) => block)
const mobileReaderProgressFill = mobileReaderProgressFillBlocks.find((block) => block.includes('--reader-progress-fill')) ?? ''
const mobileTocSheetBlocks = Array.from(stylesheet.matchAll(/\.article-mobile-toc-sheet \{[\s\S]*?\n\s*\}/g), ([block]) => block)
const mobileTocSheet = mobileTocSheetBlocks.find((block) => block.includes('max-height: none')) ?? ''
assert.match(stylesheet, /--reader-capsule-radius: calc\(var\(--reader-capsule-height\) \/ 2\)/)
assert.match(stylesheet, /--reader-edge-bleed: 2px/)
assert.match(stylesheet, /--reader-surface-bg:/)
assert.match(stylesheet, /--reader-progress-fill:/)
assert.match(stylesheet, /--reader-content-delay: 0?\.5s/)
assert.match(mobileReaderNav, /height: calc\(var\(--reader-capsule-height\) \+ var\(--reader-edge-bleed\)\)/)
assert.match(mobileReaderButton, /height: var\(--reader-capsule-height\)/)
assert.match(mobileReaderSurface, /background: var\(--reader-surface-bg\)/)
assert.doesNotMatch(mobileReaderSurface, /border-radius: 999px/)
assert.doesNotMatch(mobileReaderSurface, /background: rgba\(13, 22, 38/)
assert.doesNotMatch(mobileReaderSurfaceAnimation, /border-radius: 999px/)
assert.match(mobileReaderClosingSurface, /animation: none/)
assert.match(mobileReaderProgress, /background: transparent/)
assert.match(mobileReaderProgressFill, /border-radius: inherit/)
assert.match(mobileTocSheet, /transition: opacity 0?\.16s ease var\(--reader-content-delay\)/)

assert.match(readFileSync('index.html', 'utf8'), new RegExp(analyticsScript.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))

for (const demo of readdirSync('public/demos', { withFileTypes: true })) {
  if (!demo.isDirectory()) continue

  const embedPath = join('public/demos', demo.name, 'embed.html')
  try {
    assert.match(readFileSync(embedPath, 'utf8'), new RegExp(analyticsScript.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), embedPath)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') continue
    throw error
  }
}
