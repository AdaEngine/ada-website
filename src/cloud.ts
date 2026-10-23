import { tr, errorText, sentence, textAttribute, computedAttribute, setText, cloudMessage, cloudLanguage, CloudPanelError, configureCloudLocalization, refreshCloudTranslations, type CloudText, type CloudTranslate } from './cloudLocalization'
import './cloud.css'
import { getLocale, localizedNavigation, message as siteMessage, withoutLocale } from './localization'
import { draftLegal, legalDocument, type LegalMetadata } from './cloudLegal'
import { activePublicationForProject, publicationAvailable } from './cloudProjects'
import { renderTestAccess } from './cloudTestAccess'
import { rememberPlaygroundReturn, takePlaygroundReturn, clearPlaygroundReturn } from './cloudReturn'
import { playgroundURL } from './routing'
import { restoreBrowserSession } from './browserSSO'

type Json = { [key: string]: any }
const apiBase = (import.meta.env.VITE_CLOUD_API_URL as string | undefined) ?? ''
type PanelOptions = { translate?: CloudTranslate; getLanguage?: () => string; onNavigate: (path: string, options?: { replace?: boolean }) => Promise<void>; onAuthenticated?: (account: Json | null) => Promise<void> }
let embedded: PanelOptions | undefined
let panelRequests: AbortController | undefined
let renderEpoch = 0
function cloudPath() {
  const current = withoutLocale(location.pathname)
  const path = current === '/' && /^cloud(?:-test)?\./.test(location.hostname) ? '/cloud' : current
  return path.replace(/^\/account(?=\/|$)/, '/cloud').replace(/^\/publications(?=\/|$)/, '/cloud/projects')
}
function panelURL(path: string) {
  return embedded ? path.replace(/^\/cloud\/projects(?=\/|$)/, '/publications').replace(/^\/cloud(?=[?/#]|$)/, '/account') : path.startsWith('/') && !path.startsWith('//') ? localizedNavigation(path, getLocale(), new URLSearchParams(location.search).get('lang')) : path
}
async function navigateCloud(path: string, replace = false) {
  if (embedded) await embedded.onNavigate(panelURL(path), { replace })
  else if (replace) location.replace(panelURL(path))
  else location.assign(panelURL(path))
}
let account: Json | null = null
let root: HTMLElement
let notice: HTMLElement
let refreshing: Promise<void> | null = null
let siteHeader: () => string
let initializeSiteNavigation: () => void
let siteFooter: (() => string) | undefined
let legal: LegalMetadata = draftLegal
let authenticatedCallback: (() => Promise<void>) | undefined
const operatorSignIn = !!import.meta.env.VITE_OPERATOR_CONSOLE
const standaloneSite = !!import.meta.env.VITE_CLOUD_STANDALONE_SITE
let termsAccepted = operatorSignIn
let desktopRequestId: string | null = null
let availability: Json = { cloudServicesAvailable: false, billingAvailable: false }

function comingSoon() {
  const section = panel(tr("Cloud Services will open soon."))
  section.classList.add('cloud-coming-soon')
  section.append(el('p', tr("Cloud Services are launching in selected countries first. You can create an account now. Payments, settings sync and publishing will become available when we launch in your region.")))
}

async function api(path: string, method = 'GET', body?: unknown, retry = true): Promise<any> {
  const response = await fetch(apiBase + '/v1' + path, {
    method, credentials: 'include', signal: panelRequests?.signal, headers: body instanceof File ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : body instanceof File ? body : JSON.stringify(body),
  })
  if (response.status === 401 && retry && !path.startsWith('/auth/')) {
    refreshing ??= api('/auth/refresh', 'POST', {}, false).then(() => {}).catch(async error => {
      if (operatorSignIn || error.status !== 401 || !await restoreBrowserSession(apiBase, panelRequests?.signal)) throw error
    }).finally(() => { refreshing = null })
    await refreshing
    return api(path, method, body, false)
  }
  if (response.status === 204) return null
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    const retry = Number(response.headers.get('Retry-After') ?? 0)
    const fallback = response.status >= 500 ? cloudMessage('Cloud is temporarily unavailable. Please try again.') : cloudMessage('Request failed ({0})', response.status)
    throw Object.assign(new Error((result.error?.message ?? fallback) + (retry > 0 ? cloudMessage(' Try again in {0} min.', Math.ceil(retry / 60)) : '')), { status: response.status })
  }
  return result
}
function el<K extends keyof HTMLElementTagNameMap>(tag: K, text: CloudText = '', className = ''): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag); node.append(text); node.className = className; return node
}
function link(label: CloudText, href: string): HTMLAnchorElement { const node = el('a', label); node.href = panelURL(href); return node }
function nativePreviewURL(preview: Json, title: string) {
  return 'adaeditor://community/preview?' + new URLSearchParams({ url: preview.url, game: preview.pageId, release: preview.uploadId, api: String(preview.runtime?.apiVersion ?? 1), title }).toString()
}
function status(message: CloudText) { setText(notice, message) }
function button(label: CloudText, action: () => Promise<void>, secondary = false) {
  const node = el('button', label, secondary ? 'header-buttons-github cloud-secondary' : 'header-buttons')
  node.type = 'button'
  node.onclick = async () => {
    node.disabled = true; status('')
    try { await action() } catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) status(errorText(error)) }
    finally { node.disabled = false }
  }
  return node
}
function field(label: CloudText, type = 'text', value = '') {
  const wrapper = el('label', label), input = el('input'); input.type = type; input.value = value; wrapper.append(input)
  return { wrapper, input }
}
function panel(title: CloudText) { const section = el('section', '', 'cloud-panel'); section.append(el('h2', title)); root.append(section); return section }
function base64url(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '') }
async function pkce() {
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)))
  const challenge = base64url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))))
  return { verifier, challenge }
}
async function start(provider: string, email?: string, linking = false) {
  if (!termsAccepted) throw new CloudPanelError("Please accept the Terms of Use before continuing.")
  const proof = await pkce()
  sessionStorage.setItem('ada.cloud.pkce', proof.verifier)
  const flow = await api('/auth/start', 'POST', { provider, email, challenge: proof.challenge, client: 'web', link: linking, legal: operatorSignIn ? undefined : { accepted: true, termsVersion: legal.version } })
  if (flow.authorizeURL) { window.location.assign(flow.authorizeURL); return }
  sessionStorage.setItem('ada.cloud.flow', flow.flowId)
  sessionStorage.setItem('ada.cloud.emailFlow', JSON.stringify({ flowId: flow.flowId, verifier: proof.verifier, email, expiresAt: Date.now() + 600_000 }))
  status(tr("Code sent. Check your email."))
}
function providerButton(provider: 'apple' | 'google') {
  const label = provider === 'apple' ? tr('Sign in with Apple') : tr('Sign in with Google')
  const node = button(label, () => start(provider, undefined, !!account))
  node.className = `cloud-provider cloud-provider-${provider}`
  textAttribute(node, 'aria-label', label)
  const image = el('img')
  image.alt = ''
  if (provider === 'apple') {
    computedAttribute(image, 'src', () => `${import.meta.env.BASE_URL}images/auth/apple-sign-in-white${cloudLanguage() === 'ru' ? '-ru' : ''}.png`)
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
  const section = panel(account ? tr("Link another sign-in method") : desktopRequestId ? tr("Sign in to Ada Editor") : tr("Sign in to Ada"))
  section.classList.add(account ? 'cloud-link-identity' : 'cloud-signin')
  if (window.location.hostname.startsWith('store') || sessionStorage.getItem('ada.store.return')) section.append(link(tr("Return to Ada Store →"), '/store'))
  if (operatorSignIn) section.append(el('p', tr("Only existing organization operators can sign in."), 'cloud-signin-description'))
  else if (!account) section.append(el('p', availability.registrationRestricted ? tr("This test environment is invite-only. Ask an administrator to grant access to your account ID or email.") : availability.cloudServicesAvailable ? tr("Your editor settings and shared games, in one account.") : tr("Create your Ada account. Cloud Services will open soon in your region."), 'cloud-signin-description'))
  const actions = el('div', '', 'cloud-provider-actions')
  const apple = providerButton('apple'), google = providerButton('google')
  actions.append(apple, google)
  const divider = el('div', tr("or continue with email"), 'cloud-auth-divider')
  const fields = el('div', '', 'cloud-auth-fields')
  const agreement = el('label', '', 'cloud-agreement'), checkbox = el('input')
  checkbox.type = 'checkbox'; checkbox.checked = termsAccepted
  const agreementText = el('span'); agreementText.append(sentence('I agree to the {0}', link(tr("Terms of Use"), '/legal/terms')))
  agreement.append(checkbox, agreementText)
  const privacy = el('p', '', 'cloud-legal-note')
  privacy.append(sentence('How we handle personal data: {0} · {1}', link(tr("Privacy Policy"), '/legal/privacy'), link(tr("GDPR rights"), '/legal/gdpr')))
  const draft = el('p', tr("Draft legal documents — preview only, not yet effective."), 'cloud-legal-note')
  draft.hidden = legal.status === 'published'
  section.append(actions, divider, fields)
  if (!operatorSignIn) section.append(agreement, privacy, draft)
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
      const code = field(tr("OTP Code"), 'text')
      code.input.autocomplete = 'one-time-code'; code.input.inputMode = 'numeric'; code.input.maxLength = 6; code.input.pattern = '[0-9]{6}'; code.input.placeholder = '000000'; code.input.required = true
      const verify = button(tr("Verify code"), async () => {
        if (!code.input.reportValidity()) return
        await api('/auth/email/verify', 'POST', { flowId: flow.flowId, verifier: flow.verifier, code: code.input.value })
        for (const key of ['ada.cloud.flow', 'ada.cloud.pkce', 'ada.cloud.emailFlow']) sessionStorage.removeItem(key)
        await renderCloud(root.parentElement!)
      })
      verify.dataset.requiresTerms = 'true'
      code.input.onkeydown = event => { if (event.key === 'Enter') { event.preventDefault(); verify.click() } }
      fields.append(el('p', tr("Enter the code sent to {0}.", () => (flow.email)), 'cloud-muted'))
      fields.append(code.wrapper, verify, button(tr("Change email"), async () => {
        sessionStorage.removeItem('ada.cloud.emailFlow'); sessionStorage.removeItem('ada.cloud.flow'); status(''); renderStep()
      }, true))
      code.input.focus()
    } else {
      const email = field(tr("Email"), 'email', emailValue)
      email.input.autocomplete = 'email'; email.input.placeholder = 'you@example.com'; email.input.required = true
      const send = button(tr("Send code"), async () => {
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
  const section = panel(tr("Continue to Ada Editor"))
  section.classList.add('cloud-signin')
  section.append(el('p', tr("Sign in to the editor as {0}.", () => (account?.email || account?.name || cloudMessage('your Ada account'))), 'cloud-signin-description'))
  const agreement = el('label', '', 'cloud-agreement'), checkbox = el('input')
  checkbox.type = 'checkbox'; checkbox.checked = termsAccepted
  const text = el('span'); text.append(sentence('I agree to the {0}', link(tr("Terms of Use"), '/legal/terms')))
  agreement.append(checkbox, text)
  const continueButton = button(tr("Continue to Ada Editor"), async () => {
    if (!checkbox.checked) throw new CloudPanelError("Please accept the Terms of Use before continuing.")
    const result = await api('/auth/desktop/complete', 'POST', { requestId: desktopRequestId, legal: { accepted: true, termsVersion: legal.version } })
    const callback = new URL(result.callbackURL)
    if (callback.protocol !== 'adaeditor:' || callback.hostname !== 'cloud' || callback.pathname !== '/callback') throw new CloudPanelError("Unexpected editor callback")
    sessionStorage.removeItem('ada.cloud.desktop'); desktopRequestId = null
    section.replaceChildren(el('h2', tr("Return to Ada Editor")), el('p', tr("Your browser will return you to the editor. If it does not open automatically, use the link below.")), link(tr("Open Ada Editor"), callback.href))
    window.location.assign(callback.href)
  })
  continueButton.disabled = !termsAccepted
  checkbox.onchange = () => { termsAccepted = checkbox.checked; continueButton.disabled = !termsAccepted }
  section.append(agreement, link(tr("Privacy Policy"), '/legal/privacy'), continueButton,
    button(tr("Use another account"), async () => { account = null; termsAccepted = false; root.replaceChildren(); signIn() }, true),
    button(tr("Cancel"), async () => { sessionStorage.removeItem('ada.cloud.desktop'); desktopRequestId = null; history.replaceState({}, '', panelURL('/cloud')); await renderCloud(root.parentElement!) }, true))
}

async function dashboard() {
  if (!account) { if (!availability.cloudServicesAvailable) comingSoon(); signIn(); return }
  const profile = panel(tr("Your account"))
  const name = field(tr("Display name"), 'text', account.name)
  profile.append(name.wrapper, el('p', account.email ?? ''), button(tr("Save name"), async () => { account = await api('/me', 'PATCH', { name: name.input.value }); status(tr("Saved")) }))
  const accountID = el('div', '', 'cloud-row')
  accountID.append(el('code', account.id), button(tr("Copy account ID"), async () => { await navigator.clipboard.writeText(account!.id); status(tr("Account ID copied.")) }, true))
  profile.append(el('p', tr("Account ID"), 'cloud-muted'), accountID)
  const billing = await api('/billing')
  availability = billing.availability ?? availability
  if (availability.cloudServicesAvailable === true) {
  const plan = panel(billing.pro ? tr("Ada Pro") : tr("Free"))
  plan.append(el('p', billing.pro ? tr("Paid access until {0}", () => (new Date(billing.expiresAt * 1000).toLocaleString(cloudLanguage()))) : tr("Sync your editor settings for free. Pro adds web build publishing.")))
  plan.append(el('p', tr("Pro: one active build per project · five uploads per day · 10 GB game traffic per month")))
  if (billing.providers?.includes('apple')) plan.append(link(tr("Manage App Store subscription"), 'https://apps.apple.com/account/subscriptions'))
  if (billing.webCheckoutAvailable && availability.billingAvailable === true) plan.append(button(tr("Subscribe monthly"), async () => { const checkout = await api('/billing/checkout', 'POST', {}); window.location.assign(checkout.url) }))
  else plan.append(el('p', tr("Web payments are not available yet. App Store purchases are managed in Ada Editor."), 'cloud-muted'))
  const settings = panel(tr("Editor settings"))
  settings.append(button(tr("Show synced settings"), async () => {
    const snapshot = await api('/settings'); const pre = el('pre', JSON.stringify(snapshot.values, null, 2)); settings.querySelector('pre')?.remove(); settings.append(pre)
  }, true))
  } else {
    comingSoon()
    // Existing subscriptions remain manageable; projects and builds live in My Projects.
    const management = panel(tr("Existing subscription"))
    management.append(link(tr("Manage App Store subscription"), 'https://apps.apple.com/account/subscriptions'))
  }
  signIn()
  const sessions = panel(tr("Devices and account access"))
  for (const session of await api('/auth/sessions')) {
    if (session.revoked) continue
    const row = el('div', '', 'cloud-row')
    row.append(el('span', tr("Signed in {0}", () => (new Date(session.createdAt * 1000).toLocaleString(cloudLanguage())))), button(tr("Revoke"), async () => { await api(`/auth/sessions/${encodeURIComponent(session.id)}`, 'DELETE'); row.remove() }, true)); sessions.append(row)
  }
  sessions.append(button(tr("Sign out on all devices"), async () => { await api('/auth/logout', 'POST', {}); account = null; termsAccepted = false; await renderCloud(root.parentElement!) }, true), button(tr("Delete account"), async () => {
    if (!confirm(cloudMessage('Delete your account, synced settings and game publications? Subscription cancellation is managed separately with your payment provider.'))) return
    await api('/me', 'DELETE'); account = null; termsAccepted = false; await renderCloud(root.parentElement!)
  }, true))
}
async function uploadProjectBuild(section: HTMLElement, project: Json, pro: boolean) {
  const title = el('div', '', 'cloud-section-heading')
  title.append(el('div', tr("Upload a new version")), el('p', tr("Web game ZIP or AdaScript game package · 300 MB maximum"), 'cloud-muted'))
  section.append(title)
  const zip = field(tr("Game package ZIP"), 'file'); zip.input.accept = '.zip'
  const modeLabel = el('label', tr("Visibility")), mode = el('select')
  for (const [value, label] of [['ugc', tr('Permanent game · reviewed before publishing')] as const, ['invite', tr('Secret link · 48 hours')] as const, ['catalog', tr('Temporary catalog test · 96 hours')] as const]) { const option = el('option', label); option.value = value; mode.append(option) }
  modeLabel.append(mode)
  const progress = el('progress'); progress.max = 100; progress.value = 0; textAttribute(progress, 'aria-label', tr("Upload progress"))
  const upload = button(tr("Upload new build"), async () => {
    const file = zip.input.files?.[0]
    if (!file || file.size === 0 || file.size > 300_000_000) throw new CloudPanelError("Select a ZIP up to 300 MB.")
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
        xhr.onload = () => xhr.status < 300 ? resolve() : reject(new CloudPanelError("Upload failed. Retry to reuse this upload."))
        xhr.onerror = xhr.ontimeout = () => reject(new CloudPanelError("Upload interrupted. Retry to reuse this upload."))
        xhr.send(file)
      })
      build = await api(`/uploads/${build.id}/complete`, 'POST', {})
    }
    status(tr("Checking the archive and preparing your game…"))
    const deadline = Date.now() + 30 * 60_000
    while (['queued', 'processing'].includes(build.status) && Date.now() < deadline) { await new Promise(resolve => setTimeout(resolve, 2500)); build = await api(`/uploads/${build.id}`) }
    if (!['ready', 'published', 'submitted'].includes(build.status)) throw new Error(build.error ?? cloudMessage('Build is not ready yet. You can retry this upload.'))
    await api(`/uploads/${build.id}/publish`, 'POST', {})
    sessionStorage.removeItem(pendingKey)
    status(mode.value === 'ugc' ? tr("Version submitted for review. Your approved version stays available while this one is checked.") : tr("Build published. Replacing a temporary build keeps its link and expiry time."))
    await openProjects(project.id)
  })
  upload.disabled = !pro
  section.append(zip.wrapper, modeLabel, progress, upload)
  if (!pro) section.append(el('p', tr("Publishing requires an active Pro subscription."), 'cloud-muted'))
}

