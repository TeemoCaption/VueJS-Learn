<!-- src/views/LoginView.vue -->

<script setup>
// 從 Vue 匯入 inject
// 用來取得 main.js provide() 的全域資料
import { inject } from 'vue'

// 從 Vue Router 匯入 useRouter
// 讓我們可以在 JavaScript 中進行程式式導覽
import { useRouter } from 'vue-router'

// 取得 Router 實例
const router = useRouter()

/*
  取得 main.js 提供的 auth。

  main.js：
  app.provide('auth', auth)

  這裡：
  inject('auth')
*/
const auth = inject('auth')

// 模擬登入功能
function login() {
    /*
      這裡暫時使用 localStorage 模擬登入狀態。
  
      真實專案通常可能會使用：
      Pinia
      JWT
      Cookie
      Session
      後端 API
    */
    localStorage.setItem('isLoggedIn', 'true')

    /*
      同時修改全域響應式登入狀態。
  
      因為 auth 是 reactive 物件，
      所以其他使用 auth 的地方也會取得最新狀態。
    */
    auth.isLoggedIn = true

    // 登入成功後導向會員中心
    router.push('/dashboard')
}
</script>

<template>
    <div>
        <h2>登入頁面</h2>

        <p>
            目前尚未登入。
        </p>

        <!--
      點擊按鈕後執行 login()
    -->
        <button @click="login">
            登入
        </button>
    </div>
</template>

<style scoped>
button {
    padding: 8px 16px;
    cursor: pointer;
}
</style>