import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { Window } from 'happy-dom';
const out = mkdtempSync(join(tmpdir(), 'ada-panels-'));
after(() => rmSync(out, { recursive: true, force: true }));
await build({ configFile: false, publicDir: false, logLevel: 'silent', define: { 'import.meta.env.VITE_CLOUD_API_URL': JSON.stringify(''), 'import.meta.env.VITE_OPERATOR_CONSOLE': 'false', 'import.meta.env.BASE_URL': JSON.stringify('/') }, build: { outDir: out, lib: { entry: resolve('src/cloud.ts'), formats: ['es'], fileName: () => 'panels.mjs' } } });
const { mountCloudPanel, updateCloudPanelLanguage } = await import(pathToFileURL(join(out, 'panels.mjs')));
const settle = async () => { for (let n = 0; n < 4; n++) await new Promise(resolve => setImmediate(resolve)); };
async function dom(path, run, signedIn = false, options = {}) {
  const w = new Window({ url: 'http://localhost:8080' + path });
  for (const key of ['window', 'document', 'location', 'navigator', 'HTMLElement', 'Element', 'sessionStorage', 'history']) Object.defineProperty(globalThis, key, { value: key === 'window' ? w : w[key], configurable: true });
  const calls = [], navigations = [], account = signedIn ? { id: 'owner', name: 'Creator' } : null;
  globalThis.fetch = async url => {
    calls.push(String(url));
    const data = String(url).startsWith('/v1/game-releases') ? [] : ({ '/v1/me': account, '/v1/legal': {}, '/v1/availability': { cloudServicesAvailable: true }, '/v1/billing': { pro: false }, '/v1/auth/sessions': [], '/v1/pages': [{ id: 'page-1', title: 'Published world' }], '/v1/publications': [] })[url];
    if (data === undefined) throw new Error(`Unexpected API: ${url}`);
    return Response.json(data);
  };
  const host = document.createElement('div'); document.body.append(host);
  const cleanup = mountCloudPanel(host, { onNavigate: async (path, options) => navigations.push({ path, options }), ...options });
  try { await settle(); await run({ w, host, calls, navigations }); } finally { cleanup(); await w.happyDOM.close(); }
}
test('embedded sign-in uses the host shell and preserves OTP without bundling dev shortcuts', () => dom('/account?continue=%2Fcreate', async ({ host, w }) => {
  assert(host.textContent.includes('Sign in to Ada'));
  assert.equal(host.querySelector('.cloud-context'), null);
  assert.equal(host.querySelector('.playground-rail'), null);
  // A fresh mount restores the existing email step, not a new auth implementation.
  sessionStorage.setItem('ada.cloud.emailFlow', JSON.stringify({ email: 'qa@example.test', flowId: 'flow', verifier: 'proof', expiresAt: Date.now() + 600000 }));
  const next = document.createElement('div'); host.append(next);
  const stop = mountCloudPanel(next, { onNavigate: async () => {} });
  await settle();
  assert(next.textContent.includes('qa@example.test'));
  assert(next.querySelector('input[autocomplete=one-time-code]'));
  assert.equal(next.querySelector('a[href="http://127.0.0.1:28088/"]'), null);
  assert.equal(sessionStorage.getItem('ada.cloud.emailFlow').includes('proof'), true);
  stop();
}));
test('publication panels keep publication IDs separate from private workspaces', () => dom('/publications/page-1', async ({ host, calls }) => {
  assert(host.textContent.includes('Published world'));
  assert(calls.includes('/v1/pages'));
  assert(!calls.some(url => url.startsWith('/v1/workspaces')));
  assert.equal(host.querySelector('.cloud-project-list-item').getAttribute('href'), '/publications/page-1');
}, true));
test('legal links navigate through Playground rather than replacing its shell', () => dom('/account', async ({ host, navigations, w }) => {
  host.querySelector('a[href="/legal/terms"]').dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
  await settle();
  assert.equal(navigations[0].path, '/legal/terms');
}));
test('legal content remains readable without signing in', () => dom('/legal/privacy', async ({ host, calls }) => {
  assert(host.querySelector('.cloud-legal-document'));
  assert(!calls.includes('/v1/me'));
}));

