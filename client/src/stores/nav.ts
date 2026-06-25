import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface MenuItem {
  key: string
  to?: string
  children?: MenuItem[]
}

export const useNavStore = defineStore('nav', () => {
  const items = ref([
    { key: 'nav.home', to: '/' },
    { key: 'nav.todos', to: '/todos' },
    {
      key: 'nav.routes',
      children: [
        { key: 'nav.about', to: '/about' },
      ],
    },
    { key: 'nav.access', to: '/access' },
    { key: 'nav.sessions', to: '/sessions' },
  ])

  return { items }
})
