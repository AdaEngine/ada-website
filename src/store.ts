import { getLocale, localizedNavigation, localizedPath, message, t, withoutLocale } from './localization'
import './store.css'

type Asset = {
  id: string; owner: string; title: string; description: string; authorName: string; category: string;
  license: string; version: string; cover: string; gallery: string[]; tags: string[];
  rating: number; reviewCount: number; downloads: number; bytes: number; blocked: boolean;
}
type Review = { id: string; authorName: string; rating: number; text: string; updatedAt: number }
const apiBase = (import.meta.env.VITE_STORE_API_URL as string | undefined) ?? ''
const names: Record<string, string> = { '2d': t('2D art'), '3d': t('3D models'), textures: t('Textures'), materials: t('Materials'), audio: t('Audio'), animations: t('Animations'), scripts: t('Scripts'), templates: t('Templates'), ui: t('UI kits'), tools: t('Tools') }
let refresh: Promise<unknown> | null = null
async function api(path: string, method = 'GET', body?: unknown, retry = true): Promise<any> {
  const response = await fetch(apiBase + '/v1' + path, {
    credentials: 'include', method, headers: body instanceof File ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : body instanceof File ? body : JSON.stringify(body),
  })
  if (response.status === 401 && retry && !path.startsWith('/auth/')) {
    refresh ??= api('/auth/refresh', 'POST', {}, false).finally(() => { refresh = null })
    await refresh
    return api(path, method, body, false)
  }
  if (!response.headers.get('Content-Type')?.includes('application/json')) throw new Error(t('Store API is unavailable. Please try again later.'))
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error?.message ?? message('Store unavailable ({0}). Please try again.', response.status))
  return data
}
function el<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', cls = ''): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag); node.textContent = text; node.className = cls.split(' ').flatMap(value => value === 'store-primary' ? [value, 'header-buttons'] : value === 'store-secondary' ? [value, 'header-buttons-github'] : [value]).join(' '); return node
}
function link(text: string, href: string, cls = '') { const node = el('a', text, cls); node.href = href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/v1/') ? localizedNavigation(href, getLocale(), new URLSearchParams(location.search).get('lang')) : href; return node }
function image(id: string, title: string, cls = '') { const node = el('img', '', cls); node.src = apiBase + '/v1/store/media/' + encodeURIComponent(id); node.alt = title; node.loading = 'lazy'; return node }
function button(text: string, action: () => void | Promise<void>, cls = '') {
  const node = el('button', text, cls); node.type = 'button'
  node.onclick = () => { void action() }; return node
}
const cloudAccountURL = () => {
  const origin = (import.meta.env.VITE_CLOUD_ACCOUNT_URL as string | undefined) ?? (window.location.hostname.startsWith('store-test.') ? 'https://cloud-test.adaengine.org' : 'https://cloud.adaengine.org')
  return new URL(localizedPath('/cloud', getLocale()) + (getLocale() === 'en' ? '?lang=en' : ''), origin).href
}
const count = (n: number) => new Intl.NumberFormat(getLocale(), { notation: 'compact' }).format(n)
const size = (n: number) => n < 1000 ? `${n} B` : n < 1_000_000 ? `${(n / 1000).toFixed(1)} KB` : `${(n / 1_000_000).toFixed(1)} MB`

export async function renderStore(app: HTMLElement, renderHeader: () => string, setupNavigation: () => void, renderFooter?: () => string) {
  sessionStorage.setItem('ada.store.return', '1')
  document.title = t('Ada Store · Free assets for your next game')
  app.replaceChildren(); app.className = 'store-app'
  app.insertAdjacentHTML('afterbegin', renderHeader())
  setupNavigation()
  const context = el('div', '', 'store-context container content-restriction')
  const accountActions = el('nav', '', 'store-account-actions'); accountActions.setAttribute('aria-label', t('Store navigation'))
  context.append(el('h1', t('Store')), accountActions); app.append(context)
  const main = el('main', '', 'store-main container content-restriction'); app.append(main)
  const hero = el('section', '', 'store-hero')
  hero.append(el('p', t('Community assets'), 'hero-eyebrow'), el('h2', t('Free assets for your next game.')), el('p', t('Discover models, textures, sounds and scripts from the Ada community. Download them for free and bring them into Ada Studio.'), 'store-intro'))
  const heroActions = el('div', '', 'store-hero-actions')
  const publishButton = button(t('Share an asset'), () => openPublish(), 'store-primary'); heroActions.append(publishButton, el('span', t('Free to download. Open to everyone.'))); hero.append(heroActions); main.append(hero)
  const notice = el('p', '', 'store-notice'); notice.setAttribute('role', 'status'); main.append(notice)
  const retryButton = button(t('Try again'), () => renderStore(app, renderHeader, setupNavigation), 'store-secondary'); retryButton.hidden = true; main.append(retryButton)
  const content = el('section', '', 'store-content'); main.append(content)
  const filters = el('div', '', 'store-filters')
  const search = el('input'); search.type = 'search'; search.placeholder = t('Search models, sounds, scripts…'); search.setAttribute('aria-label', t('Search assets'))
  const sort = el('select'); sort.setAttribute('aria-label', t('Sort assets'))
  for (const [value, label] of [['popular', t('Most downloaded')], ['rating', t('Highest rated')], ['newest', t('Recently added')]]) { const option = el('option', label); option.value = value; sort.append(option) }
  filters.append(search, sort); content.append(filters)
  const tabs = el('div', '', 'store-categories'); tabs.setAttribute('aria-label', t('Asset categories')); content.append(tabs)
  const resultsHeading = el('div', '', 'store-results-heading'), heading = el('h2', t('Explore the store')), totalLabel = el('span', '', 'store-muted')
  resultsHeading.append(heading, totalLabel); content.append(resultsHeading)
  const grid = el('div', '', 'store-grid'); content.append(grid)
  const more = button(t('Load more'), () => load(false), 'store-secondary'); more.hidden = true; content.append(more)
  const footer = el('footer', '', 'store-footer container content-restriction'); footer.append(el('p', t('Made by creators. Shared with the community.')), link(t('Ada Studio ↗'), new URL(localizedPath('/studio', getLocale()), 'https://adaengine.org').href), link(t('Your Cloud account ↗'), cloudAccountURL())); if (renderFooter) app.insertAdjacentHTML('beforeend', renderFooter()); else app.append(footer)
  setupNavigation()
  let account: { accountId: string } | null = null, category = '', offset = 0, generation = 0
  let config: { categories: string[]; licenses: string[]; limits: { imageBytes: number; galleryImages: number; archiveBytes: number } }
  const report = (error: unknown) => { notice.textContent = error instanceof Error ? error.message : t('Request failed') }
  try { const value = await api('/me'); account = typeof value.accountId === 'string' ? value : null } catch { /* Browsing is available to guests. */ }
  accountActions.append(account ? button(t('My assets'), () => openMine(), 'navigation-item-link') : link(t('Sign in'), '/cloud', 'navigation-item-link'))
  if (account) accountActions.append(link(t('Account'), cloudAccountURL(), 'navigation-item-link'))
  function card(asset: Asset) {
    const node = button('', () => openAsset(asset.id), 'store-card')
    const visual = el('div', '', 'store-card-visual'); visual.append(image(asset.cover, asset.title), el('span', t('FREE'), 'store-free'))
    const body = el('div', '', 'store-card-body'); body.append(el('span', names[asset.category] ?? asset.category, 'store-eyebrow'), el('h3', asset.title), el('p', asset.authorName, 'store-author'))
    const stats = el('div', '', 'store-card-stats'); stats.append(el('span', asset.reviewCount ? `★ ${asset.rating.toFixed(1)} (${count(asset.reviewCount)})` : t('No ratings yet')), el('span', `↓ ${count(asset.downloads)}`)); body.append(stats); node.append(visual, body); return node
  }
  async function load(reset = true) {
    const version = ++generation
    if (reset) { offset = 0; grid.replaceChildren(el('p', t('Loading assets…'), 'store-empty')) }
    more.disabled = true; notice.textContent = ''; retryButton.hidden = true
    const params = new URLSearchParams({ q: search.value.trim(), category, sort: sort.value, offset: String(offset), limit: '24' })
    try {
      const result = await api('/store/assets?' + params)
      if (version !== generation) return
      if (reset) grid.replaceChildren()
      for (const asset of result.items as Asset[]) grid.append(card(asset))
      offset += result.items.length; totalLabel.textContent = getLocale() === 'ru' ? message('{0} assets', count(result.total)) : `${count(result.total)} ${result.total === 1 ? 'asset' : 'assets'}`; more.hidden = offset >= result.total
      if (!result.total) grid.append(el('p', search.value || category ? t('No assets match your search. Try another category or search term.') : t('The shelves are ready for your first creation. Share an asset to get the community started.'), 'store-empty'))
    } catch (error) { if (version === generation) { if (reset) grid.replaceChildren(el('p', t('The store could not be loaded.'), 'store-empty')); report(error); more.hidden = true; retryButton.hidden = false } }
    finally { if (version === generation) more.disabled = false }
  }
  function renderCategories() {
    tabs.replaceChildren()
    for (const value of ['', ...config.categories]) {
      const tab = button(value ? names[value] ?? value : t('All assets'), async () => { category = value; renderCategories(); await load() }, category === value ? 'store-category active' : 'store-category')
      tab.setAttribute('aria-pressed', String(category === value)); tabs.append(tab)
    }
  }
  let timer: ReturnType<typeof setTimeout>
  search.oninput = () => { clearTimeout(timer); timer = setTimeout(() => { void load() }, 250) }; sort.onchange = () => { void load() }
  function dialog(title: string) {
    const node = el('dialog', '', 'store-dialog'), body = el('div', '', 'store-dialog-body'), bar = el('div', '', 'store-dialog-bar'), caption = el('h2', title)
    caption.id = 'store-dialog-' + crypto.randomUUID(); node.setAttribute('aria-labelledby', caption.id)
    bar.append(caption, button(t('Close ×'), () => node.close(), 'store-secondary')); body.append(bar); node.append(body); app.append(node)
    node.addEventListener('close', () => node.remove()); node.showModal(); return { node, body }
  }
  async function openAsset(id: string) {
    const { node, body } = dialog(t('Asset details'))
    const pending = el('p', t('Loading…')); body.append(pending)
    try {
      const asset: Asset = await api('/store/assets/' + encodeURIComponent(id)); if (!node.open) return
      pending.remove(); body.querySelector('h2')!.textContent = asset.title
      const cover = image(asset.cover, asset.title, 'store-detail-cover'); body.append(cover)
      const gallery = el('div', '', 'store-gallery')
      for (const media of [asset.cover, ...asset.gallery]) { const thumb = button('', () => { cover.src = apiBase + '/v1/store/media/' + encodeURIComponent(media) }); thumb.append(image(media, message('View image for {0}', asset.title))); gallery.append(thumb) }; body.append(gallery)
      body.append(el('p', `${asset.authorName} · ${names[asset.category]} · v${asset.version} · ${asset.license}`, 'store-muted'))
      const description = el('p', asset.description, 'store-description'); body.append(description)
      const statsText = (value: Asset) => `★ ${value.reviewCount ? value.rating.toFixed(1) : '—'} · ${message('{0} reviews · ↓ {1} downloads', count(value.reviewCount), count(value.downloads))} · ${size(value.bytes)}`
      const stats = el('p', statsText(asset), 'store-muted'); body.append(stats)
      const actions = el('div', '', 'store-detail-actions')
      actions.append(link(t('Download ZIP ↓'), apiBase + '/v1/store/assets/' + asset.id + '/download', 'store-primary'), link(t('Open in Ada Studio ↗'), 'adaeditor://store/asset/' + asset.id, 'store-secondary'), link(t('Permalink'), '/store/assets/' + asset.id, 'store-site-link')); body.append(actions)
      body.append(el('h3', t('Community reviews')))
      const reviews = el('div', '', 'store-reviews'); body.append(reviews)
      async function loadReviews() {
        const rows: Review[] = await api('/store/assets/' + asset.id + '/reviews'); reviews.replaceChildren()
        for (const row of rows) { const review = el('article', '', 'store-review'); review.append(el('strong', `${row.authorName} · ${'★'.repeat(row.rating)}`), el('p', row.text), el('time', new Date(row.updatedAt * 1000).toLocaleDateString(getLocale()))); reviews.append(review) }
        if (!rows.length) reviews.append(el('p', t('Be the first to leave a review.'), 'store-muted'))
      }
      if (account) {
        const form = el('form', '', 'store-form'), author = field(t('Display name'), 'text', '', true), rating = el('select')
        rating.setAttribute('aria-label', t('Rating')); for (let value = 5; value >= 1; value--) { const option = el('option', message('{0} stars', value)); option.value = String(value); rating.append(option) }
        const text = el('textarea'); text.placeholder = t('How did this asset work in your project?'); text.required = true; text.maxLength = 2000; text.setAttribute('aria-label', t('Your review'))
        const feedback = el('p'); feedback.setAttribute('role', 'status')
        const save = el('button', t('Post / update my review'), 'store-primary'); save.type = 'submit'
        form.append(author.label, rating, text, save, button(t('Remove my review'), async () => { try { await api('/store/assets/' + asset.id + '/review', 'DELETE'); stats.textContent = statsText(await api('/store/assets/' + asset.id)); await loadReviews(); await load() } catch (error) { feedback.textContent = String(error) } }, 'store-secondary'), feedback)
        form.onsubmit = async event => { event.preventDefault(); save.disabled = true; try { const updated = await api('/store/assets/' + asset.id + '/review', 'PUT', { authorName: author.input.value, rating: Number(rating.value), text: text.value }); stats.textContent = statsText(updated); feedback.textContent = t('Review saved.'); await loadReviews(); await load() } catch (error) { feedback.textContent = error instanceof Error ? error.message : t('Review failed') } finally { save.disabled = false } }; body.append(form)
      } else body.append(link(t('Sign in to leave a review →'), '/cloud', 'store-secondary'))
      await loadReviews()
    } catch (error) { pending.remove(); const message = el('p', error instanceof Error ? error.message : t('Asset unavailable')); message.setAttribute('role', 'alert'); body.append(message) }
  }
  function field(title: string, type = 'text', value = '', required = false) {
    const label = el('label', title), input = el('input'); input.type = type; input.value = value; input.required = required; label.append(input); return { label, input }
  }
  async function openMine() {
    const { body } = dialog(t('Your assets'))
    try {
      const assets: Asset[] = await api('/store/mine')
      if (!assets.length) body.append(el('p', t('You have not shared an asset yet.')))
      for (const asset of assets) {
        const row = el('div', '', 'store-mine-row'); row.append(el('strong', asset.title + (asset.blocked ? t(' · Blocked') : '')), button(t('Edit'), () => openPublish(asset), 'store-secondary'), button(t('Delete'), async () => {
          if (!window.confirm(message('Delete “{0}” from the store?', asset.title))) return
          try { await api('/store/assets/' + asset.id, 'DELETE'); row.remove(); await load() } catch (error) { report(error) }
        }, 'store-secondary')); body.append(row)
      }
    } catch (error) { body.append(el('p', error instanceof Error ? error.message : t('Could not load your assets'))) }
  }
  function openPublish(previous?: Asset) {
    if (!account) { window.location.assign(localizedNavigation('/cloud', getLocale(), new URLSearchParams(location.search).get('lang'))); return }
    const { node, body } = dialog(previous ? t('Edit asset') : t('Share your creation'))
    body.append(el('p', t('A preview + up to 8 gallery images, 5 MB each. JPEG, PNG or WebP. ZIP archive up to 300 MB.'), 'store-muted'))
    const form = el('form', '', 'store-form'), title = field(t('Asset name'), 'text', previous?.title ?? '', true), author = field(t('Author display name'), 'text', previous?.authorName ?? '', true), version = field(t('Version'), 'text', previous?.version ?? '1.0.0', true)
    title.input.maxLength = 100; author.input.maxLength = 80; version.input.maxLength = 40
    const categoryLabel = el('label', t('Category')), categorySelect = el('select')
    for (const value of config.categories) { const option = el('option', names[value] ?? value); option.value = value; categorySelect.append(option) }; categorySelect.value = previous?.category ?? config.categories[0]; categoryLabel.append(categorySelect)
    const licenseLabel = el('label', t('License')), license = el('select')
    for (const value of config.licenses) { const option = el('option', value); option.value = value; license.append(option) }; license.value = previous?.license ?? config.licenses[0]; licenseLabel.append(license)
    const descriptionLabel = el('label', t('Description')), description = el('textarea'); description.required = true; description.maxLength = 10000; description.value = previous?.description ?? ''; descriptionLabel.append(description)
    const tags = field(t('Tags (comma separated, up to 8)'), 'text', previous?.tags.join(', ') ?? '')
    const cover = field(previous ? t('Replace preview (optional)') : t('Preview image'), 'file', '', !previous), gallery = field(previous ? t('Replace gallery (optional)') : t('Gallery images'), 'file'), archive = field(previous ? t('New ZIP version (optional)') : t('Asset ZIP'), 'file', '', !previous)
    cover.input.accept = gallery.input.accept = 'image/jpeg,image/png,image/webp'; gallery.input.multiple = true; archive.input.accept = '.zip,application/zip'
    const rights = field(t('I own these assets or have permission to distribute them under the selected license.'), 'checkbox', '', true)
    const feedback = el('p'); feedback.setAttribute('role', 'status')
    const submit = el('button', previous ? t('Save changes') : t('Publish free asset'), 'store-primary'); submit.type = 'submit'
    form.append(title.label, author.label, version.label, categoryLabel, licenseLabel, descriptionLabel, tags.label, cover.label, gallery.label, archive.label, rights.label, submit, feedback); body.append(form)
    form.onsubmit = async event => {
      event.preventDefault(); submit.disabled = true
      try {
        const coverFile = cover.input.files?.[0], galleryFiles = Array.from(gallery.input.files ?? []), zip = archive.input.files?.[0]
        if (galleryFiles.length > config.limits.galleryImages) throw new Error(t('Maximum 8 gallery images.'))
        for (const file of [...(coverFile ? [coverFile] : []), ...galleryFiles]) if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || !file.size || file.size > config.limits.imageBytes) throw new Error(t('Images must be JPEG, PNG or WebP up to 5 MB.'))
        if (zip && (!zip.size || zip.size > config.limits.archiveBytes)) throw new Error(t('ZIP must be between 1 byte and 300 MB.'))
        const tagValues = tags.input.value.split(',').map(s => s.trim()).filter(Boolean); if (tagValues.length > 8 || tagValues.some(t => new TextEncoder().encode(t).length > 30)) throw new Error(t('Use up to 8 tags of 30 bytes each.'))
        for (const [label, value, max] of [[t('Asset name'), title.input.value, 100], [t('Description'), description.value, 10000], [t('Author name'), author.input.value, 80], [t('Version'), version.input.value, 40]] as const) {
          if (!value.trim() || new TextEncoder().encode(value).length > max) throw new Error(message('{0} is required and must fit within {1} UTF-8 bytes.', label, max))
        }
        feedback.textContent = t('Uploading images…')
        const coverID = coverFile ? (await api('/store/media', 'POST', coverFile)).id : previous?.cover
        const galleryIDs: string[] = galleryFiles.length ? [] : previous?.gallery ?? []
        for (const file of galleryFiles) galleryIDs.push((await api('/store/media', 'POST', file)).id)
        let uploadId: string | undefined
        if (zip) {
          feedback.textContent = t('Uploading archive…')
          const upload = await api('/store/uploads', 'POST', { bytes: zip.size }); uploadId = upload.id
          const response = await fetch(upload.url, { method: 'PUT', body: zip }); if (!response.ok) throw new Error(t('Archive upload failed. Please try again.'))
          feedback.textContent = t('Checking archive…'); await api('/store/uploads/' + uploadId + '/complete', 'POST', {})
        }
        await api('/store/assets' + (previous ? '/' + previous.id : ''), previous ? 'PATCH' : 'POST', { title: title.input.value, authorName: author.input.value, version: version.input.value, category: categorySelect.value, license: license.value, description: description.value, tags: tagValues, cover: coverID, gallery: galleryIDs, ...(uploadId ? { uploadId } : {}) })
        node.close(); notice.textContent = previous ? t('Changes saved.') : t('Your asset is live in the store.'); await load()
      } catch (error) { feedback.textContent = error instanceof Error ? error.message : t('Publishing failed') }
      finally { submit.disabled = false }
    }
  }
  try {
    config = await api('/store/categories'); renderCategories(); await load()
    const match = withoutLocale(window.location.pathname).match(/^\/store\/assets\/([a-f0-9-]+)$/)
    if (match) await openAsset(match[1])
  } catch (error) { publishButton.disabled = true; more.hidden = true; retryButton.hidden = false; report(error); grid.append(el('p', t('The store is temporarily unavailable.'), 'store-empty')) }
}