test('a transport failure is not an authoritative sign-out', () => dom('/account', async ({ host }) => {
  const before = fetch;
  globalThis.fetch = async url => { if (url === '/v1/me') throw new TypeError('Network unavailable'); return before(url); };
  let notified = false;
  const stop = mountCloudPanel(host, { onNavigate: async () => {}, onAuthenticated: async () => { notified = true; } });
  await settle();
  assert.equal(notified, false);
  assert(!host.querySelector('.cloud-signin'));
  assert(host.textContent.includes('Network unavailable'));
  assert([...host.querySelectorAll('button')].some(button => button.textContent === 'Try again'));
  stop();
}, true));

// Host-supplied translations: the standalone panel must not depend on a Studio checkout.
const catalogs = {en: {}, ru: {
  'Sign in to Ada': 'Войти в Ada', 'Send code': 'Отправить код',
  'Please accept the Terms of Use before continuing.': 'Примите условия использования перед продолжением.',
  'Enter the code sent to {0}.': 'Введите код, отправленный на {0}.',
  'I agree to the {0}': 'Я принимаю {0}', 'Terms of Use': 'Условия использования',
}};
function localeOptions() {
  let language = 'en';
  return { change: value => { language = value; updateCloudPanelLanguage(); },
    options: { getLanguage: () => language, translate: (key, ...values) => (catalogs[language][key] || key).replace(/\{(\d+)\}/g, (_, index) => String(values[index] ?? '')) } };
}
test('mounted account form and existing validation errors follow Studio language without losing email', async () => {
  const locale = localeOptions();
  await dom('/account', async ({ host, w }) => {
    const input = host.querySelector('input[type=email]'); input.value = 'my-draft@example.test';
    const send = [...host.querySelectorAll('button')].find(node => node.textContent === 'Send code');
    const checkbox = host.querySelector("input[type=checkbox]"); checkbox.checked = false; checkbox.dispatchEvent(new w.Event("change"));
    assert.equal(send.disabled, true);
    await send.onclick(new w.MouseEvent("click")); await settle();
    assert(host.textContent.includes('Please accept the Terms of Use before continuing.'));
    const terms = host.querySelector('a[href="/legal/terms"]');
    locale.change('ru');
    assert.equal(host.querySelector('.cloud-provider-apple img').getAttribute('src'), '/images/auth/apple-sign-in-white-ru.png');
    assert(host.textContent.includes('Войти в Ada'));
    assert(host.textContent.includes(catalogs.ru['Please accept the Terms of Use before continuing.']));
    assert.equal(host.querySelector('input[type=email]'), input);
    assert.equal(input.value, 'my-draft@example.test');
    assert.equal(host.querySelector('a[href="/legal/terms"]'), terms);
    assert.equal(send.textContent, catalogs.ru['Send code']);
    locale.change('en');
    assert.equal(send.textContent, 'Send code');
    assert(host.textContent.includes('I agree to the Terms of Use'));
  }, false, locale.options);
});
test('mounted OTP prompt preserves its flow, code and user email while language changes', async () => {
  const locale = localeOptions();
  await dom('/account', async ({ host }) => {
    sessionStorage.setItem('ada.cloud.emailFlow', JSON.stringify({ email: 'qa@example.test', flowId: 'flow', verifier: 'proof', expiresAt: Date.now() + 600000 }));
    const next = document.createElement('div'); host.append(next);
    const stop = mountCloudPanel(next, { onNavigate: async () => {}, ...locale.options });
    try {
      await settle();
      const otp = next.querySelector('input[autocomplete=one-time-code]'); otp.value = '123456';
      locale.change('ru');
      assert(next.textContent.includes(catalogs.ru['Enter the code sent to {0}.'].replace('{0}', 'qa@example.test')));
      assert.equal(next.querySelector('input[autocomplete=one-time-code]'), otp);
      assert.equal(otp.value, '123456');
      assert(sessionStorage.getItem('ada.cloud.emailFlow').includes('proof'));
      locale.change('en');
      assert(next.textContent.includes('Enter the code sent to qa@example.test.'));
      assert.equal(otp.value, '123456');
    } finally { stop(); }
  }, false, locale.options);
});
