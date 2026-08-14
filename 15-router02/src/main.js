// src/main.js

// 從 Vue 匯入 createApp，用來建立 Vue 應用程式
import {
  createApp,
  reactive
} from 'vue'

// 匯入根元件 App.vue
import App from './App.vue'

// 匯入我們建立的 Vue Router
import router from './router'

// 建立 Vue 應用程式
const app = createApp(App)

/*
  建立一份全域共用的登入狀態。

  reactive() 會讓這個物件具有響應式能力。
*/
const auth = reactive({
  // 預設讀取 localStorage 的登入狀態
  isLoggedIn:
    localStorage.getItem('isLoggedIn') === 'true',

  /*
    新增使用者角色。

    member
    → 一般會員

    guest
    → 訪客

    之後我們會使用 beforeEnter
    判斷使用者是否可以進入 Dashboard。
  */
  role: 'member'
})

/*
  使用 provide() 將 auth 提供給整個 Vue 應用程式。

  第一個參數：
  'auth'
  → 注入時使用的 key

  第二個參數：
  auth
  → 真正提供的資料
*/
app.provide('auth', auth)

// 將 Vue Router 安裝到 Vue 應用程式中
app.use(router)

// 將整個 Vue 應用程式掛載到 index.html 的 #app
app.mount('#app')