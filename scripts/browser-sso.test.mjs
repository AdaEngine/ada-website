import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createHash } from 'node:crypto'
import { build } from 'vite'
import { Window } from 'happy-dom'
import { browserSSOPeer, restoreBrowserSession } from '../src/browserSSO.ts'

const repo = dirname(dirname(fileURLToPath(import.meta.url)))
const scratch = mkdtempSync(join(tmpdir(), 'ada-browser-sso-'))
after(() => rmSync(scratch, { recursive: true, force: true }))
await build({ root: repo, configFile: false, publicDir: false, logLevel: 'silent',
  build: { outDir: scratch, minify: false, lib: { entry: join(repo, 'src/store.ts'), formats: ['es'], fileName: () => 'store.mjs' } },
})
const { renderStore } = await import(pathToFileURL(join(scratch, 'store.mjs')).href)

async function withDOM(host, run) {
  const window = new Window({ url: `https://${host}/store` })
  for (const key of ['window', 'document', 'location', 'navigator', 'HTMLElement', 'sessionStorage', 'history']) {
    Object.defineProperty(globalThis, key, { value: key === 'window' ? window : window[key], configurable: true })
  }
  try { await run(window) } finally { await window.happyDOM.close() }
}
const response = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })

test('SSO pairs public domains within the same environment and excludes Console and unknown hosts', () => {
  assert.equal(browserSSOPeer('store.adaengine.org'), 'https://cloud.adaengine.org')
  assert.equal(browserSSOPeer('cloud.adaengine.org'), 'https://store.adaengine.org')
  assert.equal(browserSSOPeer('store-test.adaengine.org'), 'https://cloud-test.adaengine.org')
  assert.equal(browserSSOPeer('cloud-test.adaengine.org'), 'https://store-test.adaengine.org')
  for (const host of ['console.adaengine.org', 'adaengine.org', 'store.adaengine.org.evil.test', 'localhost']) assert.equal(browserSSOPeer(host), null)
})

test('automatic exchange uses credentialed POST and PKCE without persisting tokens', () => withDOM('store-test.adaengine.org', async () => {
  const requests = []
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options })
    return response(url.endsWith('/sso') ? { code: 'c'.repeat(43) } : { accountId: 'me' })
  }
  assert.equal(await restoreBrowserSession(), true)
  assert.equal(requests[0].url, 'https://cloud-test.adaengine.org/v1/auth/sso')
  assert.equal(requests[1].url, '/v1/auth/exchange')
  const { verifier, code } = JSON.parse(requests[1].options.body)
  assert.equal(code, 'c'.repeat(43))
  assert.equal(JSON.parse(requests[0].options.body).challenge, createHash('sha256').update(verifier).digest('base64url'))
  for (const { options } of requests) {
    assert.equal(options.method, 'POST'); assert.equal(options.credentials, 'include')
  }
  assert.equal(sessionStorage.length, 0)
}))

test('Cloud restores a Store session in the reverse direction', () => withDOM('cloud.adaengine.org', async () => {
  const urls = []
  globalThis.fetch = async url => { urls.push(url); return response({ code: 's'.repeat(43) }) }
  assert.equal(await restoreBrowserSession(), true)
  assert.equal(urls[0], 'https://store.adaengine.org/v1/auth/sso')
}))

test('guest, unavailable peer, malformed code and failed exchange fall back without looping', () => withDOM('store.adaengine.org', async () => {
  for (const mode of ['guest', 'offline', 'malformed', 'exchange']) {
    let calls = 0
    globalThis.fetch = async () => {
      calls++
      if (mode === 'offline') throw new TypeError('Network unavailable')
      if (mode === 'guest' || (mode === 'exchange' && calls === 2)) return response({}, 401)
      return response({ code: mode === 'malformed' ? 'bad' : 's'.repeat(43) })
    }
    assert.equal(await restoreBrowserSession(), false)
    assert.equal(calls, mode === 'exchange' ? 2 : 1)
  }
}))

function storeAPI({ existing = false, source = true, refreshStatus = 401 } = {}) {
  let authenticated = existing
  const requests = []
  globalThis.fetch = async (url, options = {}) => {
    requests.push(String(url))
    if (url === '/v1/me') return response(authenticated ? { id: 'account-id', name: 'Developer' } : {}, authenticated ? 200 : 401)
    if (url === '/v1/auth/refresh') return response({}, refreshStatus)
    if (url === 'https://cloud.adaengine.org/v1/auth/sso') return response({ code: 's'.repeat(43) }, source ? 200 : 401)
    if (url === '/v1/auth/exchange') { authenticated = true; return response({ accountId: 'account-id' }) }
    if (url === '/v1/store/categories') return response({ categories: [], licenses: [], limits: {} })
    if (String(url).startsWith('/v1/store/assets?')) return response({ items: [], total: 0 })
    throw new Error(`Unexpected request: ${url}`)
  }
  return requests
}

test('Store recognizes the Identity id profile and renders signed-in actions', () => withDOM('store.adaengine.org', async () => {
  const requests = storeAPI({ existing: true })
  await renderStore(document.body, () => '', () => {})
  assert.match(document.body.textContent, /My assets/)
  assert(!document.querySelector('.store-account-actions')?.textContent.includes('Sign in'))
  assert(!requests.some(url => url.includes('/auth/')))
}))

test('Store automatically restores Cloud login before rendering account actions', () => withDOM('store.adaengine.org', async () => {
  const requests = storeAPI()
  await renderStore(document.body, () => '', () => {})
  assert.match(document.body.textContent, /My assets/)
  assert.deepEqual(requests.slice(0, 5), ['/v1/me', '/v1/auth/refresh', 'https://cloud.adaengine.org/v1/auth/sso', '/v1/auth/exchange', '/v1/me'])
}))

test('Store remains browsable by guests and during Identity outages', () => withDOM('store.adaengine.org', async () => {
  for (const options of [{ source: false }, { refreshStatus: 503 }]) {
    const requests = storeAPI(options)
    await renderStore(document.body, () => '', () => {})
    assert.match(document.querySelector('.store-account-actions').textContent, /Sign in/)
    assert(requests.some(url => url.startsWith('/v1/store/assets?')))
    assert.equal(requests.filter(url => url.endsWith('/sso')).length, options.refreshStatus === 503 ? 0 : 1)
  }
}))
