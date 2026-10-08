export type CloudPublication = {
  id: string
  pageId?: string | null
  mode?: string
  expiresAt: number | null
  approved?: boolean
  releaseId?: string
  revoked?: boolean
  [key: string]: unknown
}

export function publicationAvailable(publication: CloudPublication, now = Date.now()): boolean {
  if (publication.revoked === true) return false
  if (publication.mode === 'ugc') return publication.approved === true && publication.expiresAt === null && !!publication.releaseId
  return typeof publication.expiresAt === 'number' && publication.expiresAt * 1000 > now
}

export function activePublicationForProject<T extends CloudPublication>(publications: T[], projectID: string, now = Date.now()): T | undefined {
  const active = publications.filter(publication => publication.pageId === projectID && publication.mode !== 'ugc-preview' && publicationAvailable(publication, now))
  return active.find(publication => publication.mode === 'ugc') ?? active[0]
}
