import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface MenuItem {
  key: string
  to?: string
  resource?: string
  action?: string
  children?: MenuItem[]
}

export const useNavStore = defineStore('nav', () => {
  const items = ref<MenuItem[]>([
    { key: 'nav.home', to: '/' },
    { key: 'nav.todos', to: '/todos' },
    {
      key: 'nav.management',
      children: [
        { key: 'nav.users', to: '/users', resource: 'users', action: 'read' },
        { key: 'nav.groups', to: '/groups', resource: 'casbin', action: 'read' },
        { key: 'nav.policies', to: '/policies', resource: 'casbin', action: 'read' },
      ],
    },
    { key: 'nav.devices', to: '/devices' },
  ])

  const permissionCache = ref<Record<string, boolean>>({})

  const visibleItems = computed(() => {
    function filter(items: MenuItem[]): MenuItem[] {
      return items.filter((item) => {
        if (item.resource) {
          return permissionCache.value[`${item.resource}:${item.action}`] !== false
        }
        if (item.children) {
          const filteredChildren = filter(item.children)
          if (filteredChildren.length === 0) return false
          item.children = filteredChildren
        }
        return true
      })
    }
    return filter(items.value)
  })

  return { items, visibleItems }
})
