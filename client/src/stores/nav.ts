import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface MenuItem {
  key: string
  to?: string
  children?: MenuItem[]
}

export const useNavStore = defineStore('nav', () => {
  const items = ref<MenuItem[]>([
    { key: 'nav.home', to: '/' },
    { key: 'nav.todos', to: '/todos' },
    {
      key: 'nav.management',
      children: [
        { key: 'nav.users', to: '/users' },
        { key: 'nav.groups', to: '/groups' },
        { key: 'nav.policies', to: '/policies' },
      ],
    },
    { key: 'nav.devices', to: '/devices' },
  ])

  return { items }
})