import './cloud.css'
import { draftLegal, legalDocument, type LegalMetadata } from './cloudLegal'
import { activePublicationForProject } from './cloudProjects'
import { renderTestAccess } from './cloudTestAccess'

type Json = { [key: string]: any }
const apiBase = (import.meta.env.VITE_CLOUD_API_URL as string | undefined) ?? ''
let account: Json | null = null
let root: HTMLElement
let notice: HTMLElement
let refreshing: Promise<void> | null = null
let siteHeader: () => string
let initializeSiteNavigation: () => void
let legal: LegalMetadata = draftLegal
let termsAccepted = false
let desktopRequestId: string | null = null
let availability: Json = { cloudServicesAvailable: false, billingAvailable: false }

function comingSoon() {
  const section = panel('Cloud Services will open soon.')
  section.classList.add('cloud-coming-soon')
  section.append(el('p', 'Cloud Services are launching in selected countries first. You can create an account now. Payments, settings sync and publishing will become available when we launch in your region.'))
}

async function api(path: string, method = 'GET', body?: unknown, retry = true): Promise<any> {
  const response = await fetch(apiBase + '/v1' + path, {
    method, credentials: 'include', headers: body instanceof File ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : body instanceof File ? body : JSON.stringify(body),
  })
  if (response.status === 401 && retry && !path.startsWith('/auth/')) {
    refreshing ??= api('/auth/refresh', 'POST', {}, false).then(() => {}).finally(() => { refreshing = null })
    await refreshing
    return api(path, method, body, false)
  }
  if (response.status === 204) return null
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    const retry = Number(response.headers.get('Retry-After') ?? 0)
    const fallback = response.status >= 500 ? 'Cloud is temporarily unavailable. Please try again.' : `Request failed (${response.status})`
    throw new Error((result.error?.message ?? fallback) + (retry > 0 ? ` Try again in ${Math.ceil(retry / 60)} min.` : ''))
  }
  return result
}
function el<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', className = ''): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag); node.textContent = text; node.className = className; return node
}
function link(label: string, href: string): HTMLAnchorElement { const node = el('a', label); node.href = href; return node }
function status(message: string) { notice.textContent = message }
function button(label: string, action: () => Promise<void>, secondary = false) {
  const node = el('button', label, secondary ? 'header-buttons-github cloud-secondary' : 'header-buttons')
  node.type = 'button'
  node.onclick = async () => {
    node.disabled = true; status('')
    try { await action() } catch (error) { status(error instanceof Error ? error.message : 'Request failed') }
    finally { node.disabled = false }
  }
  return node
}
function field(label: string, type = 'text', value = '') {
  const wrapper = el('label', label), input = el('input'); input.type = type; input.value = value; wrapper.append(input)
  return { wrapper, input }
}
function panel(title: string) { const section = el('section', '', 'cloud-panel'); section.append(el('h2', title)); root.append(section); return section }
function base64url(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '') }
async function pkce() {
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)))
  const challenge = base64url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))))
  return { verifier, challenge }
}
async function start(provider: string, email?: string, linking = false) {
  if (!termsAccepted) throw new Error('Please accept the Terms of Use before continuing.')
  const proof = await pkce()
  sessionStorage.setItem('ada.cloud.pkce', proof.verifier)
  const flow = await api('/auth/start', 'POST', { provider, email, challenge: proof.challenge, client: 'web', link: linking, legal: { accepted: true, termsVersion: legal.version } })
  if (flow.authorizeURL) { window.location.assign(flow.authorizeURL); return }
  sessionStorage.setItem('ada.cloud.flow', flow.flowId)
  sessionStorage.setItem('ada.cloud.emailFlow', JSON.stringify({ flowId: flow.flowId, verifier: proof.verifier, email, expiresAt: Date.now() + 600_000 }))
  status('Code sent. Check your email.')
}
function providerButton(provider: 'apple' | 'google') {
  const label = provider === 'apple' ? 'Sign in with Apple' : 'Sign in with Google'
  const node = button(label, () => start(provider, undefined, !!account))
  node.className = `cloud-provider cloud-provider-${provider}`
  node.setAttribute('aria-label', label)
  const image = el('img')
  image.alt = ''
  if (provider === 'apple') {
    image.src = `${import.meta.env.BASE_URL}images/auth/apple-sign-in-white.png`
    image.width = 216; image.height = 48
    node.replaceChildren(image)
  } else {
    image.src = `${import.meta.env.BASE_URL}images/auth/google-g.png`
    image.width = 20; image.height = 20
    node.replaceChildren(image, el('span', label))
  }
  return node
}
function signIn() {
  const section = panel(account ? 'Link another sign-in method' : desktopRequestId ? 'Sign in to Ada Editor' : 'Sign in to Ada')
  section.classList.add(account ? 'cloud-link-identity' : 'cloud-signin')
  if (window.location.hostname.startsWith('store') || sessionStorage.getItem('ada.store.return')) section.append(link('Return to Ada Store →', '/store'))
  if (!account) section.append(el('p', availability.registrationRestricted ? 'This test environment is invite-only. Ask an administrator to grant access to your account ID or email.' : availability.cloudServicesAvailable ? 'Your editor settings and shared games, in one account.' : 'Create your Ada account. Cloud Services will open soon in your region.', 'cloud-signin-description'))
  const actions = el('div', '', 'cloud-provider-actions')
  const apple = providerButton('apple'), google = providerButton('google')
  actions.append(apple, google)
  const divider = el('div', 'or continue with email', 'cloud-auth-divider')
  const fields = el('div', '', 'cloud-auth-fields')
  const agreement = el('label', '', 'cloud-agreement'), checkbox = el('input')
  checkbox.type = 'checkbox'; checkbox.checked = termsAccepted
  const agreementText = el('span'); agreementText.append('I agree to the ', link('Terms of Use', '/legal/terms'))
  agreement.append(checkbox, agreementText)
  const privacy = el('p', '', 'cloud-legal-note')
  privacy.append('How we handle personal data: ', link('Privacy Policy', '/legal/privacy'), ' · ', link('GDPR rights', '/legal/gdpr'))
  const draft = el('p', 'Draft legal documents — preview only, not yet effective.', 'cloud-legal-note')
  draft.hidden = legal.status === 'published'
  section.append(actions, divider, fields, agreement, privacy, draft)
  const updateAcceptance = () => {
    termsAccepted = checkbox.checked
    for (const node of [apple, google, ...fields.querySelectorAll<HTMLButtonElement>('button[data-requires-terms]')]) node.disabled = !termsAccepted
  }
  checkbox.onchange = updateAcceptance
  let emailValue = ''
  const readFlow = (): Json | null => {
    try { const value = JSON.parse(sessionStorage.getItem('ada.cloud.emailFlow') ?? 'null'); return value?.expiresAt > Date.now() ? value : null } catch { return null }
  }
  const renderStep = () => {
    fields.replaceChildren()
    const flow = readFlow()
    if (flow) {
      emailValue = flow.email
      const code = field('OTP Code', 'text')
      code.input.autocomplete = 'one-time-code'; code.input.inputMode = 'numeric'; code.input.maxLength = 6; code.input.pattern = '[0-9]{6}'; code.input.placeholder = '000000'; code.input.required = true
      const verify = button('Verify code', async () => {
        if (!code.input.reportValidity()) return
        await api('/auth/email/verify', 'POST', { flowId: flow.flowId, verifier: flow.verifier, code: code.input.value })
        for (const key of ['ada.cloud.flow', 'ada.cloud.pkce', 'ada.cloud.emailFlow']) sessionStorage.removeItem(key)
        await renderCloud(root.parentElement!)
      })
      verify.dataset.requiresTerms = 'true'
      code.input.onkeydown = event => { if (event.key === 'Enter') { event.preventDefault(); verify.click() } }
      fields.append(el('p', `Enter the code sent to ${flow.email}.`, 'cloud-muted'), code.wrapper, verify, button('Change email', async () => {
        sessionStorage.removeItem('ada.cloud.emailFlow'); sessionStorage.removeItem('ada.cloud.flow'); status(''); renderStep()
      }, true))
      code.input.focus()
    } else {
      const email = field('Email', 'email', emailValue)
      email.input.autocomplete = 'email'; email.input.placeholder = 'you@example.com'; email.input.required = true
      const send = button('Send code', async () => {
        if (!email.input.reportValidity()) return
        emailValue = email.input.value.trim()
        await start('email', emailValue, !!account)
        renderStep()
      })
      send.dataset.requiresTerms = 'true'
      email.input.onkeydown = event => { if (event.key === 'Enter') { event.preventDefault(); send.click() } }
      fields.append(email.wrapper, send)
    }
    updateAcceptance()
  }
  renderStep()
}

