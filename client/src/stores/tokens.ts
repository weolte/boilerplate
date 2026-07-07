import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAccessTokenStore = defineStore(
  'accessToken',
  () => {
    const token = ref('')

    const isAuthenticated = computed(() => !!token.value)

    function set(newToken: string) {
      token.value = newToken
    }

    function clear() {
      token.value = ''
    }

    return {
      token,
      isAuthenticated,
      set,
      clear,
    }
  },
  {
    persist: {
      serializer: {
        serialize: (value) => value.token,
        deserialize: (value) => ({
          token: value,
        }),
      },
    },
  },
)
