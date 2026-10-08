import './style.css'
import './cloud.css'
import './console.css'
import { renderCloud } from './cloud'

type Json = Record<string, any>
const host = document.querySelector<HTMLElement>('#app')!
let content: HTMLElement, message: HTMLElement, currentAccount: Json
let refreshing: Promise<unknown> | undefined
class APIError extends Error { constructor(message: string, public status: number) { super(message) } }
async function api(path: string, method = 'GET', body?: unknown, retry = true): Promise<any> {
  const response = await fetch('/v1' + path, { credentials: 'include', method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) })
  if (response.status === 401 && retry && !path.startsWith('/auth/')) {
    refreshing ??= api('/auth/refresh', 'POST', {}, false).finally(() => { refreshing = undefined })
    await refreshing; return api(path, method, body, false)
  }
  if (response.status === 204) return null
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new APIError(data.error?.message ?? `Сервис недоступен (${response.status})`, response.status)
  return data
}
function el<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', cls = ''): HTMLElementTagNameMap[K] { const node = document.createElement(tag); node.textContent = text; node.className = cls; return node }
function link(text: string, href: string) { const node = el('a', text); node.href = href; return node }
function status(text: string) { if (message) message.textContent = text }
function action(text: string, task: () => Promise<void>, secondary = false) {
  const node = el('button', text, secondary ? 'header-buttons-github' : 'header-buttons')
  node.onclick = async () => { node.disabled = true; status(''); try { await task() } catch (error) { status(error instanceof Error ? error.message : 'Операция не выполнена') } finally { node.disabled = false } }
  return node
}
function input(label: string, type = 'text') { const wrapper = el('label', label), control = el('input'); control.type = type; wrapper.append(control); return { wrapper, control } }
function panel(title: string, parent = content) { const section = el('section', '', 'cloud-panel console-panel'); section.append(el('h2', title)); parent.append(section); return section }
const states: Record<string, string> = { pending: 'Ожидает проверки', approved: 'Одобрено', rejected: 'Отклонено', revoked: 'Отозвано', removed: 'Удалено', customer_action_required: 'Нужна заявка покупателя в Apple', apple_review: 'На проверке у Apple', refunded: 'Возврат подтверждён Apple', reversed: 'Возврат отменён Apple', declined: 'Возврат отклонён Apple', simulated: 'Тестовый возврат — реальных денег нет' }
function timestamp(value: number) { return value ? new Date(value * 1000).toLocaleString('ru-RU') : '—' }
function money(transaction: Json) { const value = transaction.priceMilliunits ?? transaction.amountMinor; if (value === null || value === undefined || !/^[A-Z]{3}$/.test(transaction.currency || '')) return 'Сумма или валюта не передана провайдером'; return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: transaction.currency || 'USD' }).format(Number(value) / (transaction.priceMilliunits !== undefined && transaction.priceMilliunits !== null ? 1000 : 100)) }
function table(headers: string[], rows: (string | HTMLElement)[][]) { const wrapper = el('div', '', 'console-table-scroll'), node = el('table'); const head = el('thead'), hr = el('tr'); for (const h of headers) hr.append(el('th', h)); head.append(hr); node.append(head); const body = el('tbody'); for (const row of rows) { const tr = el('tr'); for (const value of row) { const td = el('td'); if (typeof value === 'string') td.textContent = value; else td.append(value); tr.append(td) }; body.append(tr) }; node.append(body); wrapper.append(node); return wrapper }
function header() { return '<header class="console-header"><a href="/" aria-label="Ada Console"><picture><source srcset="/images/ae_logo~dark.svg" media="(prefers-color-scheme: dark)"><img src="/images/ae_logo.svg" alt=""></picture><strong>Ada Console</strong></a><span>Управление организацией</span></header>' }
async function render() {
  if (location.pathname.startsWith('/legal/')) { await renderCloud(host, header, () => {}, render); return }
  let account: Json | null
  try { account = await api('/me') } catch { account = null }
  if (!account) { await renderCloud(host, header, () => {}, render); return }
  host.replaceChildren(); host.className = 'ada-console'; host.insertAdjacentHTML('beforeend', header())
  message = el('p', '', 'console-notice'); message.setAttribute('role', 'status'); message.setAttribute('aria-live', 'polite')
  if (!account.isOperator) { content = host; const denied = panel('Доступ только для оператора'); denied.append(el('p', 'Этот аккаунт не включён в список операторов организации.'), action('Выйти', async () => { await api('/auth/logout', 'POST', {}); await render() }, true)); host.append(message); return }
  currentAccount = account
  if (account.deploymentEnvironment && account.deploymentEnvironment !== 'production') {
    const badge = el('span', 'Тестовая консоль · реальные деньги не переводятся', 'console-environment')
    host.querySelector('.console-header')?.append(badge)
  }
  const layout = el('div', '', 'console-layout'), sidebar = el('aside', '', 'console-sidebar'), nav = el('nav'); nav.setAttribute('aria-label', 'Разделы консоли')
  const pathname = location.pathname
  for (const [path, name] of [['/', 'Обзор'], ['/moderation', 'Модерация'], ['/reports', 'Жалобы'], ['/accounts', 'Аккаунты и подписки'], ['/refunds', 'Возвраты'], ['/apple', 'App Store'], ['/audit', 'Журнал действий']]) {
    const item = link(name, path); item.className = (path === '/' ? pathname === '/' || pathname === '/cloud' || pathname === '/console.html' : pathname.startsWith(path)) ? 'is-selected' : ''
    item.onclick = event => { event.preventDefault(); history.pushState({}, '', path); void render() }; nav.append(item)
  }
  sidebar.append(nav, el('p', account.email || account.name, 'cloud-muted'), action('Выйти', async () => { await api('/auth/logout', 'POST', {}); await render() }, true))
  content = el('main', '', 'console-content'); content.append(message); layout.append(sidebar, content); host.append(layout)
  try {
    if (pathname === '/moderation') await moderation()
    else if (pathname === '/reports') await reports()
    else if (pathname.startsWith('/accounts/')) await accountDetails(decodeURIComponent(pathname.slice('/accounts/'.length)))
    else if (pathname === '/accounts') await accounts()
    else if (pathname === '/refunds') await refunds()
    else if (pathname === '/apple') await appStore()
    else if (pathname === '/audit') await audit()
    else await overview()
  } catch (error) { status(error instanceof Error ? error.message : 'Не удалось загрузить данные') }
}
async function overview() {
  const title = panel('Рабочий стол оператора'); title.append(el('p', 'Проверяйте новые игры, разбирайте обращения и управляйте доступом к Cloud.', 'cloud-muted'))
  const [queue, reports, refundCases]: Json[][] = await Promise.all([api('/admin/game-releases'), api('/admin/reports'), api('/admin/billing/refunds')])
  const grid = el('div', '', 'console-stats')
  for (const [count, label, path] of [[queue.length, 'Версии на проверке', '/moderation'], [reports.length, 'Жалобы', '/reports'], [refundCases.filter(r => ['customer_action_required', 'apple_review'].includes(r.status)).length, 'Открытые заявки на возврат', '/refunds']]) { const card = link('', String(path)); card.append(el('strong', String(count)), el('span', String(label))); grid.append(card) }
  title.append(grid, el('p', 'Показаны текущие очереди: до 100 версий и до 200 обращений/возвратов.', 'cloud-muted'))
}
async function moderation() {
  const section = panel('Версии на модерации'), queue: Json[] = await api('/admin/game-releases')
  if (!queue.length) section.append(el('p', 'Нет версий, ожидающих проверки.', 'cloud-muted'))
  for (const release of queue) {
    const row = el('article', '', 'cloud-row cloud-review'), copy = el('div', '', 'cloud-review-copy')
    copy.append(el('strong', `${release.metadata.title} · версия ${release.number}`), el('p', release.metadata.description), link('Аккаунт автора', '/accounts/' + release.owner), el('p', timestamp(release.createdAt), 'cloud-muted'))
    if (release.metadata.cover) { const cover = el('img'); cover.src = '/v1/media/' + encodeURIComponent(release.metadata.cover); cover.alt = release.metadata.title; copy.append(cover) }
    const reason = input('Комментарий / причина отказа')
    row.append(copy, reason.wrapper, action('Превью игры', async () => { const preview = await api(`/admin/game-releases/${release.id}/preview`, 'POST', {}); const open = link('Открыть превью ↗', preview.url); open.target = '_blank'; open.rel = 'noopener noreferrer'; row.append(open); status('Секретная ссылка действует 10 минут.') }, true), action('Одобрить и опубликовать', async () => { await api(`/admin/game-releases/${release.id}/review`, 'POST', { decision: 'approve', reason: reason.control.value, operationId: crypto.randomUUID() }); row.remove(); status('Версия одобрена и опубликована.') }), action('Отклонить', async () => { if (!reason.control.value.trim()) throw new Error('Укажите причину для автора.'); await api(`/admin/game-releases/${release.id}/review`, 'POST', { decision: 'reject', reason: reason.control.value, operationId: crypto.randomUUID() }); row.remove(); status('Версия отклонена.') }, true))
    section.append(row)
  }
}
async function reports() {
  const section = panel('Жалобы на игры'), values: Json[] = await api('/admin/reports')
  if (!values.length) section.append(el('p', 'Жалоб пока нет.', 'cloud-muted'))
  for (const report of values) {
    const row = el('article', '', 'console-report cloud-row'), reason = input('Причина блокировки')
    row.append(el('p', report.reason), link('Открыть страницу игры', `${import.meta.env.VITE_PUBLIC_CLOUD_ORIGIN || 'https://cloud.adaengine.org'}/games/${report.pageId}`), reason.wrapper, action('Заблокировать игру', async () => { if (!reason.control.value.trim()) throw new Error('Укажите причину блокировки.'); await api(`/admin/pages/${report.pageId}/block`, 'POST', { reason: reason.control.value, operationId: crypto.randomUUID() }); status('Игра заблокирована, раздача отозвана.') }, true)); section.append(row)
  }
}
async function accounts() {
  const section = panel('Аккаунты и подписки'), search = input('Имя, email или ID аккаунта'), results = el('div', '', 'console-results'); let offset = 0, query = ''
  const load = async () => { const values: Json[] = await api(`/admin/accounts?q=${encodeURIComponent(query)}&offset=${offset}`); results.replaceChildren(table(['Аккаунт', 'Email', 'Создан'], values.map(value => [link(value.name || value.id, '/accounts/' + value.id), value.email || '—', timestamp(value.createdAt)]))); next.disabled = values.length < 50; previous.disabled = offset === 0; if (!values.length) results.append(el('p', 'Аккаунты не найдены.')) }
  const next = action('Следующие 50', async () => { offset += 50; await load() }, true), previous = action('Предыдущие', async () => { offset = Math.max(0, offset - 50); await load() }, true)
  section.append(search.wrapper, action('Найти', async () => { query = search.control.value.trim(); offset = 0; await load() }), results, previous, next)
  search.control.onkeydown = event => { if (event.key === 'Enter') { query = search.control.value.trim(); offset = 0; void load().catch(error => status(error.message)) } }
  await load()
}
async function accountDetails(owner: string) {
  const [profile, billing]: Json[] = await Promise.all([api('/admin/accounts/' + encodeURIComponent(owner)).catch(error => { if (error instanceof APIError && error.status === 404) return { id: owner, name: 'Удалённый аккаунт' }; throw error }), api('/admin/billing/accounts/' + encodeURIComponent(owner))])
  const section = panel(profile.name || 'Аккаунт'), plan = billing.entitlement
  section.append(el('p', profile.email || ''), el('code', owner), el('p', `Доступ Pro: ${plan.pro ? 'активен' : plan.accessSuspended ? 'отозван оператором' : 'неактивен'}`), el('p', `Оплаченный период: ${timestamp(plan.expiresAt)}`, 'cloud-muted'))
  if (billing.restriction?.reason) section.append(el('p', `${billing.restriction.suspended ? 'Причина отзыва' : 'Причина восстановления'}: ${billing.restriction.reason}`))
  const reason = input('Причина изменения доступа'), controls = el('div', '', 'console-actions')
  controls.append(action(plan.accessSuspended ? 'Снять отзыв доступа' : 'Отозвать доступ Pro', async () => { if (!reason.control.value.trim()) throw new Error('Укажите причину.'); await api(`/admin/billing/accounts/${owner}/access`, 'POST', { suspended: !plan.accessSuspended, reason: reason.control.value, operationId: crypto.randomUUID() }); await render(); status('Доступ обновлён. Изменение записано в журнал.') }, true))
  if (billing.transactions.length) section.append(reason.wrapper, controls, el('p', 'Отзыв доступа изменяет права в Ada Cloud. Автопродление и списания App Store управляются отдельно в Apple.', 'cloud-muted'))
  if (billing.appleSubscriptions?.length) {
    const subscriptions = panel('Подписки App Store')
    const labels: Record<string, string> = { active: 'Активна', expired: 'Истекла', billing_retry: 'Повтор оплаты', grace_period: 'Льготный период', revoked: 'Отозвана' }
    for (const sub of billing.appleSubscriptions) {
      const row = el('div', '', 'cloud-row console-transaction')
      row.append(el('strong', labels[sub.state] || sub.state), el('p', `Автопродление: ${sub.autoRenew === true ? 'включено' : sub.autoRenew === false ? 'выключено' : 'не передано Apple'}`), el('p', `Доступ до ${timestamp(sub.accessUntil)} · ${sub.environment}`, 'cloud-muted'), action('Сверить с Apple', async () => { await api('/admin/billing/apple/sync', 'POST', { accountId: owner, originalTransactionId: sub.id, operationId: crypto.randomUUID() }); await render(); status('Подписка сверена с Apple.') }, true))
      subscriptions.append(row)
    }
  }
  const transactions = panel('Платежи — последние 200')
  if (!billing.transactions.length) transactions.append(el('p', 'Платежей нет.', 'cloud-muted'))
  for (const tx of billing.transactions) {
    const row = el('article', '', 'cloud-row console-transaction'), refund = billing.refunds.find((r: Json) => r.transactionId === tx.id), reason = input('Причина возврата')
    row.append(el('strong', money(tx)), el('p', `${tx.provider} · ${tx.id}`, 'cloud-muted'), el('p', `Период до ${timestamp(tx.expiresAt)} · ${tx.revoked ? 'отозван провайдером' : 'подтверждён'}`))
    if (refund) row.append(el('p', states[refund.status] || refund.status))
    else if (!tx.revoked && tx.refundMode) row.append(reason.wrapper, action(tx.provider === 'sandbox' ? 'Тестовый возврат' : 'Создать заявку на возврат', async () => { if (!reason.control.value.trim()) throw new Error('Укажите причину возврата.'); await api('/admin/billing/refunds', 'POST', { transactionId: tx.id, reason: reason.control.value, operationId: crypto.randomUUID() }); await render(); status(tx.provider === 'apple' ? 'Заявка записана. Покупатель должен отправить запрос в Apple; статус обновится по подтверждённому уведомлению.' : 'Тестовая операция выполнена. Реальные деньги не переводились.') }, true))
    if (!refund && !tx.revoked && !tx.refundMode) row.append(el('p', 'Возврат недоступен: платёжный канал не подключён.', 'cloud-muted'))
    transactions.append(row)
  }
}
async function appStore() {
  const value: Json = await api('/admin/billing/apple')
  const section = panel('App Store — чеки и уведомления')
  section.append(el('p', `${value.environment} · ${value.productId || 'Product ID не задан'} · ${value.bundleId || 'Bundle ID не задан'}`, 'cloud-muted'), el('p', `Проверка подписей: ${value.verificationConfigured ? 'настроена' : 'нужны сертификаты и параметры приложения'}`), el('p', `App Store Server API: ${value.serverApiConfigured ? 'настроен' : 'нужен ключ для Base64-чеков и сверки'}`, 'cloud-muted'), el('p', `URL уведомлений V2: ${value.notificationURL}`, 'cloud-muted'))
  const owner = input('ID аккаунта покупателя'), format = el('select'), formatLabel = el('label', 'Формат'), receipt = el('textarea'), receiptLabel = el('label', 'Чек / подписанная транзакция / Transaction ID')
  for (const [key, text] of [['signedTransaction', 'StoreKit 2 · JWS'], ['receiptData', 'App receipt · Base64'], ['transactionId', 'Apple Transaction ID']]) { const option = el('option', text); option.value = key; format.append(option) }
  formatLabel.append(format); receipt.maxLength = 500000; receipt.spellcheck = false; receipt.autocomplete = 'off'; receiptLabel.append(receipt)
  const importButton = action('Проверить и обработать', async () => {
    if (!owner.control.value.trim() || !receipt.value.trim()) throw new Error('Укажите аккаунт и чек.')
    const payload = { accountId: owner.control.value.trim(), operationId: crypto.randomUUID(), [format.value]: receipt.value.trim() }
    const result = await api('/admin/billing/apple/import', 'POST', payload)
    receipt.value = ''
    status(result.processing?.syncPending ? 'Подпись и владелец проверены. Сверка с Apple ожидает повторной попытки.' : 'Чек проверен и обработан. Права обновлены по данным Apple.')
    section.append(link('Открыть аккаунт покупателя', '/accounts/' + owner.control.value.trim()))
  })
  const availability = () => { importButton.disabled = !value.verificationConfigured || (format.value !== 'signedTransaction' && !value.serverApiConfigured) }
  format.onchange = availability; availability()
  section.append(owner.wrapper, formatLabel, receiptLabel, importButton, el('p', 'Содержимое чека используется для проверки и не сохраняется в журнале. Аккаунт должен совпадать с appAccountToken или ранее установленной привязкой подписки.', 'cloud-muted'))
  const processing = panel('Последние проверки чеков')
  if (!value.processing.length) processing.append(el('p', 'Чеков пока нет.', 'cloud-muted'))
  const formats: Record<string, string> = { signedTransaction: 'JWS StoreKit 2', receiptData: 'Base64 app receipt', transactionId: 'Transaction ID' }
  const failureLabels: Record<number, string> = { 400: 'Неверный формат чека', 401: 'Подпись или данные покупки отклонены', 403: 'Нет привязки к этому аккаунту', 502: 'Apple временно недоступен', 503: 'Проверка App Store не настроена' }
  processing.append(table(['Время', 'Аккаунт', 'Формат', 'Результат', 'Транзакция'], value.processing.map((entry: Json) => [timestamp(entry.receivedAt), link(entry.owner, '/accounts/' + entry.owner), formats[entry.format] || entry.format, entry.status === 'accepted' ? entry.syncPending ? 'Проверен · сверка ожидает' : 'Обработан' : failureLabels[entry.errorCode] || 'Ошибка обработки', entry.transactionId || '—'])))
  const notifications = panel('Уведомления Apple V2')
  if (!value.notifications.length) notifications.append(el('p', 'Уведомлений пока нет.', 'cloud-muted'))
  notifications.append(table(['Время', 'Тип', 'Подтип', 'Результат', 'Транзакция'], value.notifications.map((entry: Json) => [timestamp(entry.receivedAt), entry.type || '—', entry.subtype || '—', ({ processed: 'Обработано', test: 'Тест получен', ignored_product: 'Другой продукт' } as Record<string, string>)[entry.status] || entry.status, entry.transactionId || '—'])))
}

