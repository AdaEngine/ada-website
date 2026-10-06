import './store.css'

type Asset = {
  id: string; owner: string; title: string; description: string; authorName: string; category: string;
  license: string; version: string; cover: string; gallery: string[]; tags: string[];
  rating: number; reviewCount: number; downloads: number; bytes: number; blocked: boolean;
}
type Review = { id: string; authorName: string; rating: number; text: string; updatedAt: number }
const apiBase = (import.meta.env.VITE_STORE_API_URL as string | undefined) ?? ''
const names: Record<string, string> = { '2d': '2D art', '3d': '3D models', textures: 'Textures', materials: 'Materials', audio: 'Audio', animations: 'Animations', scripts: 'Scripts', templates: 'Templates', ui: 'UI kits', tools: 'Tools' }
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
  if (!response.headers.get('Content-Type')?.includes('application/json')) throw new Error('Store API is unavailable. Please try again later.')
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error?.message ?? `Store unavailable (${response.status}). Please try again.`)
  return data
}
function el<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', cls = ''): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag); node.textContent = text; node.className = cls.split(' ').flatMap(value => value === 'store-primary' ? [value, 'header-buttons'] : value === 'store-secondary' ? [value, 'header-buttons-github'] : [value]).join(' '); return node
}
function link(text: string, href: string, cls = '') { const node = el('a', text, cls); node.href = href; return node }
function image(id: string, title: string, cls = '') { const node = el('img', '', cls); node.src = apiBase + '/v1/store/media/' + encodeURIComponent(id); node.alt = title; node.loading = 'lazy'; return node }
function button(text: string, action: () => void | Promise<void>, cls = '') {
  const node = el('button', text, cls); node.type = 'button'
  node.onclick = () => { void action() }; return node
}
const cloudAccountURL = () => ((import.meta.env.VITE_CLOUD_ACCOUNT_URL as string | undefined) ?? (window.location.hostname.startsWith('store-test.') ? 'https://cloud-test.adaengine.org' : 'https://cloud.adaengine.org')) + '/cloud'
const count = (n: number) => new Intl.NumberFormat('en', { notation: 'compact' }).format(n)
const size = (n: number) => n < 1000 ? `${n} B` : n < 1_000_000 ? `${(n / 1000).toFixed(1)} KB` : `${(n / 1_000_000).toFixed(1)} MB`

