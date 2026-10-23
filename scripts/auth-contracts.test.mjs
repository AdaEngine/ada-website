import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'
import { Window } from 'happy-dom'
import { safePlaygroundReturn, rememberPlaygroundReturn, takePlaygroundReturn } from '../src/cloudReturn.ts'

const repo = dirname(dirname(fileURLToPath(import.meta.url)))
const scratch = mkdtempSync(join(tmpdir(), 'ada-playground-tests-'))
after(() => rmSync(scratch, { recursive: true, force: true }))
async function bundle(name, source, operator = false, load = true) {
  await build({ root: repo, configFile: false, publicDir: false, logLevel: 'silent',
    define: { 'import.meta.env.VITE_OPERATOR_CONSOLE': String(operator), 'import.meta.env.VITE_CLOUD_API_URL': JSON.stringify('') },
    build: { outDir: scratch, emptyOutDir: false, minify: false, lib: { entry: join(repo, source), formats: ['es'], fileName: () => `${name}.mjs` } },
  })
  const url = pathToFileURL(join(scratch, `${name}.mjs`)).href
  return load ? import(url) : url
}
const { renderCloud } = await bundle('cloud', 'src/cloud.ts')
const { renderCloud: renderConsoleSignIn } = await bundle('console', 'src/cloud.ts', true)
async function withDOM(path, run) {
  const window = new Window({ url: 'https://playground.test' + path })
  for (const key of ['window', 'document', 'location', 'navigator', 'HTMLElement', 'sessionStorage', 'history']) Object.defineProperty(globalThis, key, { value: key === 'window' ? window : window[key], configurable: true })
  globalThis.fetch = async url => { throw new Error(`Unexpected network request: ${url}`) }
  try { await run(window) } finally { await window.happyDOM.close() }
}
function cloudAPI(auth) {
  const requests = []
  globalThis.fetch = async (url, options = {}) => {
    const path = String(url); requests.push({ path, method: options.method || 'GET' })
    let status = 200, data
    if (path === '/v1/legal') data = {}
    else if (path === '/v1/availability') data = { cloudServicesAvailable: true, registrationRestricted: true }
    else if (path === '/v1/me') { status = auth.signedIn ? 200 : 401; data = auth.signedIn ? { id: 'me', name: 'Developer' } : { error: { message: 'Sign in required' } } }
    else if (path === '/v1/auth/refresh') { status = 401; data = { error: { message: 'Sign in required' } } }
    else if (path === '/v1/auth/exchange') data = {}
    else if (path.startsWith('/v1/auth/desktop/')) data = {}
    else if (path === '/v1/ai/studio-config') data = { enabled: false }
    else if (path === '/v1/pages' || path === '/v1/publications') data = []
    else if (path === '/v1/billing') data = { pro: false }
    else throw new Error(`Unexpected API request: ${path}`)
    return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
  }
  return requests
}

test('OAuth completion returns to a private New project form', () => withDOM('/cloud/projects/new', async window => {
  const auth = { signedIn: false }, requests = cloudAPI(auth); await renderCloud(document.body, () => '<header>Website</header>', () => {})
  auth.signedIn = true; window.happyDOM.setURL('https://playground.test/cloud?code=test-exchange'); await renderCloud(document.body)
  assert.equal(location.pathname, '/cloud/projects/new')
  assert.match(document.body.textContent, /Create a game page/)
  assert(requests.some(row => row.path === '/v1/auth/exchange' && row.method === 'POST'))
}))

test('desktop approval takes precedence over a pending Playground destination', () => withDOM('/cloud', async () => {
  rememberPlaygroundReturn(sessionStorage, '/games/create')
  sessionStorage.setItem('ada.cloud.desktop', 'd'.repeat(43)); cloudAPI({ signedIn: true })
  await renderCloud(document.body, () => '<header>Website</header>', () => {})
  assert.equal(location.pathname, '/cloud'); assert.match(document.body.textContent, /Continue to Ada Editor/)
}))

test('operator Console sign-in preserves its own header and access boundary', () => withDOM('/cloud', async () => {
  cloudAPI({ signedIn: false }); await renderConsoleSignIn(document.body, () => '<header class="console-header">Operator Console</header>', () => {})
  assert(document.querySelector('.console-header'))
  assert(!document.body.classList.contains('ada-playground'))
  assert(!document.querySelector('.playground-rail'))
  assert.match(document.body.textContent, /Only existing organization operators can sign in/)
}))

test('Store authentication callback wins over a pending Playground destination', () => withDOM('/cloud', async () => {
  rememberPlaygroundReturn(sessionStorage, '/games/create'); cloudAPI({ signedIn: true }); let called = false
  await renderCloud(document.body, () => '<header>Store sign-in</header>', () => {}, async () => { called = true })
  assert(called); assert.equal(location.pathname, '/cloud'); assert.equal(takePlaygroundReturn(sessionStorage), null)
}))