async function createProjectForm(host: HTMLElement) {
  const create = el('section', '', 'cloud-panel cloud-project-detail')
  const title = field(tr("Game title")), description = el('textarea'), descriptionLabel = el('label', tr("Description")), tags = field(tr("Tags, separated by commas")), cover = field(tr("Cover image"), 'file'), shots = field(tr("Screenshots — up to five"), 'file')
  descriptionLabel.append(description); cover.input.accept = shots.input.accept = 'image/png,image/jpeg,image/webp'; shots.input.multiple = true
  const heading = el('div', '', 'cloud-project-detail-header')
  const copy = el('div'); copy.append(el('p', tr("NEW GAME PAGE"), 'cloud-eyebrow'), el('h2', tr("Create a game page")), el('p', tr("Add its catalog details now. You can upload a playable build after the project is created."), 'cloud-muted'))
  heading.append(copy)
  create.append(heading, title.wrapper, descriptionLabel, tags.wrapper, cover.wrapper, shots.wrapper, button(tr("Create game page"), async () => {
    const coverFile = cover.input.files?.[0], screenshots = Array.from(shots.input.files ?? [])
    if (!coverFile || screenshots.length > 5 || [coverFile, ...screenshots].some(file => file.size > 5_000_000)) throw new CloudPanelError("Choose a cover and up to five screenshots, each no larger than 5 MB.")
    const coverMedia = await api('/media', 'POST', coverFile), screenshotIds = []
    for (const file of screenshots) screenshotIds.push((await api('/media', 'POST', file)).id)
    const page = await api('/pages', 'POST', { title: title.input.value, description: description.value, tags: tags.input.value.split(',').map(s => s.trim()).filter(Boolean), cover: coverMedia.id, screenshots: screenshotIds })
    await openProjects(page.id)
  }))
  host.append(create)
}

