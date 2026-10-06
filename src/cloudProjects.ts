export type CloudPublication = {
  id: string
  pageId?: string | null
  expiresAt: number
  revoked?: boolean
  [key: string]: unknown
}

export function activePublicationForProject<T extends CloudPublication>(publications: T[], projectID: string, now = Date.now()): T | undefined {
  return publications.find(publication => publication.pageId === projectID && publication.revoked !== true && publication.expiresAt * 1000 > now)
}
