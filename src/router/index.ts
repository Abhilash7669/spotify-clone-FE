import { AUTH_UTILS } from '@/utils/auth'
import DashboardView from '@/view/DashboardView.vue'
import LoginView from '@/view/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      children: [
        {
          path: '/login',
          component: LoginView,
        },
        {
          path: 'dashboard',
          component: DashboardView,
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = AUTH_UTILS.getToken()

  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
