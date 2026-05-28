import assert from 'node:assert/strict'
import { hrefFor, normalizeBasePath, normalizeRoutePath, resolveRoute } from './routing.ts'

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
