import { createFetch } from '@vueuse/core'
import { useAccessTokenStore } from '@/stores/tokens'
import router from '@/router'

export const useApi = createFetch({
  baseUrl: '/api',
  options: {
    async beforeFetch(ctx) {
      const accessTokenStore = useAccessTokenStore()

      if (accessTokenStore.token) {
        ctx.options.headers = {
          ...ctx.options.headers,
          Authorization: `Bearer ${accessTokenStore.token}`,
        }
      }

      return ctx
    },
    async onFetchError(ctx) {
      const accessTokenStore = useAccessTokenStore()

      if (
        ctx.response?.status === 401 &&
        accessTokenStore.token &&
        router.currentRoute.value.path !== '/login'
      ) {
        accessTokenStore.clear()
        await router.replace('/login')
      }

      return ctx
    },
  },
})