export async function renderStore(app: HTMLElement, renderHeader: () => string, setupNavigation: () => void) {
  sessionStorage.setItem('ada.store.return', '1')
  document.title = 'Ada Store · Free assets for your next game'
  app.replaceChildren(); app.className = 'store-app'
  app.insertAdjacentHTML('afterbegin', renderHeader())
  setupNavigation()
  const context = el('div', '', 'store-context container content-restriction')
  const accountActions = el('nav', '', 'store-account-actions'); accountActions.setAttribute('aria-label', 'Store navigation')
  context.append(el('h1', 'Store'), accountActions); app.append(context)
  const main = el('main', '', 'store-main container content-restriction'); app.append(main)
  const hero = el('section', '', 'store-hero')
  hero.append(el('p', 'Community assets', 'hero-eyebrow'), el('h2', 'Free assets for your next game.'), el('p', 'Discover models, textures, sounds and scripts from the Ada community. Download them for free and bring them into Ada Studio.', 'store-intro'))
  const heroActions = el('div', '', 'store-hero-actions')
  const publishButton = button('Share an asset', () => openPublish(), 'store-primary'); heroActions.append(publishButton, el('span', 'Free to download. Open to everyone.')); hero.append(heroActions); main.append(hero)
  const notice = el('p', '', 'store-notice'); notice.setAttribute('role', 'status'); main.append(notice)
  const retryButton = button('Try again', () => renderStore(app, renderHeader, setupNavigation), 'store-secondary'); retryButton.hidden = true; main.append(retryButton)
  const content = el('section', '', 'store-content'); main.append(content)
  const filters = el('div', '', 'store-filters')
  const search = el('input'); search.type = 'search'; search.placeholder = 'Search models, sounds, scripts…'; search.setAttribute('aria-label', 'Search assets')
  const sort = el('select'); sort.setAttribute('aria-label', 'Sort assets')
  for (const [value, label] of [['popular', 'Most downloaded'], ['rating', 'Highest rated'], ['newest', 'Recently added']]) { const option = el('option', label); option.value = value; sort.append(option) }
  filters.append(search, sort); content.append(filters)
  const tabs = el('div', '', 'store-categories'); tabs.setAttribute('aria-label', 'Asset categories'); content.append(tabs)
  const resultsHeading = el('div', '', 'store-results-heading'), heading = el('h2', 'Explore the store'), totalLabel = el('span', '', 'store-muted')
  resultsHeading.append(heading, totalLabel); content.append(resultsHeading)
  const grid = el('div', '', 'store-grid'); content.append(grid)
  const more = button('Load more', () => load(false), 'store-secondary'); more.hidden = true; content.append(more)
  const footer = el('footer', '', 'store-footer container content-restriction'); footer.append(el('p', 'Made by creators. Shared with the community.'), link('Ada Studio ↗', 'https://adaengine.org/studio'), link('Your Cloud account ↗', cloudAccountURL())); app.append(footer)
  let account: { accountId: string } | null = null, category = '', offset = 0, generation = 0
  let config: { categories: string[]; licenses: string[]; limits: { imageBytes: number; galleryImages: number; archiveBytes: number } }
  const report = (error: unknown) => { notice.textContent = error instanceof Error ? error.message : 'Request failed' }
  try { const value = await api('/me'); account = typeof value.accountId === 'string' ? value : null } catch { /* Browsing is available to guests. */ }
  accountActions.append(account ? button('My assets', () => openMine(), 'navigation-item-link') : link('Sign in', '/cloud', 'navigation-item-link'))
  if (account) accountActions.append(link('Account', cloudAccountURL(), 'navigation-item-link'))
  function card(asset: Asset) {
    const node = button('', () => openAsset(asset.id), 'store-card')
    const visual = el('div', '', 'store-card-visual'); visual.append(image(asset.cover, asset.title), el('span', 'FREE', 'store-free'))
    const body = el('div', '', 'store-card-body'); body.append(el('span', names[asset.category] ?? asset.category, 'store-eyebrow'), el('h3', asset.title), el('p', asset.authorName, 'store-author'))
    const stats = el('div', '', 'store-card-stats'); stats.append(el('span', asset.reviewCount ? `★ ${asset.rating.toFixed(1)} (${count(asset.reviewCount)})` : 'No ratings yet'), el('span', `↓ ${count(asset.downloads)}`)); body.append(stats); node.append(visual, body); return node
  }
  async function load(reset = true) {
    const version = ++generation
    if (reset) { offset = 0; grid.replaceChildren(el('p', 'Loading assets…', 'store-empty')) }
    more.disabled = true; notice.textContent = ''; retryButton.hidden = true
    const params = new URLSearchParams({ q: search.value.trim(), category, sort: sort.value, offset: String(offset), limit: '24' })
    try {
      const result = await api('/store/assets?' + params)
      if (version !== generation) return
      if (reset) grid.replaceChildren()
      for (const asset of result.items as Asset[]) grid.append(card(asset))
      offset += result.items.length; totalLabel.textContent = `${count(result.total)} ${result.total === 1 ? 'asset' : 'assets'}`; more.hidden = offset >= result.total
      if (!result.total) grid.append(el('p', search.value || category ? 'No assets match your search. Try another category or search term.' : 'The shelves are ready for your first creation. Share an asset to get the community started.', 'store-empty'))
    } catch (error) { if (version === generation) { if (reset) grid.replaceChildren(el('p', 'The store could not be loaded.', 'store-empty')); report(error); more.hidden = true; retryButton.hidden = false } }
    finally { if (version === generation) more.disabled = false }
  }
  function renderCategories() {
    tabs.replaceChildren()
    for (const value of ['', ...config.categories]) {
      const tab = button(value ? names[value] ?? value : 'All assets', async () => { category = value; renderCategories(); await load() }, category === value ? 'store-category active' : 'store-category')
      tab.setAttribute('aria-pressed', String(category === value)); tabs.append(tab)
    }
  }
  let timer: ReturnType<typeof setTimeout>
  search.oninput = () => { clearTimeout(timer); timer = setTimeout(() => { void load() }, 250) }; sort.onchange = () => { void load() }
  function dialog(title: string) {
    const node = el('dialog', '', 'store-dialog'), body = el('div', '', 'store-dialog-body'), bar = el('div', '', 'store-dialog-bar'), caption = el('h2', title)
    caption.id = 'store-dialog-' + crypto.randomUUID(); node.setAttribute('aria-labelledby', caption.id)
    bar.append(caption, button('Close ×', () => node.close(), 'store-secondary')); body.append(bar); node.append(body); app.append(node)
    node.addEventListener('close', () => node.remove()); node.showModal(); return { node, body }
  }
  async function openAsset(id: string) {
    const { node, body } = dialog('Asset details')
    const pending = el('p', 'Loading…'); body.append(pending)
    try {
      const asset: Asset = await api('/store/assets/' + encodeURIComponent(id)); if (!node.open) return
      pending.remove(); body.querySelector('h2')!.textContent = asset.title
      const cover = image(asset.cover, asset.title, 'store-detail-cover'); body.append(cover)
      const gallery = el('div', '', 'store-gallery')
      for (const media of [asset.cover, ...asset.gallery]) { const thumb = button('', () => { cover.src = apiBase + '/v1/store/media/' + encodeURIComponent(media) }); thumb.append(image(media, 'View image for ' + asset.title)); gallery.append(thumb) }; body.append(gallery)
      body.append(el('p', `${asset.authorName} · ${names[asset.category]} · v${asset.version} · ${asset.license}`, 'store-muted'))
      const description = el('p', asset.description, 'store-description'); body.append(description)
      const statsText = (value: Asset) => `★ ${value.reviewCount ? value.rating.toFixed(1) : '—'} · ${count(value.reviewCount)} reviews · ↓ ${count(value.downloads)} downloads · ${size(value.bytes)}`
      const stats = el('p', statsText(asset), 'store-muted'); body.append(stats)
      const actions = el('div', '', 'store-detail-actions')
      actions.append(link('Download ZIP ↓', apiBase + '/v1/store/assets/' + asset.id + '/download', 'store-primary'), link('Open in Ada Studio ↗', 'adaeditor://store/asset/' + asset.id, 'store-secondary'), link('Permalink', '/store/assets/' + asset.id, 'store-site-link')); body.append(actions)
      body.append(el('h3', 'Community reviews'))
      const reviews = el('div', '', 'store-reviews'); body.append(reviews)
      async function loadReviews() {
        const rows: Review[] = await api('/store/assets/' + asset.id + '/reviews'); reviews.replaceChildren()
        for (const row of rows) { const review = el('article', '', 'store-review'); review.append(el('strong', `${row.authorName} · ${'★'.repeat(row.rating)}`), el('p', row.text), el('time', new Date(row.updatedAt * 1000).toLocaleDateString())); reviews.append(review) }
        if (!rows.length) reviews.append(el('p', 'Be the first to leave a review.', 'store-muted'))
      }
      if (account) {
        const form = el('form', '', 'store-form'), author = field('Display name', 'text', '', true), rating = el('select')
        rating.setAttribute('aria-label', 'Rating'); for (let value = 5; value >= 1; value--) { const option = el('option', `${value} stars`); option.value = String(value); rating.append(option) }
        const text = el('textarea'); text.placeholder = 'How did this asset work in your project?'; text.required = true; text.maxLength = 2000; text.setAttribute('aria-label', 'Your review')
        const feedback = el('p'); feedback.setAttribute('role', 'status')
        const save = el('button', 'Post / update my review', 'store-primary'); save.type = 'submit'
        form.append(author.label, rating, text, save, button('Remove my review', async () => { try { await api('/store/assets/' + asset.id + '/review', 'DELETE'); stats.textContent = statsText(await api('/store/assets/' + asset.id)); await loadReviews(); await load() } catch (error) { feedback.textContent = String(error) } }, 'store-secondary'), feedback)
        form.onsubmit = async event => { event.preventDefault(); save.disabled = true; try { const updated = await api('/store/assets/' + asset.id + '/review', 'PUT', { authorName: author.input.value, rating: Number(rating.value), text: text.value }); stats.textContent = statsText(updated); feedback.textContent = 'Review saved.'; await loadReviews(); await load() } catch (error) { feedback.textContent = error instanceof Error ? error.message : 'Review failed' } finally { save.disabled = false } }; body.append(form)
      } else body.append(link('Sign in to leave a review →', '/cloud', 'store-secondary'))
      await loadReviews()
    } catch (error) { pending.remove(); const message = el('p', error instanceof Error ? error.message : 'Asset unavailable'); message.setAttribute('role', 'alert'); body.append(message) }
  }
  function field(title: string, type = 'text', value = '', required = false) {
    const label = el('label', title), input = el('input'); input.type = type; input.value = value; input.required = required; label.append(input); return { label, input }
  }
  async function openMine() {
    const { body } = dialog('Your assets')
    try {
      const assets: Asset[] = await api('/store/mine')
      if (!assets.length) body.append(el('p', 'You have not shared an asset yet.'))
      for (const asset of assets) {
        const row = el('div', '', 'store-mine-row'); row.append(el('strong', asset.title + (asset.blocked ? ' · Blocked' : '')), button('Edit', () => openPublish(asset), 'store-secondary'), button('Delete', async () => {
          if (!window.confirm(`Delete “${asset.title}” from the store?`)) return
          try { await api('/store/assets/' + asset.id, 'DELETE'); row.remove(); await load() } catch (error) { report(error) }
        }, 'store-secondary')); body.append(row)
      }
    } catch (error) { body.append(el('p', error instanceof Error ? error.message : 'Could not load your assets')) }
  }
  function openPublish(previous?: Asset) {
    if (!account) { window.location.assign('/cloud'); return }
    const { node, body } = dialog(previous ? 'Edit asset' : 'Share your creation')
    body.append(el('p', 'A preview + up to 8 gallery images, 5 MB each. JPEG, PNG or WebP. ZIP archive up to 300 MB.', 'store-muted'))
    const form = el('form', '', 'store-form'), title = field('Asset name', 'text', previous?.title ?? '', true), author = field('Author display name', 'text', previous?.authorName ?? '', true), version = field('Version', 'text', previous?.version ?? '1.0.0', true)
    title.input.maxLength = 100; author.input.maxLength = 80; version.input.maxLength = 40
    const categoryLabel = el('label', 'Category'), categorySelect = el('select')
    for (const value of config.categories) { const option = el('option', names[value] ?? value); option.value = value; categorySelect.append(option) }; categorySelect.value = previous?.category ?? config.categories[0]; categoryLabel.append(categorySelect)
    const licenseLabel = el('label', 'License'), license = el('select')
    for (const value of config.licenses) { const option = el('option', value); option.value = value; license.append(option) }; license.value = previous?.license ?? config.licenses[0]; licenseLabel.append(license)
    const descriptionLabel = el('label', 'Description'), description = el('textarea'); description.required = true; description.maxLength = 10000; description.value = previous?.description ?? ''; descriptionLabel.append(description)
    const tags = field('Tags (comma separated, up to 8)', 'text', previous?.tags.join(', ') ?? '')
    const cover = field(previous ? 'Replace preview (optional)' : 'Preview image', 'file', '', !previous), gallery = field(previous ? 'Replace gallery (optional)' : 'Gallery images', 'file'), archive = field(previous ? 'New ZIP version (optional)' : 'Asset ZIP', 'file', '', !previous)
    cover.input.accept = gallery.input.accept = 'image/jpeg,image/png,image/webp'; gallery.input.multiple = true; archive.input.accept = '.zip,application/zip'
    const rights = field('I own these assets or have permission to distribute them under the selected license.', 'checkbox', '', true)
    const feedback = el('p'); feedback.setAttribute('role', 'status')
    const submit = el('button', previous ? 'Save changes' : 'Publish free asset', 'store-primary'); submit.type = 'submit'
    form.append(title.label, author.label, version.label, categoryLabel, licenseLabel, descriptionLabel, tags.label, cover.label, gallery.label, archive.label, rights.label, submit, feedback); body.append(form)
    form.onsubmit = async event => {
      event.preventDefault(); submit.disabled = true
      try {
        const coverFile = cover.input.files?.[0], galleryFiles = Array.from(gallery.input.files ?? []), zip = archive.input.files?.[0]
        if (galleryFiles.length > config.limits.galleryImages) throw new Error('Maximum 8 gallery images.')
        for (const file of [...(coverFile ? [coverFile] : []), ...galleryFiles]) if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || !file.size || file.size > config.limits.imageBytes) throw new Error('Images must be JPEG, PNG or WebP up to 5 MB.')
        if (zip && (!zip.size || zip.size > config.limits.archiveBytes)) throw new Error('ZIP must be between 1 byte and 300 MB.')
        const tagValues = tags.input.value.split(',').map(s => s.trim()).filter(Boolean); if (tagValues.length > 8 || tagValues.some(t => new TextEncoder().encode(t).length > 30)) throw new Error('Use up to 8 tags of 30 bytes each.')
        for (const [label, value, max] of [['Asset name', title.input.value, 100], ['Description', description.value, 10000], ['Author name', author.input.value, 80], ['Version', version.input.value, 40]] as const) {
          if (!value.trim() || new TextEncoder().encode(value).length > max) throw new Error(`${label} is required and must fit within ${max} UTF-8 bytes.`)
        }
        feedback.textContent = 'Uploading images…'
        const coverID = coverFile ? (await api('/store/media', 'POST', coverFile)).id : previous?.cover
        const galleryIDs: string[] = galleryFiles.length ? [] : previous?.gallery ?? []
        for (const file of galleryFiles) galleryIDs.push((await api('/store/media', 'POST', file)).id)
        let uploadId: string | undefined
        if (zip) {
          feedback.textContent = 'Uploading archive…'
          const upload = await api('/store/uploads', 'POST', { bytes: zip.size }); uploadId = upload.id
          const response = await fetch(upload.url, { method: 'PUT', body: zip }); if (!response.ok) throw new Error('Archive upload failed. Please try again.')
          feedback.textContent = 'Checking archive…'; await api('/store/uploads/' + uploadId + '/complete', 'POST', {})
        }
        await api('/store/assets' + (previous ? '/' + previous.id : ''), previous ? 'PATCH' : 'POST', { title: title.input.value, authorName: author.input.value, version: version.input.value, category: categorySelect.value, license: license.value, description: description.value, tags: tagValues, cover: coverID, gallery: galleryIDs, ...(uploadId ? { uploadId } : {}) })
        node.close(); notice.textContent = previous ? 'Changes saved.' : 'Your asset is live in the store.'; await load()
      } catch (error) { feedback.textContent = error instanceof Error ? error.message : 'Publishing failed' }
      finally { submit.disabled = false }
    }
  }
  try {
    config = await api('/store/categories'); renderCategories(); await load()
    const match = window.location.pathname.match(/^\/store\/assets\/([a-f0-9-]+)$/)
    if (match) await openAsset(match[1])
  } catch (error) { publishButton.disabled = true; more.hidden = true; retryButton.hidden = false; report(error); grid.append(el('p', 'The store is temporarily unavailable.', 'store-empty')) }
}
