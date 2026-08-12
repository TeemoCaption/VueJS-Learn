// 匯入 Vue Router 提供的功能
import {
  createRouter,
  createWebHistory
} from 'vue-router'

// 匯入主要頁面
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import SearchView from '../views/SearchView.vue'
import UserView from '../views/UserView.vue'

// 匯入會員子頁面
import UserProfileView from '../views/UserProfileView.vue'
import UserPostsView from '../views/UserPostsView.vue'

const routes = [
  {
    // 首頁
    path: '/',
    name: 'home',
    alias: '/home',
    component: HomeView
  },

  {
    // About 頁面
    path: '/about',
    name: 'about',

    component: AboutView,

    props: {
      title: '關於我們',
      version: '1.0'
    }
  },

  {
    // 登入頁面
    path: '/login',
    name: 'login',
    component: LoginView
  },

  {
    // 搜尋頁面
    path: '/search',
    name: 'search',

    component: SearchView,

    props: (route) => ({
      query: route.query.q
    })
  },

  {
    // 會員父路由
    path: '/users/:id',

    component: UserView,

    // 將 route.params 傳給 UserView
    props: true,

    children: [
      {
        // /users/:id
        path: '',
        name: 'user',
        component: UserProfileView
      },

      {
        // /users/:id/profile
        path: 'profile',
        name: 'user-profile',
        component: UserProfileView
      },

      {
        // /users/:id/posts
        path: 'posts',
        name: 'user-posts',
        component: UserPostsView
      }
    ]
  }
]

// 建立 Router
const router = createRouter({
  // 使用 Vite 提供的 BASE_URL
  //
  // 開發環境通常為：
  // /
  //
  // 如果未來部署到子目錄，
  // 可以配合 Vite base 設定
  history: createWebHistory(import.meta.env.BASE_URL),

  // 註冊所有路由
  routes,

  // 全域 Active Class
  linkActiveClass: 'nav-active',

  // 全域 Exact Active Class
  linkExactActiveClass: 'nav-exact-active'
})

// 匯出 Router
export default router