import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTokensStore = defineStore(
  'tokens',
  () => {
    const accessToken = ref('')
    const refreshToken = ref('')
    return { accessToken, refreshToken }
  },
  {
    persist: true,
  },
)
