const returnKey = 'ada.playground.returnTo'
const returnLifetime = 30 * 60 * 1000

type Session = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export function safePlaygroundReturn(value: unknown): string | null {
  if (typeof value !== 'string') return null
  return /^\/(?:games(?:\/[A-Za-z0-9-]+)?|cloud\/projects(?:\/[A-Za-z0-9-]+)?)\/?$/.test(value) ? value.replace(/\/$/, '') : null
}

export function playgroundSignInURL(path: string): string {
  const target = safePlaygroundReturn(path)
  return target ? '/cloud?continue=' + encodeURIComponent(target) : '/cloud'
}

export function rememberPlaygroundReturn(session: Session, value: unknown, now = Date.now()): void {
  const path = safePlaygroundReturn(value)
  if (path) session.setItem(returnKey, JSON.stringify({ path, expiresAt: now + returnLifetime }))
}

export function takePlaygroundReturn(session: Session, now = Date.now()): string | null {
  const saved = session.getItem(returnKey)
  session.removeItem(returnKey)
  try {
    const value = JSON.parse(saved ?? 'null')
    return typeof value?.expiresAt === 'number' && value.expiresAt > now && value.expiresAt <= now + returnLifetime ? safePlaygroundReturn(value.path) : null
  } catch { return null }
}

export function clearPlaygroundReturn(session: Session): void { session.removeItem(returnKey) }