async function approveEditorSignIn() {
  const section = panel('Continue to Ada Editor')
  section.classList.add('cloud-signin')
  section.append(el('p', `Sign in to the editor as ${account?.email || account?.name || 'your Ada account'}.`, 'cloud-signin-description'))
  const agreement = el('label', '', 'cloud-agreement'), checkbox = el('input')
  checkbox.type = 'checkbox'; checkbox.checked = termsAccepted
  const text = el('span'); text.append('I agree to the ', link('Terms of Use', '/legal/terms'))
  agreement.append(checkbox, text)
  const continueButton = button('Continue to Ada Editor', async () => {
    if (!checkbox.checked) throw new Error('Please accept the Terms of Use before continuing.')
    const result = await api('/auth/desktop/complete', 'POST', { requestId: desktopRequestId, legal: { accepted: true, termsVersion: legal.version } })
    const callback = new URL(result.callbackURL)
    if (callback.protocol !== 'adaeditor:' || callback.hostname !== 'cloud' || callback.pathname !== '/callback') throw new Error('Unexpected editor callback')
    sessionStorage.removeItem('ada.cloud.desktop'); desktopRequestId = null
    section.replaceChildren(el('h2', 'Return to Ada Editor'), el('p', 'Your browser will return you to the editor. If it does not open automatically, use the link below.'), link('Open Ada Editor', callback.href))
    window.location.assign(callback.href)
  })
  continueButton.disabled = !termsAccepted
  checkbox.onchange = () => { termsAccepted = checkbox.checked; continueButton.disabled = !termsAccepted }
  section.append(agreement, link('Privacy Policy', '/legal/privacy'), continueButton,
    button('Use another account', async () => { account = null; termsAccepted = false; root.replaceChildren(); signIn() }, true),
    button('Cancel', async () => { sessionStorage.removeItem('ada.cloud.desktop'); desktopRequestId = null; history.replaceState({}, '', '/cloud'); await renderCloud(root.parentElement!) }, true))
}

