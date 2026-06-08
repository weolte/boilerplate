import { createFetch } from '@vueuse/core'
import { useTokensStore } from '@/stores/tokens'

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken() {
  const tokensStore = useTokensStore()

  if (!tokensStore.refreshToken) return null

  // чтобы несколько запросов одновременно не обновляли токен
  if (!refreshPromise) {
    refreshPromise = fetch('/api/auth/refresh', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokensStore.refreshToken}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Refresh failed')

        const data = await res.json()

        tokensStore.accessToken = data.accessToken

        if (data.refreshToken) tokensStore.refreshToken = data.refreshToken

        return data.accessToken
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

export const useApi = createFetch({
  baseUrl: '/api',

  options: {
    async beforeFetch({ options }) {
      const tokensStore = useTokensStore()

      if (tokensStore.accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${tokensStore.accessToken}`,
        }
      }

      return { options }
    },

    async onFetchError(ctx) {
      const tokensStore = useTokensStore()

      if (ctx.response?.status === 401 && tokensStore.refreshToken) {
        try {
          const newAccessToken = await refreshAccessToken()

          if (!newAccessToken) return ctx

          // повторяем исходный запрос
          const response = await fetch(ctx.response.url, {
            ...ctx.context.options,
            headers: {
              ...ctx.context.options.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          })

          ctx.response = response
          ctx.error = null
        } catch {}
      }

      return ctx
    },
  },
})
