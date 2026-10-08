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
- Renderer currently supports headings, paragraphs, unordered lists, inline/code blocks, emphasis, strong text, and links
