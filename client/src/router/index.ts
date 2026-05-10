import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/todos',
    component: () => import('@/views/Todos.vue'),
  },
  {
    path: '/routes',
    component: () => import('@/views/Routes.vue'),
  },
  {
    path: '/access',
    component: () => import('@/views/Access.vue'),
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

export default router
