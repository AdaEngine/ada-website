/** Only the public Cloud/Store pair shares browser sign-in. Test and production stay separate. */
export function browserSSOPeer(hostname = location.hostname): string | null {
  const peers: Record<string, string> = {
    'cloud.adaengine.org': 'https://store.adaengine.org',
    'cloud-test.adaengine.org': 'https://store-test.adaengine.org',
    'store.adaengine.org': 'https://cloud.adaengine.org',
    'store-test.adaengine.org': 'https://cloud-test.adaengine.org',
  }
  return peers[hostname] ?? null
}

export async function restoreBrowserSession(apiBase = '', signal?: AbortSignal): Promise<boolean> {
  const peer = browserSSOPeer()
  if (!peer) return false
  const timeout = AbortSignal.timeout(5000)
  const requestSignal = signal ? AbortSignal.any([signal, timeout]) : timeout
  try {
    const encode = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    const verifier = encode(crypto.getRandomValues(new Uint8Array(32)))
    const challenge = encode(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))))
    const source = await fetch(peer + '/v1/auth/sso', {
      method: 'POST', credentials: 'include', signal: requestSignal,
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ challenge }),
    })
    if (!source.ok) return false
    const { code } = await source.json()
    if (typeof code !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(code)) return false
    // Redeem on this host, so Identity sets this host's HttpOnly cookies.
    const destination = await fetch(apiBase + '/v1/auth/exchange', {
      method: 'POST', credentials: 'include', signal: requestSignal,
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, verifier }),
    })
    return destination.ok
  } catch { return false } // Guests and an unavailable peer keep the regular sign-in flow.
}
