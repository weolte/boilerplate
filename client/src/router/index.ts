import { createRouter, createWebHistory } from 'vue-router'
import { useAccessTokenStore } from '@/stores/tokens'
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
        meta: {
          requiresRoles: ['any'],
        },
      },
      {
        path: 'todos',
        component: () => import('@/views/Todos.vue'),
        meta: {
          requiresRoles: ['user'],
        },
      },
      {
        path: 'users',
        component: () => import('@/views/Users.vue'),
        meta: {
          requiresRoles: ['admin'],
        },
      },
      {
        path: 'devices',
        component: () => import('@/views/Devices.vue'),
        meta: {
          requiresRoles: ['user'],
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

export default router