async function dashboard() {
  if (!account) { if (!availability.cloudServicesAvailable) comingSoon(); signIn(); return }
  const profile = panel('Your account')
  const name = field('Display name', 'text', account.name)
  profile.append(name.wrapper, el('p', account.email ?? ''), button('Save name', async () => { account = await api('/me', 'PATCH', { name: name.input.value }); status('Saved') }))
  const accountID = el('div', '', 'cloud-row')
  accountID.append(el('code', account.id), button('Copy account ID', async () => { await navigator.clipboard.writeText(account!.id); status('Account ID copied.') }, true))
  profile.append(el('p', 'Account ID', 'cloud-muted'), accountID)
  const billing = await api('/billing')
  availability = billing.availability ?? availability
  if (availability.cloudServicesAvailable === true) {
  const plan = panel(billing.pro ? 'Ada Pro' : 'Free')
  plan.append(el('p', billing.pro ? `Paid access until ${new Date(billing.expiresAt * 1000).toLocaleString()}` : 'Sync your editor settings for free. Pro adds web build publishing.'))
  plan.append(el('p', 'Pro: one active build per project · five uploads per day · 10 GB game traffic per month'))
  if (billing.providers?.includes('apple')) plan.append(link('Manage App Store subscription', 'https://apps.apple.com/account/subscriptions'))
  if (billing.webCheckoutAvailable && availability.billingAvailable === true) plan.append(button('Subscribe monthly', async () => { const checkout = await api('/billing/checkout', 'POST', {}); window.location.assign(checkout.url) }))
  else plan.append(el('p', 'Web payments are not available yet. App Store purchases are managed in Ada Editor.', 'cloud-muted'))
  const settings = panel('Editor settings')
  settings.append(button('Show synced settings', async () => {
    const snapshot = await api('/settings'); const pre = el('pre', JSON.stringify(snapshot.values, null, 2)); settings.querySelector('pre')?.remove(); settings.append(pre)
  }, true))
  } else {
    comingSoon()
    // Existing subscriptions remain manageable; projects and builds live in My Projects.
    const management = panel('Existing subscription')
    management.append(link('Manage App Store subscription', 'https://apps.apple.com/account/subscriptions'))
  }
  signIn()
  const sessions = panel('Devices and account access')
  for (const session of await api('/auth/sessions')) {
    if (session.revoked) continue
    const row = el('div', '', 'cloud-row')
    row.append(el('span', `Signed in ${new Date(session.createdAt * 1000).toLocaleString()}`), button('Revoke', async () => { await api(`/auth/sessions/${encodeURIComponent(session.id)}`, 'DELETE'); row.remove() }, true)); sessions.append(row)
  }
  sessions.append(button('Sign out on all devices', async () => { await api('/auth/logout', 'POST', {}); account = null; termsAccepted = false; await renderCloud(root.parentElement!) }, true), button('Delete account', async () => {
    if (!confirm('Delete your account, synced settings and game publications? Subscription cancellation is managed separately with your payment provider.')) return
    await api('/me', 'DELETE'); account = null; termsAccepted = false; await renderCloud(root.parentElement!)
  }, true))
}
async function uploadProjectBuild(section: HTMLElement, project: Json, pro: boolean, currentPublication?: Json) {
  const title = el('div', '', 'cloud-section-heading')
  title.append(el('div', currentPublication ? 'Replace current build' : 'Upload a build'), el('p', 'ZIP from an Ada web export · 300 MB maximum', 'cloud-muted'))
  section.append(title)
  const zip = field('Web build ZIP', 'file'); zip.input.accept = '.zip'
  const modeLabel = el('label', 'Visibility'), mode = el('select')
  for (const [value, label] of [['invite', 'Secret link · 48 hours'], ['catalog', 'Game catalog · 96 hours']]) { const option = el('option', label); option.value = value; mode.append(option) }
  modeLabel.append(mode)
  const progress = el('progress'); progress.max = 100; progress.value = 0; progress.setAttribute('aria-label', 'Upload progress')
  const upload = button('Upload new build', async () => {
    const file = zip.input.files?.[0]
    if (!file || file.size === 0 || file.size > 300_000_000) throw new Error('Select a ZIP up to 300 MB.')
    const pendingKey = `ada.cloud.upload.${account!.id}.${project.id}`
    const previous = JSON.parse(sessionStorage.getItem(pendingKey) ?? 'null')
    const fingerprint = [file.name, file.size, file.lastModified, mode.value, project.id].join(':')
    const operationId = previous?.fingerprint === fingerprint ? previous.operationId : crypto.randomUUID()
    sessionStorage.setItem(pendingKey, JSON.stringify({ fingerprint, operationId }))
    let build = await api('/uploads', 'POST', { operationId, bytes: file.size, mode: mode.value, pageId: project.id })
    if (build.status === 'created') {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest(); xhr.open('PUT', build.uploadURL); xhr.timeout = 600_000
        xhr.upload.onprogress = event => { if (event.lengthComputable) progress.value = event.loaded / event.total * 100 }
        xhr.onload = () => xhr.status < 300 ? resolve() : reject(new Error('Upload failed. Retry to reuse this upload.'))
        xhr.onerror = xhr.ontimeout = () => reject(new Error('Upload interrupted. Retry to reuse this upload.'))
        xhr.send(file)
      })
      build = await api(`/uploads/${build.id}/complete`, 'POST', {})
    }
    status('Checking the archive and preparing your game…')
    const deadline = Date.now() + 30 * 60_000
    while (['queued', 'processing'].includes(build.status) && Date.now() < deadline) { await new Promise(resolve => setTimeout(resolve, 2500)); build = await api(`/uploads/${build.id}`) }
    if (!['ready', 'published'].includes(build.status)) throw new Error(build.error ?? 'Build is not ready yet. You can retry this upload.')
    await api(`/uploads/${build.id}/publish`, 'POST', {})
    sessionStorage.removeItem(pendingKey)
    status('Build published. Replacing a build keeps its link and expiry time.')
    await openProjects(project.id)
  })
  upload.disabled = !pro
  section.append(zip.wrapper, modeLabel, progress, upload)
  if (!pro) section.append(el('p', 'Publishing requires an active Pro subscription.', 'cloud-muted'))
}

