import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApi } from '@/lib/api'

export const useUserStore = defineStore('user', () => {
  const user = ref<any>(null)
  const roles = ref<string[]>([])

  async function fetchUser() {
    const { data } = await useApi('/auth/me').get().json()
    user.value = (data as any)?.value || null
  }

  async function fetchRoles() {
    const { data } = await useApi('/casbin/user-roles').get().json()
    roles.value = (data as any)?.value || []
  }

  function hasRole(role: string) {
    return roles.value.includes(role)
  }

  function clear() {
    user.value = null
    roles.value = []
  }

  return { user, roles, fetchUser, fetchRoles, hasRole, clear }
})
