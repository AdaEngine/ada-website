import { highlightCode, languageClass } from './codeHighlight.ts'
import authorEntries from '../Resources/authors.json' with { type: 'json' }

export type ArticleAuthor = {
  name: string
  url?: string
}

export type ArticleFrontmatter = {
  title: string
  slug: string
  description: string
  date: string
  author: ArticleAuthor
  tags?: string[]
  image?: string
  published?: boolean
  draft?: boolean
  featured?: boolean
}

export type Article = ArticleFrontmatter & {
  html: string
  excerpt: string
  readingTime: number
  toc: ArticleHeading[]
}

export type ArticleHeading = {
  id: string
  title: string
  level: 2 | 3
}

type AuthorSocial = {
  username?: string
  social?: string
  url?: string
}

type AuthorEntry = {
  name: string
  username?: string
  url?: string
  profileUrl?: string
  socials?: AuthorSocial[]
}

const authors = authorEntries as AuthorEntry[]

const markdownModules = import.meta.env
  ? (import.meta.glob('./content/articles/*.md', {
      eager: true,
      query: '?raw',
      import: 'default',
    }) as Record<string, string>)
  : {}

function parseFrontmatter(raw: string): { frontmatter: Record<string, unknown>; body: string } {
  const normalized = raw.replace(/\r\n/g, '\n')

  if (!normalized.startsWith('---\n')) {
    return { frontmatter: {}, body: normalized.trim() }
  }

  const end = normalized.indexOf('\n---\n', 4)

  if (end === -1) {
    return { frontmatter: {}, body: normalized.trim() }
  }

  const frontmatterBlock = normalized.slice(4, end)
  const body = normalized.slice(end + 5).trim()
  const frontmatter: Record<string, unknown> = {}
  let activeListKey: string | null = null

  for (const line of frontmatterBlock.split('\n')) {
    const trimmed = line.trim()

    if (!trimmed) {
      activeListKey = null
      continue
    }

    if (trimmed.startsWith('- ') && activeListKey) {
      const current = frontmatter[activeListKey]
      const nextValue = parseFrontmatterValue(trimmed.slice(2).trim())
      const list = Array.isArray(current) ? current : []
      list.push(nextValue)
      frontmatter[activeListKey] = list
      continue
    }

    const separatorIndex = line.indexOf(':')

    if (separatorIndex === -1) {
      activeListKey = null
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim()

    if (!value) {
      frontmatter[key] = []
      activeListKey = key
      continue
    }

    frontmatter[key] = parseFrontmatterValue(value)
    activeListKey = null
  }

  return { frontmatter, body }
}

function parseFrontmatterValue(value: string): unknown {
  if (value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((entry) => entry.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }

  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  return value.replace(/^['"]|['"]$/g, '')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function assetFor(path: string): string {
  if (/^(https?:|data:|blob:|\/)/.test(path)) {
    return path
  }

  const normalizedBase = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`
  return `${normalizedBase}${path.replace(/^\/+/, '')}`
}

function isExternalUrl(value: string): boolean {
  return /^https?:\/\//.test(value)
}

function normalizeAuthorKey(value: string): string {
  return value.trim().replace(/^@/, '').toLowerCase()
}

function authorUrlFor(author: AuthorEntry): string | undefined {
  if (typeof author.url === 'string') return author.url
  if (typeof author.profileUrl === 'string') return author.profileUrl

  const github = author.socials?.find((social) => social.social === 'github')
  if (typeof github?.url === 'string') return github.url
  if (typeof github?.username === 'string') return `https://github.com/${github.username.replace(/^@/, '')}`
  if (typeof author.username === 'string') return `https://github.com/${author.username.replace(/^@/, '')}`

  return undefined
}

function resolveAuthor(value: unknown, filePath: string): ArticleAuthor {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Invalid article author in ${filePath}`)
  }

  const key = normalizeAuthorKey(value)
  const author = authors.find((entry) => normalizeAuthorKey(entry.username ?? entry.name) === key || normalizeAuthorKey(entry.name) === key)

  if (!author) {
    if (isExternalUrl(value)) return { name: value, url: value }
    return { name: value }
  }

  return {
    name: author.name,
    url: authorUrlFor(author),
  }
}

function renderSafeLink(label: string, href: string): string {
  if (!/^(https?:\/\/|\/|\.\/|\.\.\/|[A-Za-z0-9/_-])/.test(href)) {
    return renderInlineText(label)
  }

  const escapedHref = escapeHtml(href)
  const target = isExternalUrl(href) ? ' target="_blank" rel="noreferrer"' : ''
  return `<a href="${escapedHref}"${target}>${renderInlineText(label)}</a>`
}

function renderInlineText(text: string): string {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

function findMarkdownLinkClose(text: string, startIndex: number): number {
  let depth = 0

  for (let index = startIndex; index < text.length; index += 1) {
    const character = text[index]

    if (character === '(') {
      depth += 1
      continue
    }

    if (character === ')') {
      if (depth === 0) {
        return index
      }

      depth -= 1
    }
  }

  return -1
}

function renderInlineMarkdown(text: string): string {
  let html = ''
  let cursor = 0

  while (cursor < text.length) {
    const linkStart = text.indexOf('[', cursor)

    if (linkStart === -1) {
      html += renderInlineText(text.slice(cursor))
      break
    }

    const labelEnd = text.indexOf(']', linkStart + 1)

    if (labelEnd === -1 || text[labelEnd + 1] !== '(') {
      html += renderInlineText(text.slice(cursor, linkStart + 1))
      cursor = linkStart + 1
      continue
    }

    const hrefStart = labelEnd + 2
    const hrefEnd = findMarkdownLinkClose(text, hrefStart)

    if (hrefEnd === -1) {
      html += renderInlineText(text.slice(cursor, linkStart + 1))
      cursor = linkStart + 1
      continue
    }

    html += renderInlineText(text.slice(cursor, linkStart))
    html += renderSafeLink(text.slice(linkStart + 1, labelEnd), text.slice(hrefStart, hrefEnd))
    cursor = hrefEnd + 1
  }

  return html
}

function humanizeLanguage(language: string): string {
  const normalized = language.toLowerCase()
  const labels: Record<string, string> = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    json: 'JSON',
    md: 'Markdown',
    markdown: 'Markdown',
    sh: 'Shell',
    shell: 'Shell',
    swift: 'Swift',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    yaml: 'YAML',
    yml: 'YAML',
  }

  return labels[normalized] ?? (language ? language[0].toUpperCase() + language.slice(1) : 'Code')
}

function parseCodeFenceMeta(meta: string): { language: string; title: string } {
  const titleMatch = meta.match(/(?:^|\s)(?:title|filename)=["']([^"']+)["']/)
  const language = meta.split(/\s+/)[0]?.replace(/[^\w#+-]/g, '') ?? ''
  const title = titleMatch?.[1] ?? meta.replace(language, '').trim().replace(/^["']|["']$/g, '')

  return { language, title }
}

function renderCodeBlock(code: string, language: string, title: string): string {
  const label = humanizeLanguage(language)

  return `
    <figure class="article-code-block">
      <figcaption>
        <span>${escapeHtml(title)}</span>
        <span>${escapeHtml(label)}</span>
      </figcaption>
      <pre><code class="${languageClass(language)}">${highlightCode(code, language)}</code></pre>
    </figure>
  `
}

function renderArticleMedia(line: string): string | null {
  const mediaMatch = line.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)$/)
  const videoMatch = line.match(/^::video\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)$/)
  const match = mediaMatch ?? videoMatch

  if (!match) {
    return null
  }

  const [, alt, rawSrc, title] = match
  const src = assetFor(rawSrc)
  const caption = title || alt
  const isVideo = Boolean(videoMatch) || /\.(mp4|webm|ogg|mov)$/i.test(rawSrc)
  const media = isVideo
    ? `<video controls playsinline preload="metadata" src="${escapeHtml(src)}">${escapeHtml(alt)}</video>`
    : `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" />`

  return `
    <figure class="article-media ${isVideo ? 'article-media-video' : 'article-media-image'}">
      ${media}
      ${caption ? `<figcaption>${renderInlineMarkdown(caption)}</figcaption>` : ''}
    </figure>
  `
}

function renderRichLines(lines: string[]): string {
  const html: string[] = []
  let inList = false

  const flushList = () => {
    if (inList) {
      html.push('</ul>')
      inList = false
    }
  }

  for (const rawLine of lines) {
    const trimmed = rawLine.trim()

    if (!trimmed) {
      flushList()
      continue
    }

    if (trimmed.startsWith('- ')) {
      if (!inList) {
        html.push('<ul>')
        inList = true
      }

      html.push(`<li>${renderInlineMarkdown(trimmed.slice(2))}</li>`)
      continue
    }

    flushList()
    html.push(`<p>${renderInlineMarkdown(trimmed)}</p>`)
  }

  flushList()
  return html.join('\n')
}

function renderAdmonition(type: string, title: string, lines: string[]): string {
  const normalizedType = ['note', 'tip', 'warning', 'danger', 'info'].includes(type) ? type : 'note'
  const fallbackTitle: Record<string, string> = {
    danger: 'Important',
    info: 'Info',
    note: 'Note',
    tip: 'Tip',
    warning: 'Warning',
  }

  return `
    <aside class="article-callout article-callout-${normalizedType}">
      <span class="article-callout-icon" aria-hidden="true">!</span>
      <div>
        <p class="article-callout-title">${renderInlineMarkdown(title || fallbackTitle[normalizedType])}</p>
        ${renderRichLines(lines)}
      </div>
    </aside>
  `
}

function createHeadingId(title: string, usedIds: Map<string, number>): string {
  const baseId =
    title
      .toLowerCase()
      .replace(/`([^`]+)`/g, '$1')
      .replace(/&[a-z]+;/gi, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  const count = usedIds.get(baseId) ?? 0
  usedIds.set(baseId, count + 1)

  return count === 0 ? baseId : `${baseId}-${count + 1}`
}

export function markdownToHtml(markdown: string): { html: string; toc: ArticleHeading[] } {
  const lines = markdown.split('\n')
  const html: string[] = []
  const toc: ArticleHeading[] = []
  const usedHeadingIds = new Map<string, number>()
  let inList = false
  let inCodeBlock = false
  let codeLanguage = ''
  let codeTitle = ''
  let codeBuffer: string[] = []
  let inAdmonition = false
  let admonitionType = 'note'
  let admonitionTitle = ''
  let admonitionBuffer: string[] = []

  const flushList = () => {
    if (inList) {
      html.push('</ul>')
      inList = false
    }
  }

  const flushCodeBlock = () => {
    if (inCodeBlock) {
      html.push(renderCodeBlock(codeBuffer.join('\n'), codeLanguage, codeTitle))
      inCodeBlock = false
      codeLanguage = ''
      codeTitle = ''
      codeBuffer = []
    }
  }

  const flushAdmonition = () => {
    if (inAdmonition) {
      html.push(renderAdmonition(admonitionType, admonitionTitle, admonitionBuffer))
      inAdmonition = false
      admonitionType = 'note'
      admonitionTitle = ''
      admonitionBuffer = []
    }
  }

  for (const line of lines) {
    if (line.startsWith('```')) {
      flushList()
      flushAdmonition()

      if (inCodeBlock) {
        flushCodeBlock()
      } else {
        const meta = parseCodeFenceMeta(line.slice(3).trim())
        codeLanguage = meta.language
        codeTitle = meta.title
        inCodeBlock = true
      }

      continue
    }

    if (inCodeBlock) {
      codeBuffer.push(line)
      continue
    }

    if (line.trim() === ':::') {
      flushList()
      flushAdmonition()
      continue
    }

    if (inAdmonition) {
      admonitionBuffer.push(line)
      continue
    }

    const trimmed = line.trim()

    if (!trimmed) {
      flushList()
      continue
    }

    if (trimmed.startsWith('- ')) {
      if (!inList) {
        html.push('<ul>')
        inList = true
      }

      html.push(`<li>${renderInlineMarkdown(trimmed.slice(2))}</li>`)
      continue
    }

    flushList()

    const admonitionMatch = trimmed.match(/^:::(note|tip|warning|danger|info)(?:\s+(.+))?$/i)

    if (admonitionMatch) {
      admonitionType = admonitionMatch[1].toLowerCase()
      admonitionTitle = admonitionMatch[2] ?? ''
      admonitionBuffer = []
      inAdmonition = true
      continue
    }

    const media = renderArticleMedia(trimmed)

    if (media) {
      html.push(media)
      continue
    }

    if (trimmed.startsWith('### ')) {
      const title = trimmed.slice(4)
      const id = createHeadingId(title, usedHeadingIds)
      toc.push({ id, title, level: 3 })
      html.push(`<h3 id="${escapeHtml(id)}">${renderInlineMarkdown(title)}</h3>`)
      continue
    }

    if (trimmed.startsWith('## ')) {
      const title = trimmed.slice(3)
      const id = createHeadingId(title, usedHeadingIds)
      toc.push({ id, title, level: 2 })
      html.push(`<h2 id="${escapeHtml(id)}">${renderInlineMarkdown(title)}</h2>`)
      continue
    }

    if (trimmed.startsWith('# ')) {
      html.push(`<h1>${renderInlineMarkdown(trimmed.slice(2))}</h1>`)
      continue
    }

    html.push(`<p>${renderInlineMarkdown(trimmed)}</p>`)
  }

  flushList()
  flushCodeBlock()
  flushAdmonition()

  return { html: html.join('\n'), toc }
}

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/^#.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[*`_>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function createExcerpt(markdown: string): string {
  return stripMarkdown(markdown).slice(0, 180)
}