async function createProjectForm(host: HTMLElement) {
  const create = el('section', '', 'cloud-panel cloud-project-detail')
  const title = field('Game title'), description = el('textarea'), descriptionLabel = el('label', 'Description'), tags = field('Tags, separated by commas'), cover = field('Cover image', 'file'), shots = field('Screenshots — up to five', 'file')
  descriptionLabel.append(description); cover.input.accept = shots.input.accept = 'image/png,image/jpeg,image/webp'; shots.input.multiple = true
  const heading = el('div', '', 'cloud-project-detail-header')
  const copy = el('div'); copy.append(el('p', 'NEW PROJECT', 'cloud-eyebrow'), el('h2', 'Create a project'), el('p', 'Add its catalog details now. You can upload a playable build after the project is created.', 'cloud-muted'))
  heading.append(copy)
  create.append(heading, title.wrapper, descriptionLabel, tags.wrapper, cover.wrapper, shots.wrapper, button('Create project', async () => {
    const coverFile = cover.input.files?.[0], screenshots = Array.from(shots.input.files ?? [])
    if (!coverFile || screenshots.length > 5 || [coverFile, ...screenshots].some(file => file.size > 5_000_000)) throw new Error('Choose a cover and up to five screenshots, each no larger than 5 MB.')
    const coverMedia = await api('/media', 'POST', coverFile), screenshotIds = []
    for (const file of screenshots) screenshotIds.push((await api('/media', 'POST', file)).id)
    const page = await api('/pages', 'POST', { title: title.input.value, description: description.value, tags: tags.input.value.split(',').map(s => s.trim()).filter(Boolean), cover: coverMedia.id, screenshots: screenshotIds })
    await openProjects(page.id)
  }))
  host.append(create)
}

