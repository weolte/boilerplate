import { createRouter, createWebHistory } from 'vue-router'
import { useTokensStore } from '@/stores/tokens'
import { useUserStore } from '@/stores/user'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresRole?: string
    requiresAccess?: { resource: string; action: string }
  }
}

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
        meta: {
          requiresAccess: { resource: 'todos', action: 'read' },
        },
      },
      {
        path: 'users',
        component: () => import('@/views/Users.vue'),
        meta: {
          requiresAccess: { resource: 'users', action: 'read' },
        },
      },
      {
        path: 'groups',
        component: () => import('@/views/Groups.vue'),
        meta: {
          requiresAccess: { resource: 'casbin', action: 'read' },
        },
      },
      {
        path: 'policies',
        component: () => import('@/views/Policies.vue'),
        meta: {
          requiresAccess: { resource: 'casbin', action: 'read' },
        },
      },
      {
        path: 'access',
        component: () => import('@/views/Access.vue'),
        meta: {
          requiresRole: 'admin',
        },
      },
      {
        path: 'devices',
        component: () => import('@/views/Devices.vue'),
        meta: {
          requiresAccess: { resource: 'devices', action: 'read' },
        },
      },
    ],
  },

  {
    path: '/login',
    alias: '/unauthenticated',
    component: () => import('@/layouts/Auth.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/Login.vue'),
      },
    ],
  },

  {
    path: '/register',
    component: () => import('@/layouts/Auth.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/Register.vue'),
      },
    ],
  },

  {
    path: '/unauthorized',
    component: () => import('@/layouts/Auth.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/Unauthorized.vue'),
      },
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/layouts/Auth.vue'),
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

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !tokensStore.isAuthenticated) {
    return {
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  const routeMeta = to.matched.find(
    (record) => record.meta.requiresAccess || record.meta.requiresRole,
  )?.meta
  const requiresAccess = routeMeta?.requiresAccess
  const requiresRole = routeMeta?.requiresRole

  if (requiresAccess) {
    try {
      const res = await fetch('/api/casbin/enforce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensStore.accessToken}`,
        },
        body: JSON.stringify(requiresAccess),
      })
      if (!res.ok) return { path: '/unauthorized' }
      const { allowed } = await res.json()
      if (!allowed) return { path: '/unauthorized' }
    } catch {
      return { path: '/unauthorized' }
    }
  }

  if (requiresRole) {
    const userStore = useUserStore()
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
