export type DemoEntry = {
  product: string
  slug: string
  title: string
  tag: string
  tagTitle: string
  description: string
  sourcePath: string
  source: string
  embed: string
  hasBuild: boolean
}

export type DemosManifest = {
  schemaVersion: number
  generatedAt: string
  repository: string
  commit: string | null
  demos: DemoEntry[]
}

const emptyManifest: DemosManifest = {
  schemaVersion: 1,
  generatedAt: '',
  repository: 'AdaEngine/AdaEngine',
  commit: null,
  demos: [],
}

let manifestPromise: Promise<DemosManifest> | null = null
const sourceCache = new Map<string, Promise<string>>()

function assetFor(path: string): string {
  if (/^(https?:|data:|blob:|\/)/.test(path)) {
    return path
  }

  const normalizedBase = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`
  return `${normalizedBase}${path.replace(/^\/+/, '')}`
}

export async function loadDemosManifest(): Promise<DemosManifest> {
  manifestPromise ??= fetch(assetFor('demos/manifest.json'), { headers: { Accept: 'application/json' } })
    .then((response) => (response.ok ? response.json() : emptyManifest))
    .then((manifest: DemosManifest) => ({
      ...emptyManifest,
      ...manifest,
      demos: [...(manifest.demos ?? [])].sort((lhs, rhs) => lhs.tag.localeCompare(rhs.tag) || lhs.title.localeCompare(rhs.title)),
    }))
    .catch(() => emptyManifest)

  return manifestPromise
}

export async function loadDemoSource(demo: DemoEntry): Promise<string> {
  const sourceUrl = assetFor(demo.source)
  sourceCache.set(
    sourceUrl,
    sourceCache.get(sourceUrl) ??
      fetch(sourceUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load ${demo.source}`)
          }

          return response.text()
        })
        .catch(() => ''),
  )

  return sourceCache.get(sourceUrl) ?? ''
}

export function findDemoBySlug(manifest: DemosManifest, slug: string): DemoEntry | undefined {
  return manifest.demos.find((demo) => demo.slug === slug)
}

export function groupDemosByTag(demos: DemoEntry[]): Array<{ tag: string; title: string; demos: DemoEntry[] }> {
  const groups = new Map<string, { tag: string; title: string; demos: DemoEntry[] }>()

  for (const demo of demos) {
    const group = groups.get(demo.tag) ?? { tag: demo.tag, title: demo.tagTitle, demos: [] }
    group.demos.push(demo)
    groups.set(demo.tag, group)
  }

  return [...groups.values()]
}
