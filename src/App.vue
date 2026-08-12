<!-- src/App.vue -->

<script setup>
// App.vue 目前不需要額外的 JavaScript 邏輯
</script>

<template>
  <div>
    <!-- 網站標題 -->
    <h1>Vue Router 導覽守衛練習</h1>

    <!--
      RouterLink 用來切換頁面。
      Vue Router 會攔截點擊行為，不需要整個網頁重新整理。
    -->
    <nav>
      <RouterLink to="/">
        首頁
      </RouterLink>

      |

      <RouterLink to="/login">
        登入
      </RouterLink>

      |

      <RouterLink to="/dashboard">
        會員中心
      </RouterLink>
    </nav>

    <hr />

    <!--
      RouterView 是目前路由元件顯示的位置。

      例如：
      /          → HomeView.vue
      /login     → LoginView.vue
      /dashboard → DashboardView.vue
    -->
    <RouterView />
  </div>
</template>

<style scoped>
nav {
  margin-bottom: 20px;
}

nav a {
  margin: 0 8px;
}
</style>