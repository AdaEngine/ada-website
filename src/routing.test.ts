import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { hrefFor, normalizeBasePath, normalizeRoutePath, resolveRoute } from './routing.ts'

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
