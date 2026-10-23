import { after, test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { build } from 'vite'
import { Window } from 'happy-dom'
import { initialLocale, localizedPath, preferredLocale, localeStorageKey, localeFromPath, withoutLocale } from '../src/localization.ts'
import { hrefFor, normalizeRoutePath, resolveRoute } from '../src/routing.ts'

const output = mkdtempSync(join(tmpdir(), 'ada-localization-'))
after(() => rmSync(output, { recursive: true, force: true }))
// Keep lazy DOM mutations intact when flattening the production chunks into one test IIFE.
await build({ configFile: false, publicDir: false, logLevel: 'silent', define: { 'import.meta.env.VITE_CLOUD_STANDALONE_SITE': 'true' }, build: {
  outDir: output, rollupOptions: { treeshake: false }, lib: { entry: resolve('src/main.ts'), formats: ['iife'], name: 'AdaWebsite', fileName: () => 'site.js' },
} })
const code = readFileSync(join(output, 'site.js'), 'utf8')
const manifest = JSON.parse(readFileSync('public/demos/manifest.json', 'utf8'))
async function page(path, run, { languages = ['en-US'], saved, storageBlocked = false, hostname = 'adaengine.org', services = false, signedIn = false } = {}) {
  const w = new Window({ url: 'https://' + hostname + path })
  const redirects = [], navigations = []
  w.location.assign = url => { navigations.push(url) }
  w.location.replace = url => { redirects.push(url) }
  Object.defineProperty(w.navigator, 'languages', { value: languages })
  if (saved) w.localStorage.setItem(localeStorageKey, saved)
  if (storageBlocked) Object.defineProperty(w, 'localStorage', { get() { throw new Error('Storage blocked') } })
  w.fetch = async url => {
    if (services && String(url).startsWith('/v1/')) {
      const path = String(url).split('?')[0]
      const asset = { id: 'asset-1', title: 'Home', description: 'An author description in English', authorName: 'Creator', category: 'textures', rating: 0, reviewCount: 0, downloads: 42, cover: 'image-1', gallery: [], license: 'MIT', version: '1.0.0', bytes: 42000 }
      const data = {
        '/v1/legal': {}, '/v1/availability': { cloudServicesAvailable: false },
        '/v1/me': signedIn ? { id: 'owner', accountId: 'owner', name: 'Home' } : null,
        '/v1/store/categories': { categories: ['2d', '3d', 'textures'], licenses: ['MIT'], limits: { imageBytes: 5000000, galleryImages: 8, archiveBytes: 300000000 } },
        '/v1/store/assets': { total: 1, items: [asset] },
        '/v1/store/assets/asset-1': asset, '/v1/store/assets/asset-1/reviews': [],
        '/v1/auth/exchange': {}, '/v1/catalog': [],
      }[path]
      if (data === undefined) throw new Error('Unexpected service endpoint: ' + path)
      return Response.json(data)
    }
    if (String(url).endsWith('demos/manifest.json')) return Response.json(manifest)
    if (String(url).endsWith('.swift')) return new Response('let demo = 1')
    throw new Error('Offline fixture')
  }
  w.document.body.innerHTML = '<div id="app"></div>'
  try {
    w.eval(code)
    for (let i = 0; i < 10; i++) await new Promise(resolve => setImmediate(resolve))
    await run(w.document, w, redirects, navigations)
  } finally { await w.happyDOM.close() }
}

test('locale priority is URL, saved choice, browser languages, then English', () => {
  assert.equal(initialLocale('/ru/download', 'en', ['en-US']), 'ru')
  assert.equal(initialLocale('/download', 'en', ['ru-RU']), 'en')
  assert.equal(initialLocale('/download', 'ru', ['en-US']), 'ru')
  assert.equal(initialLocale('/download', null, ['ru-RU', 'en-US']), 'ru')
  assert.equal(initialLocale('/download', null, ['en-US', 'ru-RU']), 'en')
  assert.equal(initialLocale('/download', 'invalid', ['ja-JP']), 'en')
  assert.equal(preferredLocale(['RU_ru']), 'ru')
  assert.equal(preferredLocale([]), 'en')
})

test('prefix handling respects route boundaries, trailing slashes and preview base paths', () => {
  for (const path of ['/', '/download', '/studio', '/blog', '/learn', '/demos/sprite-example', '/articles/introducing-adaengine-1-0-0', '/community', '/donate']) {
    const ru = localizedPath(path, 'ru')
    assert.deepEqual(resolveRoute(ru, '/'), resolveRoute(path, '/'))
    assert.deepEqual(resolveRoute(hrefFor(ru, '/preview/'), '/preview/'), resolveRoute(path, '/'))
    assert.equal(localizedPath(ru, 'en'), path)
    assert.equal(localizedPath(ru, 'ru'), ru)
  }
  assert.equal(localeFromPath('/russian'), 'en')
  assert.equal(withoutLocale('/russian'), '/russian')
  assert.equal(normalizeRoutePath('/preview/ru/download/', '/preview/'), '/ru/download')
  assert.deepEqual(resolveRoute('/ru/missing', '/'), { name: 'not-found', path: '/missing' })
})

test('Russian download page localizes dynamic cards and keeps page, query and hash when switching', () => page('/ru/download?from=home#mac', (doc, w, _redirects, navigations) => {
  assert.equal(doc.documentElement.lang, 'ru')
  assert.equal(doc.querySelector('h1').textContent, 'Скачать Ada')
  assert.match(doc.querySelector('[data-download-cards]').textContent, /Скачать|Установщик скоро появится/)
  assert.equal(doc.querySelector('.navigation-item-link').getAttribute('href'), '/ru')
  assert.equal(doc.querySelector('link[rel=canonical]').href, 'https://adaengine.org/ru/download')
  const picker = doc.querySelector('[data-site-language]')
  assert.equal(picker.value, 'ru')
  picker.value = 'en'
  picker.dispatchEvent(new w.Event('change', { bubbles: true }))
  assert.deepEqual(navigations, ['https://adaengine.org/download?from=home#mac'])
  assert.equal(w.localStorage.getItem(localeStorageKey), 'en')
}))

test('saved English choice overrides a Russian system and stays unprefixed', () => page('/download', doc => {
  assert.equal(doc.documentElement.lang, 'en')
  assert.equal(doc.querySelector('h1').textContent, 'Download Ada')
  assert.equal(doc.querySelector('[data-site-language]').value, 'en')
}, { languages: ['ru-RU'], saved: 'en' }))

test('a first visit uses the system language without losing query or fragment', () => page('/download?source=test#mac', (_doc, _w, redirects) => {
  assert.deepEqual(redirects, ['/ru/download?source=test#mac'])
}, { languages: ['ru-RU', 'en-US'] }))

test('English fallback does not redirect visitors with unsupported languages', () => page('/download', (doc, _w, redirects) => {
  assert.equal(doc.documentElement.lang, 'en')
  assert.deepEqual(redirects, [])
}, { languages: ['ja-JP'] }))

test('Russian home and feature details use the same catalog', () => page('/ru', (doc, w) => {
  assert.match(doc.querySelector('h1').textContent, /Ваши идеи/)
  doc.querySelector('[data-feature-index]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }))
  assert.equal(doc.querySelector('.feature-modal').hidden, false)
  assert.match(doc.querySelector('#feature-modal-description').textContent, /AdaScript использует/)
  assert.match(doc.querySelector('[data-modal-close]')?.getAttribute('aria-label') ?? doc.querySelector('.feature-modal-close').getAttribute('aria-label'), /Закрыть/)
}))

for (const [route, heading] of [['studio', 'Ваша следующая игра.'], ['learn', 'Изучайте Ada'], ['community', 'Присоединяйтесь к сообществу'], ['donate', 'Поддержите Ada'], ['blog', 'Новости движка'], ['demos', 'Демо Ada']]) {
  test(`Russian ${route} page renders with a footer language switcher`, () => page(`/ru/${route}`, doc => {
    assert.match(doc.querySelector('h1').textContent, new RegExp(heading))
    assert.equal(doc.querySelector('[data-site-language]').value, 'ru')
  }))
}

test('Russian demo pages localize catalog entries and retain original source and embed URLs', () => page('/ru/demos/sprite-example', doc => {
  assert.equal(doc.querySelector('h1').textContent, 'Спрайт')
  assert.equal(doc.querySelector('iframe').getAttribute('src'), '/demos/sprite-example/embed.html')
  assert.match(doc.querySelector('code').textContent, /let demo = 1/)
}))

test('original articles are marked as English inside the Russian site', () => page('/ru/articles/introducing-adaengine-1-0-0', doc => {
  assert.equal(doc.querySelector('.article-content').lang, 'en')
  assert.match(doc.querySelector('.article-language-note').textContent, /на английском языке/)
  assert.equal(doc.querySelector('.article-back-link').getAttribute('href'), '/ru/blog')
}))

test('language dropdown remains usable when storage is unavailable', () => page('/ru/download', (doc, w, _redirects, navigations) => {
  const picker = doc.querySelector('[data-site-language]')
  picker.value = 'en'
  assert.doesNotThrow(() => picker.dispatchEvent(new w.Event('change', { bubbles: true })))
  assert.deepEqual(navigations, ['https://adaengine.org/download?lang=en'])
}, { storageBlocked: true }))

test('an explicit English choice works across navigation with storage blocked and a Russian system', () => page('/download?lang=en', (doc, w, redirects, navigations) => {
  assert.equal(doc.documentElement.lang, 'en')
  assert.deepEqual(redirects, [])
  assert.equal(doc.querySelector('.navigation-item-link').getAttribute('href'), '/?lang=en')
  const picker = doc.querySelector('[data-site-language]')
  picker.value = 'ru'
  picker.dispatchEvent(new w.Event('change', { bubbles: true }))
  assert.deepEqual(navigations, ['https://adaengine.org/ru/download?lang=ru'])
}, { languages: ['ru-RU'], storageBlocked: true }))


test('standalone Russian Cloud localizes sign-in, terms and navigation with a footer picker', () => page('/ru/cloud', (doc, w, _redirects, navigations) => {
  assert.match(doc.querySelector('.cloud-signin').textContent, /Войти в Ada/)
  assert.equal(doc.querySelector('.cloud-provider-apple img').getAttribute('src'), '/images/auth/apple-sign-in-white-ru.png')
  assert.match(doc.querySelector('.cloud-signin').textContent, /Отправить код/)
  assert.equal(doc.querySelector('.cloud-agreement a').getAttribute('href'), '/ru/legal/terms')
  assert.equal(doc.querySelector('[data-site-language]').value, 'ru')
  const picker = doc.querySelector('[data-site-language]'); picker.value = 'en'
  picker.dispatchEvent(new w.Event('change', { bubbles: true }))
  assert.deepEqual(navigations, ['https://adaengine.org/cloud'])
}, { services: true }))

test('OAuth completion retains the Russian Cloud path', () => page('/ru/cloud?code=callback', (doc, w) => {
  assert.equal(w.location.pathname, '/ru/cloud')
  assert.equal(w.location.search, '')
  assert(doc.querySelector('.cloud-signin'))
}, { services: true }))

test('Cloud root on its own hostname uses the localized account application and website links', () => page('/ru', doc => {
  assert(doc.querySelector('.cloud-signin'))
  assert.equal(doc.querySelector('.header-logo').getAttribute('href'), 'https://adaengine.org/ru')
}, { hostname: 'cloud.adaengine.org', services: true }))

test('Russian Store translates filters and account UI while preserving creator text', () => page('/ru/store', (doc, w, _redirects, navigations) => {
  assert.match(doc.querySelector('.store-hero').textContent, /Бесплатные ресурсы/)
  assert.equal(doc.querySelector('.store-card h3').textContent, 'Home')
  assert.equal(doc.querySelector('.store-card .store-eyebrow').textContent, 'Текстуры')
  assert.match(doc.querySelector('.store-account-actions').textContent, /Мои ресурсы/)
  assert.equal(doc.querySelector('.store-account-actions a').getAttribute('href'), 'https://cloud.adaengine.org/ru/cloud')
  const picker = doc.querySelector('[data-site-language]'); picker.value = 'en'
  picker.dispatchEvent(new w.Event('change', { bubbles: true }))
  assert.deepEqual(navigations, ['https://adaengine.org/store'])
}, { services: true, signedIn: true }))

test('Store root supports Russian on its own hostname and sign-in stays on the Store origin', () => page('/ru', doc => {
  assert(doc.querySelector('.store-hero'))
  assert.equal(doc.querySelector('.store-account-actions a').getAttribute('href'), '/ru/cloud')
  assert.equal(doc.querySelector('.header-logo').getAttribute('href'), 'https://adaengine.org/ru')
}, { hostname: 'store.adaengine.org', services: true }))


test('Store publishing form localizes fields without rewriting default creator content', () => page('/ru/store', (doc, w) => {
  doc.querySelector('.store-hero .store-primary').onclick(new w.MouseEvent('click', { bubbles: true }))
  const form = doc.querySelector('.store-form')
  assert(form)
  assert.match(form.textContent, /Название ресурса/)
  assert.match(form.textContent, /Отображаемое имя автора/)
  assert.match(form.textContent, /Опубликовать бесплатный ресурс/)
  assert.equal(form.querySelector('input').value, '')
}, { services: true, signedIn: true }))

test('Store detail and review UI translate while asset title and description stay original', () => page('/ru/store', async (doc, w) => {
  doc.querySelector('.store-card').onclick(new w.MouseEvent('click', { bubbles: true }))
  for (let i = 0; i < 10; i++) await new Promise(resolve => setImmediate(resolve))
  assert.equal(doc.querySelector('.store-dialog h2').textContent, 'Home')
  assert.equal(doc.querySelector('.store-description').textContent, 'An author description in English')
  assert.match(doc.querySelector('.store-dialog').textContent, /Отзывы сообщества/)
  assert.equal(doc.querySelector('[aria-label="Ваш отзыв"]').placeholder, 'Как этот ресурс проявил себя в вашем проекте?')
  assert.equal(doc.querySelector('.store-detail-actions a').getAttribute('href'), '/v1/store/assets/asset-1/download')
}, { services: true, signedIn: true }))

for (const product of ['cloud', 'store']) {
  test(`${product} keeps an English choice in internal links when storage is blocked`, () => page(`/${product}?lang=en`, doc => {
    const link = doc.querySelector(product === 'cloud' ? '.cloud-navigation a[href^="/cloud"]' : '.store-account-actions a')
    assert.equal(link.getAttribute('href'), '/cloud?lang=en')
  }, { services: true, storageBlocked: true, languages: ['ru-RU'] }))
}


test('standalone Cloud catalog stays on the localized host instead of redirecting to itself', () => page('/ru/games', (doc, _w, redirects) => {
  assert.match(doc.querySelector('.cloud-grid').textContent, /Открытые игры/)
  assert.equal(doc.querySelector('.cloud-grid a').getAttribute('href'), '/ru/cloud/projects')
  assert.deepEqual(redirects, [])
}, { services: true }))

test('Store navigation keeps the language-prefixed catalog on its own origin', () => page('/ru', doc => {
  const active = doc.querySelector('.navigation-item-link.is-active')
  assert.equal(active.getAttribute('href'), '/ru/store')
}, { hostname: 'store.adaengine.org', services: true }))

test('cross-product English links carry the choice past server root redirects', () => page('/cloud?lang=en', doc => {
  const link = [...doc.querySelectorAll('.navigation-item-link')].find(node => node.textContent === 'Store')
  assert.equal(link.getAttribute('href'), 'https://store.adaengine.org/store?lang=en')
}, { hostname: 'cloud.adaengine.org', services: true }))