function openProjects(id?: string) {
  return navigateCloud(id ? `/cloud/projects/${encodeURIComponent(id)}` : '/cloud/projects')
}

async function projects() {
  if (!account) { rememberPlaygroundReturn(sessionStorage, cloudPath()); signIn(); return }
  const [pages, publications, billing] = await Promise.all([
    api('/pages'),
    api('/publications'),
    availability.cloudServicesAvailable ? api('/billing') : Promise.resolve({ pro: false }),
  ])
  const requestedID = decodeURIComponent(cloudPath().split('/')[3] ?? '')
  const selected = pages.find((page: Json) => page.id === requestedID) ?? (requestedID ? null : pages[0])
  const layout = el('div', '', 'cloud-projects-layout')
  const sidebar = el('aside', '', 'cloud-panel cloud-projects-sidebar')
  const sidebarHeader = el('div', '', 'cloud-projects-sidebar-header')
  sidebarHeader.append(el('div', tr("Game pages: {0}", () => pages.length), 'cloud-muted'))
  const createButton = button(tr("New game page"), async () => { await openProjects('new') })
  createButton.disabled = !availability.cloudServicesAvailable
  sidebarHeader.append(createButton); sidebar.append(sidebarHeader)
  const list = el('div', '', 'cloud-project-list')
  for (const project of pages) {
    const item = link('', `/cloud/projects/${encodeURIComponent(project.id)}`)
    item.className = `cloud-project-list-item${selected?.id === project.id ? ' is-selected' : ''}`
    if (project.cover) { const image = el('img'); image.src = apiBase + '/v1/media/' + encodeURIComponent(project.cover); image.alt = ''; item.append(image) }
    const copy = el('span'); copy.append(el('strong', project.title), el('small', activePublicationForProject(publications, project.id) ? tr("Build active") : tr("No active build")))
    item.append(copy); list.append(item)
  }
  if (!pages.length) list.append(el('p', tr("No game pages yet. Create one to upload your first public build."), 'cloud-muted'))
  sidebar.append(list); layout.append(sidebar)
  if (requestedID === 'new') {
    await createProjectForm(layout)
  } else if (selected) {
    const detail = el('section', '', 'cloud-panel cloud-project-detail')
    const header = el('div', '', 'cloud-project-detail-header')
    const identity = el('div')
    identity.append(el('p', tr("PROJECT"), 'cloud-eyebrow'), el('h2', selected.title), el('p', selected.description, 'cloud-muted'))
    const deleteProject = button(tr("Delete game page"), async () => {
      if (!confirm(`Delete “${selected.title}” and all its versions? This cannot be undone.`)) return
      await api(`/pages/${encodeURIComponent(selected.id)}`, 'DELETE')
      await openProjects()
    }, true)
    deleteProject.classList.add('cloud-danger')
    header.append(identity, deleteProject); detail.append(header)
    if (selected.tags?.length) detail.append(el('p', selected.tags.join(' · '), 'cloud-project-tags'))
    const publication = activePublicationForProject(publications, selected.id)
    const current = el('div', '', 'cloud-current-build')
    current.append(el('div', tr("Current build"), 'cloud-section-title'))
    if (publication) {
      const summary = el('div', '', 'cloud-build-summary')
      const copy = el('div'); copy.append(el('strong', publication.mode === 'ugc' ? tr("Permanent game · version {0}", () => (publication.releaseNumber)) : publication.mode === 'catalog' ? tr("Game catalog test") : tr("Secret link")), el('span', publication.mode === 'ugc' ? tr("Available until you unpublish it") : tr("Available until {0}", () => (new Date((publication.expiresAt ?? 0) * 1000).toLocaleString(cloudLanguage()))), 'cloud-muted'))
      const actions = el('div', '', 'cloud-build-actions')
      const play = link(publication.runtime?.kind === 'adascript' ? tr("Play in Ada Studio ↗") : tr("Open build ↗"), publication.runtime?.kind === 'adascript' ? nativePreviewURL(publication, String(selected.title ?? cloudMessage('Game'))) : String(publication.url)); play.target = '_blank'; play.rel = 'noopener noreferrer'; play.className = 'header-buttons-github cloud-secondary'
      actions.append(play, button(publication.mode === 'ugc' ? tr("Unpublish game") : tr("Delete current build"), async () => {
        if (!confirm(cloudMessage('Delete the current build? The public link will stop working immediately.'))) return
        await api(`/publications/${encodeURIComponent(publication.id)}`, 'DELETE')
        await openProjects(selected.id)
      }, true))
      summary.append(copy, actions); current.append(summary)
    } else {
      current.append(el('p', tr("No active build. Upload a ZIP to create one."), 'cloud-muted'))
    }
    detail.append(current)
    await releaseHistory(detail, selected, publication)
    if (availability.cloudServicesAvailable) await uploadProjectBuild(detail, selected, !!billing.pro)
    else detail.append(el('p', tr("New uploads are not available in your region yet. You can still delete this project or its current build."), 'cloud-muted'))
    layout.append(detail)
  } else {
    const empty = el('section', '', 'cloud-panel cloud-project-detail')
    empty.append(el('p', tr("PUBLICATIONS"), 'cloud-eyebrow'), el('h2', tr("Create your first game page")), el('p', tr("Each game page keeps its catalog details and public releases."), 'cloud-muted'))
    if (availability.cloudServicesAvailable) empty.append(button(tr("Create game page"), async () => { await openProjects('new') }))
    layout.append(empty)
  }
  root.append(layout)
  const unassigned = publications.filter((publication: Json) => !publication.pageId && !publication.revoked && (publication.expiresAt ?? 0) * 1000 > Date.now())
  if (unassigned.length) {
    const legacy = panel(tr("Previous builds"))
    legacy.append(el('p', tr("These builds were published before projects were introduced. You can keep using or delete them."), 'cloud-muted'))
    for (const publication of unassigned) {
      const row = el('div', '', 'cloud-row')
      row.append(link(publication.runtime?.kind === 'adascript' ? tr("Play in Ada Studio") : tr("Open build"), publication.runtime?.kind === 'adascript' ? nativePreviewURL(publication, cloudMessage('Game')) : publication.url), el('span', tr("Available until {0}", () => (new Date((publication.expiresAt ?? 0) * 1000).toLocaleString(cloudLanguage())))), button(tr("Delete build"), async () => { await api(`/publications/${encodeURIComponent(publication.id)}`, 'DELETE'); row.remove() }, true))
      legacy.append(row)
    }
  }
}
async function catalog() {
  if (standaloneSite) {
    // Preserve the deployed Cloud catalog until that host moves to Studio.
    const id = cloudPath().split('/')[2]
    const pages = id ? [await api('/catalog/' + encodeURIComponent(id))] : await api('/catalog')
    const grid = el('div', '', 'cloud-grid'); root.append(grid)
    if (!pages.length) {
      const empty = el('section', '', 'cloud-panel')
      const publish = link(siteMessage('Create a project'), '/cloud/projects'); publish.className = 'header-buttons'
      empty.append(el('h2', siteMessage('Public games')), el('p', siteMessage('Games published to the catalog will appear here. Secret test links are not listed.')), publish)
      grid.append(empty)
    }
    for (const page of pages) {
      const card = el('article', '', 'cloud-panel')
      if (page.cover) { const image = el('img'); image.src = apiBase + '/v1/media/' + encodeURIComponent(page.cover); image.alt = page.title; image.loading = 'lazy'; card.append(image) }
      card.append(el('h2', page.title), el('p', siteMessage('Author: {0}', page.owner), 'cloud-muted'), el('p', page.description), el('p', (page.tags ?? []).join(' · '), 'cloud-muted'))
      const pub = page.publication
      if (pub && publicationAvailable(pub)) {
        const play = link(siteMessage('Play game ↗'), pub.url); play.target = '_blank'; play.rel = 'noopener noreferrer'
        card.append(play, el('p', pub.mode === 'ugc' ? siteMessage('Version {0} · reviewed', pub.releaseNumber) : siteMessage('Test ends {0}', new Date(pub.expiresAt * 1000).toLocaleString(getLocale()))))
      } else card.append(el('p', siteMessage('This test has ended. The game page remains available.')))
      card.append(link(siteMessage('Game page'), '/games/' + page.id), el('p', siteMessage('{0} likes', page.likes ?? 0)))
      if (id) for (const media of page.screenshots ?? []) { const image = el('img'); image.src = apiBase + '/v1/media/' + encodeURIComponent(media); image.alt = page.title; card.append(image) }
      if (account) card.append(
        button(siteMessage('Like'), async () => { const value = await api(`/catalog/${page.id}/like`, 'PUT', { liked: true }); status(siteMessage('{0} likes', value.likes)) }, true),
        button(siteMessage('Remove like'), async () => { await api(`/catalog/${page.id}/like`, 'PUT', { liked: false }); status(siteMessage('Like removed')) }, true),
        button(siteMessage('Report'), async () => { const reason = prompt(siteMessage('Describe the problem with this game')); if (reason) { await api(`/catalog/${page.id}/reports`, 'POST', { reason }); status(siteMessage('Report sent')) } }, true),
      )
      grid.append(card)
    }
    return
  }
  // Legacy marketing/Store callers hand public navigation to the canonical app.
  const origin = playgroundURL(location.hostname, import.meta.env.VITE_PLAYGROUND_ORIGIN as string | undefined)
  location.replace(new URL(location.pathname + location.search + location.hash, origin).href)
}
async function releaseHistory(host: HTMLElement, project: Json, publication?: Json) {
  const releases: Json[] = await api(`/game-releases?pageId=${encodeURIComponent(project.id)}`)
  if (!releases.length) return
  const heading = el('div', '', 'cloud-section-heading'); heading.append(el('div', tr("Permanent versions")), el('p', tr("Only approved versions can go live. You can restore a previous approved version."), 'cloud-muted')); host.append(heading)
  for (const release of releases) {
    const row = el('div', '', 'cloud-row')
    const active = publication?.releaseId === release.id
    const copy = el('div'); copy.append(el('strong', tr("Version {0} · {1}", () => (release.number), () => (active ? cloudMessage("live") : release.status === 'pending' ? cloudMessage("awaiting review") : release.status === 'approved' ? cloudMessage('approved') : release.status === 'rejected' ? cloudMessage('rejected') : release.status))), el('p', tr('Created {0}', () => new Date(release.createdAt * 1000).toLocaleString(cloudLanguage())), 'cloud-muted'))
    if (release.reason) copy.append(el('p', release.reason))
    row.append(copy)
    if (['pending', 'approved'].includes(release.status)) {
      row.append(button(tr("Create preview link"), async () => {
        const preview = await api(`/game-releases/${release.id}/preview`, 'POST', {})
        const open = link(preview.runtime?.kind === 'adascript' ? tr("Play preview in Ada Studio ↗") : tr("Open preview ↗"), preview.runtime?.kind === 'adascript' ? nativePreviewURL(preview, cloudMessage('Game preview')) : preview.url); open.target = '_blank'; open.rel = 'noopener noreferrer'
        row.append(open); status(tr("This unlisted preview link expires in 10 minutes. Share it only with reviewers."))
      }, true))
      if (release.status === 'approved' && !active) row.append(button(tr("Make this version live"), async () => { await api(`/game-releases/${release.id}/activate`, 'POST', {}); openProjects(project.id) }, true))
      row.append(button(tr("Remove version"), async () => {
        if (!confirm(active ? cloudMessage('Remove this version and unpublish the game?') : cloudMessage('Remove this version permanently?'))) return
        await api(`/game-releases/${release.id}`, 'DELETE'); openProjects(project.id)
      }, true))
    }
    host.append(row)
  }
}

