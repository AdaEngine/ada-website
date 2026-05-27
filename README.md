# AdaWebsite

## Publishing

The site is built with Vite and deployed to GitHub Pages through `.github/workflows/pages.yml`.

The workflow runs on pushes to `main` or `master`, installs dependencies with `npm ci`, runs `npm run test`, builds the static bundle with `npm run build`, and publishes `dist`.

For project pages, the workflow sets `VITE_BASE_PATH` to `/<repository-name>/`. For user or organization pages ending in `.github.io`, it uses `/`.

## Markdown articles

Articles are stored in `src/content/articles/*.md`.

### Frontmatter fields

Required:

- `title` — article title
- `slug` — URL slug used in `/articles/:slug`
- `description` — short summary for list and page meta block
- `date` — publication date in ISO format (`YYYY-MM-DD`)

Optional:

- `tags` — array of tags, for example `[markdown, vite]`
- `published` — `true` or `false`, drafts are excluded from the list

### Route model

- `/blog` — article list
- `/articles/:slug` — article page

### Notes

- Markdown is imported at build time through `import.meta.glob`
- Existing static publication flow is preserved: content lives in the repository and is bundled into the final site
- Renderer currently supports headings, paragraphs, unordered lists, inline/code blocks, emphasis, strong text, and links