async function refunds() {
  const section = panel('Возвраты — последние 200'), values: Json[] = await api('/admin/billing/refunds')
  section.append(el('p', 'Заявка и подтверждённый возврат — разные статусы. App Store сообщает итог через подписанные уведомления.', 'cloud-muted'))
  if (!values.length) section.append(el('p', 'Заявок пока нет.', 'cloud-muted'))
  section.append(table(['Покупатель', 'Платёж', 'Сумма платежа', 'Статус', 'Причина'], values.map(value => [link(value.owner, '/accounts/' + value.owner), value.transactionId, money(value), (value.environment && value.environment !== 'Production' ? 'Тест: ' : '') + (states[value.status] || value.status), value.reason || 'Уведомление провайдера'])))
}
function auditAction(entry: Json) {
  if (entry.action === 'subscription.access') return entry.result?.accessSuspended ? 'Отзыв доступа Pro' : 'Восстановление Pro'
  return ({ 'release.approve': 'Одобрение версии', 'release.reject': 'Отклонение версии', 'release.revoke': 'Отзыв версии', 'game.block': 'Блокировка игры', 'refund.request': 'Заявка на возврат', 'apple.import': 'Проверка чека App Store', 'apple.sync': 'Сверка подписки App Store' } as Record<string, string>)[entry.action] ?? entry.action
}
async function audit() {
  const section = panel('Журнал действий'), [billing, publishing, catalog]: Json[][] = await Promise.all([api('/admin/billing/audit'), api('/admin/game-releases/audit'), api('/admin/catalog/audit')])
  const entries = [...billing, ...publishing, ...catalog].sort((a, b) => b.createdAt - a.createdAt)
  section.append(el('p', 'Изменения доступа, модерация и заявки на возврат фиксируются с исполнителем и причиной.', 'cloud-muted'), table(['Время', 'Оператор', 'Действие', 'Объект', 'Причина'], entries.map(value => [timestamp(value.createdAt), value.actor === currentAccount.id ? 'Вы' : value.actor, auditAction(value), value.target, value.reason || '—'])))
}
window.addEventListener('popstate', () => { void render() })
void render()
