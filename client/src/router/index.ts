import { createRouter, createWebHistory } from 'vue-router'
import { useTokensStore } from '@/stores/tokens'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/Main.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'todos',
        component: () => import('@/views/Todos.vue'),
      },
      {
        path: 'access',
        component: () => import('@/views/Access.vue'),
      },
    ],
  },

  {
    path: '/unauthenticated',
    component: () => import('@/views/Unauthenticated.vue'),
  },

  {
    path: '/unauthorized',
    component: () => import('@/views/Unauthorized.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const tokensStore = useTokensStore()

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !tokensStore.isAuthenticated) {
    return {
      query: {
        redirect: to.fullPath,
      },
    }
  }

  return true
})

export default router
