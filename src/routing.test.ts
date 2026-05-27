import assert from 'node:assert/strict'
import { hrefFor, normalizeBasePath, normalizeRoutePath, resolveRoute } from './routing'

assert.equal(normalizeBasePath('/adawebsite/'), '/adawebsite')
assert.equal(normalizeBasePath('/'), '')
assert.equal(normalizeBasePath('.'), '')
assert.equal(normalizeBasePath('adawebsite'), '/adawebsite')

assert.equal(normalizeRoutePath('/adawebsite/', '/adawebsite/'), '/')
assert.equal(normalizeRoutePath('/adawebsite/articles/release-notes', '/adawebsite/'), '/articles/release-notes')
assert.equal(normalizeRoutePath('/articles/release-notes/', '/'), '/articles/release-notes')
assert.equal(normalizeRoutePath('articles/release-notes', '/'), '/articles/release-notes')
assert.equal(normalizeRoutePath('/adawebsite-other/articles/release-notes', '/adawebsite/'), '/adawebsite-other/articles/release-notes')

assert.equal(hrefFor('/', '/adawebsite/'), '/adawebsite/')
assert.equal(hrefFor('/articles/release-notes', '/adawebsite/'), '/adawebsite/articles/release-notes')
assert.equal(hrefFor('articles/release-notes', '/'), '/articles/release-notes')

assert.deepEqual(resolveRoute('/adawebsite/', '/adawebsite/'), { name: 'home' })
assert.deepEqual(resolveRoute('/adawebsite/blog', '/adawebsite/'), { name: 'blog' })
assert.deepEqual(resolveRoute('/adawebsite/learn', '/adawebsite/'), { name: 'static-page', page: 'learn' })
assert.deepEqual(resolveRoute('/adawebsite/community', '/adawebsite/'), { name: 'static-page', page: 'community' })
assert.deepEqual(resolveRoute('/adawebsite/donate', '/adawebsite/'), { name: 'static-page', page: 'donate' })
assert.deepEqual(resolveRoute('/adawebsite/articles/release-notes', '/adawebsite/'), {
  name: 'article',
  slug: 'release-notes',
})
assert.deepEqual(resolveRoute('/adawebsite/missing', '/adawebsite/'), { name: 'not-found', path: '/missing' })