function calculateReadingTime(markdown: string): number {
  const words = stripMarkdown(markdown).split(' ').filter(Boolean).length
  return Math.max(1, Math.ceil(words / 180))
}

function assertFrontmatter(frontmatter: Record<string, unknown>, filePath: string): ArticleFrontmatter {
  const title = frontmatter.title
  const slug = frontmatter.slug
  const description = frontmatter.description
  const date = frontmatter.date
  const author = frontmatter.author
  const tags = frontmatter.tags
  const image = frontmatter.image
  const published = frontmatter.published
  const draft = frontmatter.draft
  const featured = frontmatter.featured

  if (typeof title !== 'string' || typeof slug !== 'string' || typeof description !== 'string' || typeof date !== 'string') {
    throw new Error(`Invalid article frontmatter in ${filePath}`)
  }

  return {
    title,
    slug,
    description,
    date,
    author: resolveAuthor(author, filePath),
    tags: Array.isArray(tags) ? tags.filter((tag): tag is string => typeof tag === 'string') : [],
    image: typeof image === 'string' ? image : undefined,
    published: typeof published === 'boolean' ? published : true,
    draft: typeof draft === 'boolean' ? draft : false,
    featured: typeof featured === 'boolean' ? featured : false,
  }
}

export const articles: Article[] = Object.entries(markdownModules)
  .map(([filePath, raw]) => {
    const { frontmatter, body } = parseFrontmatter(raw)
    const meta = assertFrontmatter(frontmatter, filePath)
    const rendered = markdownToHtml(body)

    return {
      ...meta,
      excerpt: createExcerpt(body),
      html: rendered.html,
      readingTime: calculateReadingTime(body),
      toc: rendered.toc,
    }
  })
  .filter((article) => article.published && !article.draft)
  .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())

export const featuredArticles = articles.filter((article) => article.featured)

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}
