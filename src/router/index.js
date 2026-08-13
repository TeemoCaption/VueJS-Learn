// src/router/index.js

// 從 Vue 匯入 inject
// 讓導航守衛可以取得 app.provide() 提供的資料
import { inject } from 'vue'

// 從 Vue Router 匯入建立 Router 所需要的方法
import {
  createRouter,
  createWebHistory
} from 'vue-router'

// 匯入三個頁面元件
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

// 建立 Router
const router = createRouter({
  // 使用 HTML5 History 模式
  history: createWebHistory(),

  // 定義所有路由
  routes: [
    {
      // 首頁
      path: '/',

      // 路由名稱
      name: 'home',

      // 對應 HomeView.vue
      component: HomeView
    },

    {
      // 登入頁面
      path: '/login',

      // 路由名稱
      name: 'login',

      // 對應 LoginView.vue
      component: LoginView
    },

    {
      // 會員中心
      path: '/dashboard',

      // 路由名稱
      name: 'dashboard',

      // 對應 DashboardView.vue
      component: DashboardView,

      /*
        路由獨享守衛 beforeEnter

        只有在「進入這條 Route」時，
        才會執行這個守衛。
      */
      beforeEnter: (to, from) => {
        /*
          取得 main.js：

          app.provide('auth', auth)

          所提供的 auth。
        */
        const auth = inject('auth')

        console.log('Dashboard beforeEnter 執行')

        console.log('從：', from.path)
        console.log('準備前往：', to.path)

        /*
          檢查使用者角色。

          如果使用者是 guest，
          就不允許進入 Dashboard。
        */
        if (auth.role === 'guest') {
          /*
            將使用者重新導向首頁。
          */
          return {
            name: 'home'
          }
        }

        /*
          如果不是 guest，
          沒有 return 其他 Route，
          代表允許導航繼續。
        */
      }
    }
  ]
})

/*
  全域前置守衛

  每一次路由切換以前，
  Vue Router 都會先執行這個函式。
*/
router.beforeEach((to, from) => {
  /*
    to
    = 使用者「準備前往」的路由

    from
    = 使用者「目前所在」的路由
  */

  /*
    從 Vue 的全域注入取得 auth。

    對應 main.js：

    app.provide('auth', auth)

    Vue 3.3 之後，
    可以直接在導覽守衛內使用 inject()。
  */
  const auth = inject('auth')

  /*
    如果：

    1. 使用者準備前往 dashboard
    2. auth.isLoggedIn 為 false

    就不讓使用者進入會員中心。
  */
  if (
    to.name === 'dashboard' &&
    !auth.isLoggedIn
  ) {
    /*
      回傳一個 Route Location，
      Vue Router 就會重新導向 Login。
    */
    return {
      name: 'login'
    }
  }

  /*
    如果沒有 return false，
    也沒有 return 另一個路由，

    代表允許這次導覽繼續執行。
  */
})

/*
  全域解析守衛

  beforeResolve() 會在導航即將正式確認之前執行。

  可以把它理解成：
  「前面的檢查都處理完之後，再進行最後一次確認。」
*/
router.beforeResolve(async (to, from) => {
  /*
    這裡同樣可以取得：

    to   → 準備前往的路由
    from → 目前所在的路由
  */

  console.log('beforeResolve 執行')

  console.log('準備前往：', to.path)

  console.log('目前來自：', from.path)

  /*
    如果準備進入會員中心，
    就模擬執行一個需要等待的操作。

    真實專案可能是：
    - 取得使用者資料
    - 檢查權限
    - 確認某些必要資料
  */
  if (to.name === 'dashboard') {
    console.log('正在準備會員資料...')

    // 模擬等待 1 秒鐘
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })

    console.log('會員資料準備完成')
  }

  /*
    沒有回傳 false 或其他路由位置，
    代表允許這次導航繼續。
  */
})

/*
  全域後置鉤子

  afterEach() 和前面的 beforeEach()、
  beforeResolve() 最大的不同：

  它是在導航完成之後才執行。
*/
router.afterEach((to, from) => {
  /*
    即使導航已經完成，
    我們仍然可以取得：

    to   → 最後前往的路由
    from → 原本所在的路由
  */

  console.log('afterEach 執行')

  // 顯示原本所在的頁面
  console.log('從：', from.path)

  // 顯示最後前往的頁面
  console.log('前往：', to.path)

  /*
    例如：

    /login → /dashboard

    Console 會看到：

    從： /login
    前往： /dashboard
  */
})

// 將 router 匯出
export default router