function openProjects(id?: string) {
  window.location.assign(id ? `/cloud/projects/${encodeURIComponent(id)}` : '/cloud/projects')
}

async function projects() {
  if (!account) { signIn(); return }
  const [pages, publications, billing] = await Promise.all([
    api('/pages'),
    api('/publications'),
    availability.cloudServicesAvailable ? api('/billing') : Promise.resolve({ pro: false }),
  ])
  const requestedID = decodeURIComponent(location.pathname.split('/')[3] ?? '')
  const selected = pages.find((page: Json) => page.id === requestedID) ?? (requestedID ? null : pages[0])
  const layout = el('div', '', 'cloud-projects-layout')
  const sidebar = el('aside', '', 'cloud-panel cloud-projects-sidebar')
  const sidebarHeader = el('div', '', 'cloud-projects-sidebar-header')
  sidebarHeader.append(el('div', `${pages.length} ${pages.length === 1 ? 'project' : 'projects'}`, 'cloud-muted'))
  const createButton = button('New project', async () => { await openProjects('new') })
  createButton.disabled = !availability.cloudServicesAvailable
  sidebarHeader.append(createButton); sidebar.append(sidebarHeader)
  const list = el('div', '', 'cloud-project-list')
  for (const project of pages) {
    const item = link('', `/cloud/projects/${encodeURIComponent(project.id)}`)
    item.className = `cloud-project-list-item${selected?.id === project.id ? ' is-selected' : ''}`
    if (project.cover) { const image = el('img'); image.src = apiBase + '/v1/media/' + encodeURIComponent(project.cover); image.alt = ''; item.append(image) }
    const copy = el('span'); copy.append(el('strong', project.title), el('small', activePublicationForProject(publications, project.id) ? 'Build active' : 'No active build'))
    item.append(copy); list.append(item)
  }
  if (!pages.length) list.append(el('p', 'No projects yet. Create one to upload your first web build.', 'cloud-muted'))
  sidebar.append(list); layout.append(sidebar)
  if (requestedID === 'new') {
    await createProjectForm(layout)
  } else if (selected) {
    const detail = el('section', '', 'cloud-panel cloud-project-detail')
    const header = el('div', '', 'cloud-project-detail-header')
    const identity = el('div')
    identity.append(el('p', 'PROJECT', 'cloud-eyebrow'), el('h2', selected.title), el('p', selected.description, 'cloud-muted'))
    const deleteProject = button('Delete project', async () => {
      if (!confirm(`Delete “${selected.title}” and its current build? This cannot be undone.`)) return
      await api(`/pages/${encodeURIComponent(selected.id)}`, 'DELETE')
      await openProjects()
    }, true)
    deleteProject.classList.add('cloud-danger')
    header.append(identity, deleteProject); detail.append(header)
    if (selected.tags?.length) detail.append(el('p', selected.tags.join(' · '), 'cloud-project-tags'))
    const publication = activePublicationForProject(publications, selected.id)
    const current = el('div', '', 'cloud-current-build')
    current.append(el('div', 'Current build', 'cloud-section-title'))
    if (publication) {
      const summary = el('div', '', 'cloud-build-summary')
      const copy = el('div'); copy.append(el('strong', publication.mode === 'catalog' ? 'Game catalog' : 'Secret link'), el('span', `Available until ${new Date(publication.expiresAt * 1000).toLocaleString()}`, 'cloud-muted'))
      const actions = el('div', '', 'cloud-build-actions')
      const play = link('Open build ↗', String(publication.url)); play.target = '_blank'; play.rel = 'noopener noreferrer'; play.className = 'header-buttons-github cloud-secondary'
      actions.append(play, button('Delete current build', async () => {
        if (!confirm('Delete the current build? The public link will stop working immediately.')) return
        await api(`/publications/${encodeURIComponent(publication.id)}`, 'DELETE')
        await openProjects(selected.id)
      }, true))
      summary.append(copy, actions); current.append(summary)
    } else {
      current.append(el('p', 'No active build. Upload a ZIP to create one.', 'cloud-muted'))
    }
    detail.append(current)
    if (availability.cloudServicesAvailable) await uploadProjectBuild(detail, selected, !!billing.pro, publication)
    else detail.append(el('p', 'New uploads are not available in your region yet. You can still delete this project or its current build.', 'cloud-muted'))
    layout.append(detail)
  } else {
    const empty = el('section', '', 'cloud-panel cloud-project-detail')
    empty.append(el('p', 'MY PROJECTS', 'cloud-eyebrow'), el('h2', 'Create your first project'), el('p', 'Each project keeps its own catalog details and current playable build.', 'cloud-muted'))
    if (availability.cloudServicesAvailable) empty.append(button('Create project', async () => { await openProjects('new') }))
    layout.append(empty)
  }
  root.append(layout)
  const unassigned = publications.filter((publication: Json) => !publication.pageId && !publication.revoked && publication.expiresAt * 1000 > Date.now())
  if (unassigned.length) {
    const legacy = panel('Previous builds')
    legacy.append(el('p', 'These builds were published before projects were introduced. You can keep using or delete them.', 'cloud-muted'))
    for (const publication of unassigned) {
      const row = el('div', '', 'cloud-row')
      row.append(link('Open build', publication.url), el('span', `Available until ${new Date(publication.expiresAt * 1000).toLocaleString()}`), button('Delete build', async () => { await api(`/publications/${encodeURIComponent(publication.id)}`, 'DELETE'); row.remove() }, true))
      legacy.append(row)
    }
  }
}
async function catalog() {
  const id = window.location.pathname.split('/')[2]
  const pages = id ? [await api('/catalog/' + encodeURIComponent(id))] : await api('/catalog')
  const grid = el('div', '', 'cloud-grid'); root.append(grid)
  if (!pages.length) {
    const empty = el('section', '', 'cloud-panel')
    const publish = link('Create a project', '/cloud/projects')
    publish.className = 'header-buttons'
    empty.append(el('h2', 'Public games'), el('p', 'Games published to the catalog will appear here. Secret test links are not listed.'), publish)
    grid.append(empty)
  }
  for (const page of pages) {
    const card = el('article', '', 'cloud-panel')
    if (page.cover) { const image = el('img'); image.src = apiBase + '/v1/media/' + encodeURIComponent(page.cover); image.alt = page.title; image.loading = 'lazy'; card.append(image) }
    card.append(el('h2', page.title), el('p', `Author: ${page.owner}`, 'cloud-muted'), el('p', page.description), el('p', (page.tags ?? []).join(' · '), 'cloud-muted'))
    const pub = page.publication
    if (pub && !pub.revoked && pub.expiresAt * 1000 > Date.now()) { const play = link('Play game ↗', pub.url); play.target = '_blank'; play.rel = 'noopener noreferrer'; card.append(play, el('p', `Test ends ${new Date(pub.expiresAt * 1000).toLocaleString()}`)) }
    else card.append(el('p', 'This test has ended. The game page remains available.'))
    card.append(link('Game page', '/games/' + page.id), el('p', `${page.likes ?? 0} likes`))
    if (id) for (const media of page.screenshots ?? []) { const image = el('img'); image.src = apiBase + '/v1/media/' + encodeURIComponent(media); image.alt = `${page.title} screenshot`; card.append(image) }
    if (account) card.append(button('Like', async () => { const value = await api(`/catalog/${page.id}/like`, 'PUT', { liked: true }); status(`${value.likes} likes`) }, true), button('Remove like', async () => { await api(`/catalog/${page.id}/like`, 'PUT', { liked: false }); status('Like removed') }, true), button('Report', async () => { const reason = prompt('Describe the problem with this game'); if (reason) { await api(`/catalog/${page.id}/reports`, 'POST', { reason }); status('Report sent') } }, true))
    grid.append(card)
  }
}
async function admin() {
  if (!account?.isAdmin) { panel('Administrator access required'); return }
  if (account.testAccessRestricted) await renderTestAccess(panel('Test environment access'), api, status)
  const section = panel('Game reports')
  for (const report of await api('/admin/reports')) {
    const row = el('article'); row.append(el('p', report.reason), link('Game page', '/games/' + report.pageId), button('Block game', async () => { await api(`/admin/pages/${report.pageId}/block`, 'POST', {}); row.append(el('p', 'Blocked')) }, true)); section.append(row)
  }
}
export async function renderCloud(container: HTMLElement, renderHeader?: () => string, setupNavigation?: () => void) {
  if (renderHeader) siteHeader = renderHeader
  if (setupNavigation) initializeSiteNavigation = setupNavigation
  container.replaceChildren(); container.className = 'ada-cloud'
  // Reuse the actual site header, including its logo, navigation and mobile menu.
  container.insertAdjacentHTML('afterbegin', siteHeader())
  initializeSiteNavigation()
  const context = el('div', '', 'cloud-context container content-restriction')
  const nav = el('nav', '', 'cloud-navigation'); nav.setAttribute('aria-label', 'Cloud navigation')
  const accountLink = link('Account', '/cloud'), projectsLink = link('My Projects', '/cloud/projects'), catalogLink = link('Game catalog', '/games')
  for (const item of [accountLink, projectsLink, catalogLink]) item.className = 'navigation-item-link'
  const active = location.pathname.startsWith('/games') ? catalogLink : location.pathname.startsWith('/cloud/projects') ? projectsLink : accountLink
  active.classList.add('is-active'); active.setAttribute('aria-current', 'page')
  nav.append(accountLink, projectsLink, catalogLink); context.append(el('h1', 'Cloud'), nav)
  root = el('main', '', 'cloud-main container content-restriction'); notice = el('p', '', 'cloud-notice container content-restriction'); notice.setAttribute('role', 'status'); notice.setAttribute('aria-live', 'polite')
  container.append(context, notice, root); document.title = 'Ada Cloud'
  try {
    const parameters = new URLSearchParams(location.search)
    const incomingDesktop = parameters.get('desktop')
    if (incomingDesktop && /^[A-Za-z0-9_-]{43}$/.test(incomingDesktop)) sessionStorage.setItem('ada.cloud.desktop', incomingDesktop)
    desktopRequestId = sessionStorage.getItem('ada.cloud.desktop')
    const code = parameters.get('code')
    if (code) {
      await api('/auth/exchange', 'POST', { code, verifier: sessionStorage.getItem('ada.cloud.pkce') })
      sessionStorage.removeItem('ada.cloud.pkce'); history.replaceState({}, '', '/cloud')
    }
    legal = await api('/legal').then(value => ({ ...draftLegal, ...Object.fromEntries(Object.entries(value).filter(([, v]) => v !== '')) })).catch(() => draftLegal)
    if (location.pathname.startsWith('/legal/')) {
      const document = legalDocument(location.pathname.split('/')[2], legal)
      const content = panel(document.title); content.classList.add('cloud-legal-document'); content.lang = 'ru'
      content.append(el('p', `${draftLegal.version} · ${legal.version === draftLegal.version && legal.status === 'published' ? 'Published' : 'Проект — не вступил в силу'}`, 'cloud-muted'))
      for (const part of document.sections) { const block = el('section'); block.append(el('h3', part.title), el('p', part.text)); content.append(block) }
      content.append(link('Back to sign in', '/cloud'))
      return
    }
    availability = await api('/availability').catch(() => ({ cloudServicesAvailable: false, billingAvailable: false }))
    account = await api('/me').catch(() => null)
    if (account && sessionStorage.getItem('ada.store.return') === '1' && location.pathname === '/cloud' && !desktopRequestId) {
      sessionStorage.removeItem('ada.store.return'); location.replace('/store'); return
    }
    if (account?.isAdmin) {
      const adminLink = link('Admin', '/cloud/admin'); adminLink.className = 'navigation-item-link'
      if (location.pathname === '/cloud/admin') { active.classList.remove('is-active'); active.removeAttribute('aria-current'); adminLink.classList.add('is-active'); adminLink.setAttribute('aria-current', 'page') }
      nav.append(adminLink)
    }
    if (desktopRequestId && location.pathname === '/cloud') {
      try { await api('/auth/desktop/' + encodeURIComponent(desktopRequestId)) }
      catch {
        const expired = panel('Editor sign-in is unavailable')
        expired.append(el('p', 'The request may have expired. Start sign-in again from Ada Editor.'), button('Go to account', async () => {
          sessionStorage.removeItem('ada.cloud.desktop'); desktopRequestId = null; history.replaceState({}, '', '/cloud'); await renderCloud(root.parentElement!)
        }, true))
        return
      }
      if (account) await approveEditorSignIn()
      else signIn()
      return
    }
    if (location.pathname.startsWith('/games')) await catalog()
    else if (location.pathname.startsWith('/cloud/projects')) await projects()
    else if (location.pathname === '/cloud/admin') await admin()
    else await dashboard()
  } catch (error) { status(error instanceof Error ? error.message : 'Cloud is temporarily unavailable') }
}