async function admin() {
  if (!account?.isAdmin) { panel(tr("Administrator access required")); return }
  if (account.testAccessRestricted) await renderTestAccess(panel(tr("Test environment access")), api, status)
  const queue = panel(tr("Game versions awaiting review"))
  const pending: Json[] = await api('/admin/game-releases')
  if (!pending.length) queue.append(el('p', tr("No versions are waiting for review."), 'cloud-muted'))
  for (const release of pending) {
    const row = el('article', '', 'cloud-row cloud-review'), copy = el('div', '', 'cloud-review-copy')
    copy.append(el('strong', tr("{0} · version {1}", () => (release.metadata.title), () => (release.number))), el('p', release.metadata.description), el('p', tr("Author: {0}", () => (release.owner)), 'cloud-muted'))
    if (release.metadata.cover) { const cover = el('img'); cover.src = apiBase + '/v1/media/' + encodeURIComponent(release.metadata.cover); cover.alt = release.metadata.title; copy.append(cover) }
    const reason = field(tr("Reason for rejection"))
    row.append(copy, reason.wrapper, button(tr("Create review preview"), async () => {
      const preview = await api(`/game-releases/${release.id}/preview`, 'POST', {})
      const open = link(preview.runtime?.kind === 'adascript' ? tr("Play preview in Ada Studio ↗") : tr("Open review preview ↗"), preview.runtime?.kind === 'adascript' ? nativePreviewURL(preview, cloudMessage('Game preview')) : preview.url); open.target = '_blank'; open.rel = 'noopener noreferrer'; row.append(open)
      status(tr("Review the game and its metadata. The unlisted preview expires in 10 minutes."))
    }, true), button(tr("Approve and publish"), async () => {
      await api(`/admin/game-releases/${release.id}/review`, 'POST', { decision: 'approve' }); row.remove(); status(tr("Version approved and published."))
    }), button(tr("Reject version"), async () => {
      if (!reason.input.value.trim()) throw new CloudPanelError("Enter a reason so the author can fix this version.")
      await api(`/admin/game-releases/${release.id}/review`, 'POST', { decision: 'reject', reason: reason.input.value }); row.remove(); status(tr("Version rejected. The author can see your reason."))
    }, true))
    queue.append(row)
  }
  const section = panel(tr("Game reports"))
  for (const report of await api('/admin/reports')) {
    const row = el('article'); row.append(el('p', report.reason), link(tr("Game page"), '/games/' + report.pageId), button(tr("Block game"), async () => { await api(`/admin/pages/${report.pageId}/block`, 'POST', {}); row.append(el('p', tr("Blocked"))) }, true)); section.append(row)
  }
}
export async function renderCloud(container: HTMLElement, renderHeader?: () => string, setupNavigation?: () => void, afterAuthentication?: () => Promise<void>, renderFooter?: () => string) {
  if (afterAuthentication) authenticatedCallback = afterAuthentication
  if (renderHeader) siteHeader = renderHeader
  if (setupNavigation) initializeSiteNavigation = setupNavigation
  if (renderFooter) siteFooter = renderFooter
  const playground = !standaloneSite && !operatorSignIn && !cloudPath().startsWith('/legal/')
  const epoch = ++renderEpoch
  container.replaceChildren(); container.className = 'ada-cloud'
  if (!embedded && siteHeader) {
    container.insertAdjacentHTML('afterbegin', siteHeader())
    initializeSiteNavigation()
  }
  const context = el('div', '', `cloud-context container content-restriction${playground ? ' playground-context' : ''}`)
  const nav = el('nav', '', 'cloud-navigation'); textAttribute(nav, 'aria-label', playground ? tr("Playground navigation") : tr("Cloud navigation"))
  const accountLink = link(tr("Account"), '/cloud'), projectsLink = link(tr("My projects"), '/cloud/projects'), catalogLink = link(tr("Games"), '/games'), createLink = link(tr("Create"), '/games/create')
  for (const item of [accountLink, projectsLink, catalogLink, createLink]) item.className = 'navigation-item-link'
  const active = cloudPath() === '/games/create' || cloudPath() === '/cloud/projects/new' ? createLink : cloudPath().startsWith('/games') ? catalogLink : cloudPath().startsWith('/cloud/projects') ? projectsLink : accountLink
  active.classList.add('is-active'); active.setAttribute('aria-current', 'page')
  if (playground) nav.append(catalogLink, createLink, projectsLink, accountLink)
  else nav.append(accountLink, projectsLink, catalogLink)
  const brand = el(playground && cloudPath().startsWith('/games') ? 'div' : 'h1', '', playground ? 'playground-brand' : ''); brand.append(link(playground ? tr("Ada Playground") : tr("Cloud"), playground ? '/games' : '/cloud')); context.append(brand, nav)
  root = el('main', '', 'cloud-main container content-restriction'); notice = el('p', '', 'cloud-notice container content-restriction'); notice.setAttribute('role', 'status'); notice.setAttribute('aria-live', 'polite')
  if (!embedded) container.append(context)
  if (embedded) { container.classList.add('cloud-embedded'); root.className = 'cloud-main'; notice.className = 'cloud-notice' }
  container.append(notice, root); document.title = playground ? cloudMessage('Ada Playground — Create. Share. Play.') : 'Ada Cloud'
  if (!embedded && siteFooter) {
    container.insertAdjacentHTML('beforeend', siteFooter())
    initializeSiteNavigation?.()
  }
  try {
    const parameters = new URLSearchParams(location.search)
    if (playground) rememberPlaygroundReturn(sessionStorage, parameters.get('continue'))
    const incomingDesktop = parameters.get('desktop')
    if (incomingDesktop && /^[A-Za-z0-9_-]{43}$/.test(incomingDesktop)) { sessionStorage.setItem('ada.cloud.desktop', incomingDesktop); clearPlaygroundReturn(sessionStorage) }
    desktopRequestId = sessionStorage.getItem('ada.cloud.desktop')
    const code = parameters.get('code')
    if (code) {
      await api('/auth/exchange', 'POST', { code, verifier: sessionStorage.getItem('ada.cloud.pkce') })
      sessionStorage.removeItem('ada.cloud.pkce')
      if (embedded) { await navigateCloud('/cloud', true); return }
      history.replaceState({}, '', panelURL('/cloud'))
    }
    legal = await api('/legal').then(value => ({ ...draftLegal, ...Object.fromEntries(Object.entries(value).filter(([, v]) => v !== '')) })).catch(() => draftLegal)
    if (epoch !== renderEpoch) return
    if (cloudPath().startsWith('/legal/')) {
      const document = legalDocument(cloudPath().split('/')[2], legal)
      const content = panel(document.title); content.classList.add('cloud-legal-document'); content.lang = 'ru'
      content.append(el('p', tr("{0} · {1}", () => (draftLegal.version), () => (legal.version === draftLegal.version && legal.status === 'published' ? cloudMessage("Published") : cloudMessage("Draft — not yet in effect"))), 'cloud-muted'))
      for (const part of document.sections) { const block = el('section'); block.append(el('h3', part.title), el('p', part.text)); content.append(block) }
      content.append(link(tr("Back to sign in"), '/cloud'))
      return
    }
    availability = await api('/availability').catch(() => ({ cloudServicesAvailable: false, billingAvailable: false }))
    account = await api('/me').catch(error => {
      if (embedded && error?.status !== 401) throw error
      return null
    })
    if (epoch !== renderEpoch) return
    if (embedded?.onAuthenticated) await embedded.onAuthenticated(account)
    if (epoch !== renderEpoch) return
    if (account && authenticatedCallback) { clearPlaygroundReturn(sessionStorage); await authenticatedCallback(); return }
    if (account && sessionStorage.getItem('ada.store.return') === '1' && cloudPath() === '/cloud' && !desktopRequestId) {
      sessionStorage.removeItem('ada.store.return'); clearPlaygroundReturn(sessionStorage); location.replace(panelURL('/store')); return
    }
    if (playground && account && cloudPath() === '/cloud' && !desktopRequestId) {
      const destination = takePlaygroundReturn(sessionStorage)
      if (destination) { if (embedded) { await navigateCloud(destination, true); return }; history.replaceState({}, '', panelURL(destination)); await renderCloud(container); return }
    }
    if (account?.isAdmin) {
      const adminLink = link(tr("Admin"), '/cloud/admin'); adminLink.className = 'navigation-item-link'
      if (cloudPath() === '/cloud/admin') { active.classList.remove('is-active'); active.removeAttribute('aria-current'); adminLink.classList.add('is-active'); adminLink.setAttribute('aria-current', 'page') }
      nav.append(adminLink)
      if (embedded) root.prepend(link(tr("Admin"), '/cloud/admin'))
    }
    if (desktopRequestId && cloudPath() === '/cloud') {
      try { await api('/auth/desktop/' + encodeURIComponent(desktopRequestId)) }
      catch {
        const expired = panel(tr("Editor sign-in is unavailable"))
        expired.append(el('p', tr("The request may have expired. Start sign-in again from Ada Editor.")), button(tr("Go to account"), async () => {
          sessionStorage.removeItem('ada.cloud.desktop'); desktopRequestId = null; history.replaceState({}, '', panelURL('/cloud')); await renderCloud(root.parentElement!)
        }, true))
        return
      }
      if (account) await approveEditorSignIn()
      else signIn()
      return
    }
    if (cloudPath().startsWith('/games')) await catalog()
    else if (cloudPath().startsWith('/cloud/projects')) await projects()
    else if (cloudPath() === '/cloud/admin') await admin()
    else await dashboard()
  } catch (error) {
    if (epoch === renderEpoch && !(error instanceof DOMException && error.name === 'AbortError')) {
      status(errorText(error, tr("Cloud is temporarily unavailable")))
      root.append(button(tr("Try again"), async () => { await renderCloud(container) }, true))
    }
  }
}

// A panel, not a second application: the host owns navigation and outer chrome.
export function mountCloudPanel(container: HTMLElement, options: PanelOptions): () => void {
  panelRequests?.abort()
  panelRequests = new AbortController()
  refreshing = null
  embedded = options
  configureCloudLocalization(options.translate, options.getLanguage)
  authenticatedCallback = undefined
  const navigate = (event: MouseEvent) => {
    const anchor = (event.target as Element)?.closest<HTMLAnchorElement>('a[href]')
    if (!anchor || anchor.target || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const url = new URL(anchor.href)
    if (url.origin !== location.origin || !/^\/(account|publications|legal|games|create|projects)(\/|$)/.test(url.pathname)) return
    event.preventDefault(); void options.onNavigate(url.pathname + url.search + url.hash)
  }
  container.addEventListener('click', navigate)
  void renderCloud(container)
  return () => {
    if (embedded !== options) { container.removeEventListener('click', navigate); container.replaceChildren(); return }
    ++renderEpoch; panelRequests?.abort(); panelRequests = undefined
    embedded = undefined; authenticatedCallback = undefined
    container.removeEventListener('click', navigate); container.replaceChildren()
  }
}

export { refreshCloudTranslations as updateCloudPanelLanguage }
