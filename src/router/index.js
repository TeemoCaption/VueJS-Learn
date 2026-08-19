import {
  createRouter,
  createWebHistory
} from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 模擬使用者目前沒有 Admin 權限
const canAccessAdmin = false

router.beforeEach((to) => {
  // 如果使用者準備進入 Admin，
  // 但沒有權限，就中止導航
  if (
    to.name === 'admin' &&
    !canAccessAdmin
  ) {
    return false
  }
})

export default router