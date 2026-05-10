import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface MenuItem {
  label: string
  to?: string
  children?: MenuItem[]
}

export const useNavStore = defineStore('nav', () => {
  const items = ref([
    { label: 'Home', to: '/' },
    { label: 'Todos', to: '/todos' },
    {
      label: 'Hover',
      children: [
        { label: 'Item 1' },
        { label: 'About', to: '/about' },
        {
          label: 'Hover',
          children: [
            { label: 'Item 1' },
            { label: 'About', to: '/about' },
            {
              label: 'Hover',
              children: [{ label: 'Item 1' }, { label: 'About', to: '/about' }],
            },
          ],
        },
      ],
    },
    { label: 'Routes', to: '/routes' },
    { label: 'Access', to: '/access' },
  ])

  return { items }
})
