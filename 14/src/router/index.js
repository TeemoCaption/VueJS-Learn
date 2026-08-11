import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    // 根路徑導向第一個實際存在的頁面，避免直接開啟 / 時出現找不到路由的警告。
    path: '/',
    redirect: '/user'
  }, {
    // 網址
    path: '/user',

    // 路由名稱
    name: 'user',

    // 使用 lazy loading 載入頁面
    //
    // 注意：
    // Vue Router 的這種 lazy import
    // 本身不會成為 Suspense 的 async dependency
    component: () => import('../views/UserPage.vue')
  },

  {
    path: '/dashboard',

    name: 'dashboard',

    // 另一個 lazy-loaded route
    component: () => import('../views/DashboardPage.vue')
  }],
})

export default router
