import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const siteOrigin = 'https://adaengine.org'
const articlesDir = join(root, 'src/content/articles')
const feedPath = join(root, 'public/rss.xml')
const channelDescription =
  'Read AdaEngine updates, release notes, engineering deep dives, and Swift game development articles from the project team.'

function parseFrontmatterValue(value) {
  if (value === 'true') return true
  if (value === 'false') return false
  return value.replace(/^['"]|['"]$/g, '')
}

function parseFrontmatter(raw) {
  const normalized = raw.replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---/)
  const frontmatter = {}
  let activeListKey = null

  if (!match) return frontmatter

  for (const line of match[1].split('\n')) {
    const trimmed = line.trim()

    if (!trimmed) {
      activeListKey = null
      continue
    }

    if (trimmed.startsWith('- ') && activeListKey) {
      const current = Array.isArray(frontmatter[activeListKey]) ? frontmatter[activeListKey] : []
      current.push(parseFrontmatterValue(trimmed.slice(2).trim()))
      frontmatter[activeListKey] = current
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

  return frontmatter
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function parseArticleDate(article) {
  const parsed = new Date(article.date)

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid RSS article date for ${article.slug}: ${article.date}`)
  }

  return parsed
}

function readArticles() {
  if (!existsSync(articlesDir)) return []

  return readdirSync(articlesDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const frontmatter = parseFrontmatter(readFileSync(join(articlesDir, file), 'utf8'))

      if (frontmatter.published === false || frontmatter.draft === true) return null

      if (!frontmatter.title || !frontmatter.slug || !frontmatter.description || !frontmatter.date) {
        throw new Error(`Invalid RSS article frontmatter in ${file}`)
      }

      return {
        title: frontmatter.title,
        slug: frontmatter.slug,
        description: frontmatter.description,
        date: frontmatter.date,
        author: frontmatter.author,
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags.filter((tag) => typeof tag === 'string') : [],
      }
    })
    .filter(Boolean)
    .sort((left, right) => parseArticleDate(right).getTime() - parseArticleDate(left).getTime())
}

function renderItem(article) {
  const url = `${siteOrigin}/articles/${article.slug}`
  const categories = article.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n')
  const author = article.author ? `\n      <author>${escapeXml(article.author)}</author>` : ''

  return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(article.description)}</description>
      <pubDate>${parseArticleDate(article).toUTCString()}</pubDate>${author}${categories ? `\n${categories}` : ''}
    </item>`
}

const articles = readArticles()
const lastBuildDate = articles.length ? parseArticleDate(articles[0]).toUTCString() : new Date().toUTCString()

writeFileSync(
  feedPath,
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AdaEngine News</title>
    <link>${siteOrigin}/blog</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${articles.map(renderItem).join('\n')}
  </channel>
</rss>
`,
)
