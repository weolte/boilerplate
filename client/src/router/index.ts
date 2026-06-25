import { createRouter, createWebHistory } from 'vue-router'
import { useTokensStore } from '@/stores/tokens'
import { useUserStore } from '@/stores/user'

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
        meta: {
          requiresRole: 'admin',
        },
      },
      {
        path: 'sessions',
        component: () => import('@/views/Sessions.vue'),
      },
    ],
  },

  {
    path: '/unauthenticated',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/Unauthenticated.vue'),
      },
    ],
  },

  {
    path: '/unauthorized',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/Unauthorized.vue'),
      },
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/NotFound.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const tokensStore = useTokensStore()
  const userStore = useUserStore()

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !tokensStore.isAuthenticated) {
    return {
      path: '/unauthenticated',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  const requiresRole = to.matched.find((record) => record.meta.requiresRole)?.meta?.requiresRole as string | undefined

  if (requiresRole) {
    if (userStore.roles.length === 0) {
      try {
        await userStore.fetchRoles()
      } catch {
        return { path: '/unauthorized' }
      }
    }

    if (!userStore.hasRole(requiresRole)) {
      return { path: '/unauthorized' }
    }
  }

  return true
})

export default router
