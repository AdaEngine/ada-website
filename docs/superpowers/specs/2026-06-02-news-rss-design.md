# News RSS Design

## Summary

AdaEngine News should expose a public RSS feed for published articles and advertise that feed through HTML autodiscovery. The feed must be generated from the same markdown article source that powers the `/blog` and `/articles/:slug` pages, so publishing a new article updates RSS during the normal build.

## Goals

- Generate `/rss.xml` for published, non-draft News articles.
- Include RSS autodiscovery in the document head with `rel="alternate"` and `type="application/rss+xml"`.
- Keep the implementation compatible with the current static Vite deployment.
- Reuse existing article frontmatter fields: `title`, `slug`, `description`, `date`, `author`, `tags`, `image`, `published`, and `draft`.

## Non-Goals

- Add Atom or JSON Feed output.
- Add per-tag feeds.
- Add visual RSS links or icons to the News page.
- Replace the existing markdown article loader used by the SPA.

## Approach

Add a Node build script at `scripts/generate-rss.mjs`. The script reads `src/content/articles/*.md`, parses the simple YAML-style frontmatter used by the existing content system, filters to published non-draft articles, sorts newest first, escapes XML fields, and writes `public/rss.xml`.

The RSS channel will use:

- `title`: `AdaEngine News`
- `link`: `https://adaengine.org/blog`
- `description`: the existing News SEO description
- `language`: `en`
- `lastBuildDate`: newest article date when available, otherwise current build date

Each item will include:

- `title`
- `link` and `guid`: `https://adaengine.org/articles/:slug`
- `description`: frontmatter description
- `pubDate`: RFC 822 date derived from frontmatter `date`
- `author`: article author name when present
- `category`: one entry per tag

Update `prebuild` so the existing `npm run build` path generates both geo assets and RSS before Vite copies `public` into `dist`.

## Autodiscovery

Add this to `index.html`:

```html
<link rel="alternate" type="application/rss+xml" title="AdaEngine News" href="https://adaengine.org/rss.xml" />
```

An absolute URL is used because the canonical production origin is already hardcoded in `src/seo.ts` and `public/robots.txt`.

## Testing

Extend the existing Node test suite in `src/routing.test.ts` or add a small RSS-focused test to verify:

- `public/rss.xml` exists after generation.
- It contains the expected channel title and article URL.
- The HTML document contains the RSS autodiscovery link.

Run `npm run build` as final verification so TypeScript, asset generation, RSS generation, and Vite output are checked together.

## Risks

Article dates are currently free-form strings. The RSS script should parse them with `new Date(...)` and fail clearly if a published article has an invalid date, because silent invalid `pubDate` values make feed readers unreliable.
