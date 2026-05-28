#!/usr/bin/env node

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const demosDirectory = path.resolve(process.argv[2] ?? 'public/demos')
const manifestName = 'ada-resource-manifest.json'
const resourceBundleExpression = /([^/]+\.resources)\/(.+)$/
const legacyOutputRoots = [
  demosDirectory,
  '/Users/vlad-prusakov/Developer/AdaEngine/dist/.website-demo-export-work',
  '/Users/vlad-prusakov/Developer/AdaEngine/dist/website-demos',
]

if (!existsSync(demosDirectory)) {
  fail(`Demos directory does not exist: ${demosDirectory}`)
}

let repairedDemos = 0
let copiedFiles = 0
const missingSources = []

for (const entry of readdirSync(demosDirectory, { withFileTypes: true })) {
  if (!entry.isDirectory()) {
    continue
  }

  const demoDirectory = path.join(demosDirectory, entry.name)
  const manifestPath = path.join(demoDirectory, manifestName)
  if (!existsSync(manifestPath)) {
    continue
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  if (!Array.isArray(manifest)) {
    fail(`Expected ${manifestPath} to contain a resource manifest array`)
  }

  const resourcesDirectory = path.join(demoDirectory, 'resources')
  const temporaryResourcesDirectory = path.join(demoDirectory, '.resources-repair')
  rmSync(temporaryResourcesDirectory, { recursive: true, force: true })

  const demoMissingSources = []
  for (const resource of manifest) {
    if (!resource || typeof resource.path !== 'string' || typeof resource.url !== 'string') {
      continue
    }

    const resourceMatch = resource.path.match(resourceBundleExpression)
    if (!resourceMatch) {
      continue
    }

    const [, bundleName, bundleRelativePath] = resourceMatch
    const sourcePath = resolveSourcePath(demoDirectory, resource)
    const destinationPath = path.join(temporaryResourcesDirectory, bundleName, bundleRelativePath)
    const nextURL = browserRelativeURL(path.posix.join('resources', bundleName, toPosixPath(bundleRelativePath)))

    if (!sourcePath) {
      demoMissingSources.push(`${entry.name}: ${resource.path}`)
      continue
    }

    mkdirSync(path.dirname(destinationPath), { recursive: true })
    copyFileSync(sourcePath, destinationPath)
    copiedFiles += 1

    resource.url = nextURL
  }

  if (demoMissingSources.length) {
    missingSources.push(...demoMissingSources)
    rmSync(temporaryResourcesDirectory, { recursive: true, force: true })
    continue
  }

  rmSync(resourcesDirectory, { recursive: true, force: true })
  renameSync(temporaryResourcesDirectory, resourcesDirectory)

  writeFileSync(manifestPath, swiftStyleJSON(manifest))
  repairedDemos += 1
}

if (missingSources.length) {
  for (const missing of missingSources.slice(0, 20)) {
    console.error(`Missing resource source: ${missing}`)
  }
  if (missingSources.length > 20) {
    console.error(`...and ${missingSources.length - 20} more missing resources`)
  }
  process.exit(1)
}

console.log(`Repaired ${repairedDemos} demo resource manifests; copied ${copiedFiles} resource files.`)

function resolveSourcePath(demoDirectory, resource) {
  const absolutePath = path.resolve(resource.path)
  if (path.isAbsolute(resource.path) && isRegularFile(absolutePath)) {
    return absolutePath
  }

  const urlPath = resource.url.replace(/^\.\//, '')
  const localPath = path.join(demoDirectory, decodeURI(urlPath))
  if (isRegularFile(localPath)) {
    return localPath
  }

  if (path.isAbsolute(resource.path)) {
    const legacyRelativePath = resource.path.slice(1)
    for (const root of legacyOutputRoots) {
      if (!existsSync(root)) {
        continue
      }

      for (const candidateDirectory of readdirSync(root, { withFileTypes: true })) {
        if (!candidateDirectory.isDirectory()) {
          continue
        }

        const candidatePath = path.join(root, candidateDirectory.name, legacyRelativePath)
        if (isRegularFile(candidatePath)) {
          return candidatePath
        }
      }
    }
  }

  return undefined
}

function isRegularFile(filePath) {
  try {
    return statSync(filePath).isFile()
  } catch {
    return false
  }
}

function browserRelativeURL(relativePath) {
  return `./${relativePath.split('/').map(encodeURIComponent).join('/')}`
}

function swiftStyleJSON(value) {
  return `${JSON.stringify(value, null, 2)
    .replace(/\//g, '\\/')
    .replace(/^(\s+"[^"]+"): /gm, '$1 : ')}\n`
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/')
}

function fail(message) {
  console.error(message)
  process.exit(1)
}
