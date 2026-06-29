import { useTokensStore } from '@/stores/tokens'

const cache = new Map<string, boolean>()

export function usePermission() {
  const tokensStore = useTokensStore()

  async function check(resource: string, action: string): Promise<boolean> {
    const key = `${resource}:${action}`
    if (cache.has(key)) return cache.get(key)!

    try {
      const res = await fetch('/api/casbin/enforce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensStore.accessToken}`,
        },
        body: JSON.stringify({ resource, action }),
      })
      if (!res.ok) {
        cache.set(key, false)
        return false
      }
      const { allowed } = await res.json()
      cache.set(key, allowed)
      return allowed
    } catch {
      cache.set(key, false)
      return false
    }
  }

  return { check }
}
