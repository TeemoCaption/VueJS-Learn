<script setup>
// RouterLink：建立路由連結
// RouterView：顯示目前頁面
import {
  RouterLink,
  RouterView
} from 'vue-router'
</script>

<template>
  <div class="app">
    <!-- 網站主要導航 -->
    <nav class="main-nav">
      <RouterLink :to="{
        name: 'home'
      }">
        首頁
      </RouterLink>

      <RouterLink :to="{
        name: 'about'
      }">
        關於我們
      </RouterLink>

      <RouterLink :to="{
        name: 'login'
      }">
        登入
      </RouterLink>

      <RouterLink :to="{
        name: 'search',
        query: {
          q: 'vue'
        }
      }">
        搜尋 Vue
      </RouterLink>
    </nav>

    <hr />

    <!-- 顯示目前 Route -->
    <RouterView />
  </div>
</template>

<style scoped>
.app {
  padding: 20px;
}

.main-nav {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

/*
  這兩個 class 名稱
  已經在 createRouter() 全域設定。
*/
.nav-active {
  font-weight: bold;
}

.nav-exact-active {
  text-decoration: underline;
}
</style>