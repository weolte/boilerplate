import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTokensStore = defineStore(
  'tokens',
  () => {
    const accessToken = ref('')
    const refreshToken = ref('')

    const isAuthenticated = computed(() => !!accessToken.value)

    function setTokens(tokens: { accessToken: string; refreshToken: string }) {
      accessToken.value = tokens.accessToken
      refreshToken.value = tokens.refreshToken
    }

    function setAccessToken(token: string) {
      accessToken.value = token
    }

    function clearTokens() {
      accessToken.value = ''
      refreshToken.value = ''
    }

    return {
      accessToken,
      refreshToken,
      isAuthenticated,
      setTokens,
      setAccessToken,
      clearTokens,
    }
  },
  {
    persist: true,
  },
)
