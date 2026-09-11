export type DesktopPlatform = 'windows' | 'macos' | 'linux'
export type ReleaseAsset = { name: string; url: string }
export type DownloadRelease = { version: string; url: string; assets: ReleaseAsset[] }

export const appStoreURL = 'https://apps.apple.com/app/id6809145006'
// Last verified public release. Keep links usable when the GitHub API is unavailable.
export const fallbackRelease: DownloadRelease = {
  version: '1.0',
  url: 'https://github.com/AdaEngine/AdaEngine/releases/tag/editor-v1.0-1',
  assets: [{
    name: 'AdaEngine-1.0-1-macOS.zip',
    url: 'https://github.com/AdaEngine/AdaEngine/releases/download/editor-v1.0-1/AdaEngine-1.0-1-macOS.zip',
  }],
}

function releaseURL(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname === 'github.com' && !url.username && !url.password
      && url.pathname.startsWith('/AdaEngine/AdaEngine/releases/') ? url.href : undefined
  } catch { return undefined }
}

export function parseRelease(value: unknown): DownloadRelease | undefined {
  if (!value || typeof value !== 'object') return undefined
  const item = value as Record<string, unknown>
  const url = releaseURL(item.html_url)
  if (item.draft || item.prerelease || typeof item.tag_name !== 'string' || !url) return undefined
  const editorVersion = item.tag_name.match(/^editor-v(\d+\.\d+(?:\.\d+)?)-\d+$/)?.[1]
  const version = editorVersion ?? item.tag_name.replace(/^(?:editor-)?v/, '')
  if (!/^\d+\.\d+(?:\.\d+)?(?:[-.][a-zA-Z0-9]+)*$/.test(version)) return undefined
  const assets: ReleaseAsset[] = []
  if (Array.isArray(item.assets)) {
    for (const asset of item.assets) {
      if (!asset || typeof asset !== 'object') continue
      const downloadURL = releaseURL(asset.browser_download_url)
      if (typeof asset.name === 'string' && downloadURL) assets.push({ name: asset.name, url: downloadURL })
    }
  }
  return { version, url, assets }
}

export function assetsFor(platform: DesktopPlatform, release: DownloadRelease): ReleaseAsset[] {
  return release.assets.filter(({ name }) => {
    if (/\.(?:sha\d*|sig|asc|blockmap)$/i.test(name)) return false
    if (platform === 'windows') return /\.(?:exe|msi)$/i.test(name) || /(?:windows|win32|win64).*\.zip$/i.test(name)
    if (platform === 'macos') return /\.(?:dmg|pkg)$/i.test(name) || /(?:macos|mac|darwin|osx).*\.zip$/i.test(name)
    return /\.appimage$/i.test(name) || /linux.*\.(?:zip|tar\.gz|tar\.xz|deb|rpm)$/i.test(name)
  })
}

export function assetLabel(asset: ReleaseAsset): string {
  if (/(?:arm64|aarch64|apple-silicon)/i.test(asset.name)) return 'Download · ARM64'
  if (/(?:x86_64|amd64|x64|intel)/i.test(asset.name)) return 'Download · Intel / AMD'
  return 'Download'
}

export function selectDownloadRelease(data: unknown): DownloadRelease {
  if (!Array.isArray(data)) return fallbackRelease
  const releases = data.map(parseRelease).filter((release): release is DownloadRelease => release !== undefined)
  // A source-only engine release must not hide an already published editor installer.
  return releases.find(release => (['macos', 'windows', 'linux'] as const).some(platform => assetsFor(platform, release).length > 0))
    ?? (fallbackRelease.assets.length ? fallbackRelease : releases[0] ?? fallbackRelease)
}

export async function loadDownloadRelease(): Promise<DownloadRelease> {
  try {
    const response = await fetch('https://api.github.com/repos/AdaEngine/AdaEngine/releases?per_page=20', {
      headers: { Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return fallbackRelease
    const data: unknown = await response.json()
    return selectDownloadRelease(data)
  } catch { /* The checked-in release stays available when offline or rate limited. */ }
  return fallbackRelease
}
