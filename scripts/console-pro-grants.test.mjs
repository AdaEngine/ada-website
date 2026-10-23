import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { Window } from 'happy-dom';

const out = mkdtempSync(join(tmpdir(), 'ada-console-pro-'));
after(() => rmSync(out, { recursive: true, force: true }));
await build({ configFile: false, publicDir: false, logLevel: 'silent', define: { 'import.meta.env.VITE_CLOUD_API_URL': JSON.stringify(''), 'import.meta.env.VITE_OPERATOR_CONSOLE': 'true', 'import.meta.env.BASE_URL': JSON.stringify('/') }, build: { outDir: out, lib: { entry: resolve('src/console.ts'), formats: ['es'], fileName: () => 'console.mjs' } } });
const owner = '00000000-0000-4000-8000-000000000001';
let serial = 0;
const settle = async () => { for (let i = 0; i < 5; i++) await new Promise(resolve => setImmediate(resolve)); };
async function dom({ path = '/accounts/' + owner, grant = null, paid = false, deleted = false } = {}, run) {
  const w = new Window({ url: 'http://localhost:15174' + path });
  for (const key of ['window', 'document', 'location', 'navigator', 'HTMLElement', 'Element', 'sessionStorage', 'history']) Object.defineProperty(globalThis, key, { value: key === 'window' ? w : w[key], configurable: true });
  document.body.innerHTML = '<div id="app"></div>';
  const calls = [], profile = { id: owner, name: 'QA Creator', email: 'creator@example.test', isOperator: true };
  globalThis.fetch = async (url, options) => {
    const body = options?.body ? JSON.parse(options.body) : undefined;
    calls.push({ url, body, method: options?.method });
    if (url === '/v1/me') return Response.json(profile);
    if (url.startsWith('/v1/admin/accounts?')) return Response.json([profile]);
    if (url === '/v1/admin/accounts/' + owner) return deleted ? Response.json({}, { status: 404 }) : Response.json(profile);
    if (url === '/v1/admin/billing/accounts/' + owner) return Response.json({ entitlement: { pro: paid || !!grant && !grant.revoked, giftedPro: !!grant && !grant.revoked, paidPro: paid, expiresAt: grant?.expiresAt ?? 0 }, proGrant: grant, transactions: [], refunds: [] });
    if (url === `/v1/admin/billing/accounts/${owner}/pro-grant`) {
      grant = { ...body, revision: (grant?.revision ?? 0) + 1, revoked: false };
      return Response.json({});
    }
    if (url === `/v1/admin/billing/accounts/${owner}/pro-grant/revoke`) { grant.revoked = true; return Response.json({}); }
    throw new Error('Unexpected API: ' + url);
  };
  try {
    await import(pathToFileURL(join(out, 'console.mjs')).href + '?case=' + (++serial));
    await settle();
    const host = document.querySelector('#app');
    const button = text => [...host.querySelectorAll('button')].find(node => node.textContent === text);
    await run({ host, calls, button });
  } finally { await w.happyDOM.close(); }
}

test('operator finds their own account without knowing its ID', () => dom({ path: '/accounts' }, async ({ host }) => {
  assert.equal([...host.querySelectorAll('a')].find(a => a.textContent === 'Мой аккаунт').getAttribute('href'), '/accounts/' + owner);
}));

test('gift-only account accepts a custom local expiry, requires reason and sends revision', () => dom({}, async ({ host, calls, button }) => {
  assert(button('Выдать Pro'));
  button('Выдать Pro').click(); await settle();
  assert(host.textContent.includes('Укажите причину.'));
  assert(!calls.some(call => call.method === 'POST'));
  const expiry = host.querySelector('input[type=datetime-local]');
  expiry.value = '2028-05-17T16:42';
  [...host.querySelectorAll('label')].find(label => label.textContent.includes('Причина выдачи')).querySelector('input').value = 'For a friend';
  button('Выдать Pro').click(); await settle();
  const request = calls.find(call => call.method === 'POST');
  assert.equal(request.url, `/v1/admin/billing/accounts/${owner}/pro-grant`);
  assert.equal(request.body.expiresAt, new Date('2028-05-17T16:42').getTime() / 1000);
  assert.equal(request.body.expectedRevision, 0);
  assert.equal(request.body.reason, 'For a friend');
  assert(request.body.operationId);
  assert(button('Забрать подарочный Pro'));
  assert(button('Отозвать доступ Pro'));
}));

test('revocation targets the gift and leaves paid access visible', () => dom({ paid: true, grant: { revision: 7, expiresAt: 1900000000, reason: 'Partnership', revoked: false } }, async ({ host, calls, button }) => {
  [...host.querySelectorAll('label')].find(label => label.textContent.includes('Причина выдачи')).querySelector('input').value = 'Partnership ended';
  button('Забрать подарочный Pro').click(); await settle();
  const request = calls.find(call => call.method === 'POST');
  assert.equal(request.url, `/v1/admin/billing/accounts/${owner}/pro-grant/revoke`);
  assert.equal(request.body.expectedRevision, 7);
  assert.equal(request.body.expiresAt, undefined);
  assert(host.textContent.includes('Доступ Pro: активен'));
  assert(host.textContent.includes('Подарочный Pro: отозван'));
  assert(!button('Забрать подарочный Pro'));
}));

test('deleted profiles do not offer a new grant', () => dom({ deleted: true }, async ({ host, button }) => {
  assert(host.textContent.includes('Удалённый аккаунт'));
  assert(!button('Выдать Pro'));
}));
