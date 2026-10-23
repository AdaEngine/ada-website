# AdaWebsite

## Publishing

The site is built with Vite and deployed to GitHub Pages through `.github/workflows/pages.yml`.

The workflow runs on pushes to `main` or `master`, installs dependencies with `npm ci`, runs `npm run test`, builds the static bundle with `npm run build`, and publishes `dist` to `AdaEngine/adaengine.github.io`.

The production site is published at `https://adaengine.org/`, so the Vite base path defaults to `/`. The `AdaEngine/adaengine.github.io` repository owns the custom domain, and this repository only builds and pushes the generated site there. Use `VITE_BASE_PATH` only for explicit non-root preview deployments.

## Link preview image

The default link preview is `public/images/social/ada-preview-v2.png` (1200 × 630).
It is the approved raster design with a blurred Ada Studio code editor background,
based on `public/images/studio/desktop.png`. The original flat-background layout
is preserved as `ada-preview-v1.svg` and `ada-preview-v1.png` in the same directory.
The final PNG is included directly; the website build needs no image generation tools.

Set the same absolute image URL in `index.html` (Open Graph and Twitter metadata)
and `src/seo.ts` (`defaultSeoImage`). Preview crawlers receive the static HTML,
so changing only the client-side SEO metadata is insufficient. Studio keeps its
own preview, and articles with an explicit image keep that image.

For future replacements, use a new image filename and update both references
to avoid reusing a cached image. Publish through the regular Pages workflow,
then check a newly shared link; messaging services may still cache the page preview.

## Support redirect

`feedback/index.html` redirects `https://feedback.adaengine.org/` to
`https://github.com/AdaEngine/AdaEngine/issues`. It uses `location.replace` to avoid
leaving a redirect entry in browser history, with a meta refresh for browsers
without JavaScript and a visible fallback link.

`.github/workflows/feedback.yml` deploys this small standalone site to the Pages
site of **AdaEngine/ada-website**. The main website continues to publish to
**AdaEngine/adaengine.github.io** through its existing workflow. The feedback
workflow runs on changes to its source or workflow, and can also run manually.
Its 404 page redirects to the same Issues page.

One-time setup:

1. In **AdaEngine/ada-website → Settings → Pages**, select **GitHub Actions** as
   the source and set the custom domain to `feedback.adaengine.org`.
2. In Cloudflare DNS for `adaengine.org`, add a **DNS only** CNAME record with
   name `feedback` and target `adaengine.github.io`.
3. Publish the workflow and redirect source, then run **Deploy feedback redirect**.
4. Once GitHub provisions the certificate, enable **Enforce HTTPS** in Pages
   settings and verify that `https://feedback.adaengine.org/` opens GitHub Issues.

Custom workflows require the domain to be configured in Pages settings; a
`CNAME` file in the artifact does not configure it. See the
[GitHub Pages custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

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
- The postbuild step also generates a static entry point for each published article, using the client Markdown renderer and article SEO metadata. Direct article links return HTTP 200, and link previews receive the article title, summary, and cover before JavaScript runs.
- Renderer currently supports headings, paragraphs, unordered lists, inline/code blocks, emphasis, strong text, and links

## Website languages

English uses the original paths (`/download`); Russian uses `/ru/download`,
`/ru/studio`, and the same prefix for every other public website route.
On entry, an explicit Russian URL takes priority, then the user's saved choice,
then `navigator.languages`. Unsupported languages fall back to English.
No IP lookup or geolocation service is required.

The footer switches to the same page in either language, preserving its query
and fragment. The choice is saved in `localStorage` (`ada-site-language`). If
storage is blocked, a `lang` query parameter carries the explicit choice.
Standalone Store and Cloud use the same catalog, detection rules and footer picker.
Their own hostnames support `/ru` and `/ru/cloud`; Store sign-in stays on its
own origin so its Identity proxy and session cookie continue to work.
Creator-provided asset names, descriptions and reviews remain unchanged.

UI translations live in `src/locales/ru.json`, keyed by the English source copy.
Use `t('English source copy')` for new website text; untranslated keys fall back
to English. Product names, source code, and documentation links stay intact.
The two release articles remain English and show a notice on Russian pages.

`npm run build` generates static entry points for both languages, with localized
metadata, canonical URLs and `hreflang` links. `npm run geo` includes both language
versions in the sitemap. Run `npm test` for routing, detection, switching, page
rendering and existing application contract checks.


## Cloud account and Store frontend builds

`npm run build:store` emits `dist-store`. `npm run build:cloud-site` emits
`dist-cloud-site`, the account/catalog frontend for the existing Cloud host,
using the same shared editorial theme as the main website and Store.
Both keep `/v1` requests on the current origin. The shared theme is bundled
as part of each artifact; publishing the main website alone does not update
either service's independently hosted static files.

The separate `build:cloud` command still assembles the Studio Playground shell
from the sibling AdaEngine checkout. It is independent of `build:cloud-site`.
Do not replace a deployed Cloud artifact with the Playground build as part of
a theme or translation-only rollout. Deployment of either product is separate
from building or committing its source.
