import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,

      meta: {
        // requiresAuth 是必要欄位
        requiresAuth: false,
      },
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView,

      meta: {
        requiresAuth: false,
      },
    },

    {
      path: '/about',
      name: 'about',
      component: AboutView,

      meta: {
        requiresAuth: false,
      },
    },

    {
      path: '/admin',
      name: 'admin',
      component: AdminView,

      meta: {
        // 管理員頁面需要登入
        requiresAuth: true,

        // 而且必須具有管理員權限
        isAdmin: true,
      },
    },
  ],
})

// 模擬目前登入狀態
const isLoggedIn = false

// 模擬目前是否為管理員
const currentUserIsAdmin = false

router.beforeEach((to) => {
  // TypeScript 現在知道 requiresAuth 是 boolean
  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      name: 'login',

      // 記住原本想前往的位置
      query: {
        redirect: to.fullPath,
      },
    }
  }

  // isAdmin 是 boolean | undefined
  if (to.meta.isAdmin && !currentUserIsAdmin) {
    return {
      name: 'home',
    }
  }
})

export default router
