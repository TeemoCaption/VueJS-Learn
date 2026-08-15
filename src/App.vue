<script setup>
import CustomLink from './components/CustomLink.vue'
</script>

<template>
  <div>
    <h1>useLink 範例</h1>

    <nav>
      <!-- 自己製作的 RouterLink -->
      <CustomLink to="/">
        首頁
      </CustomLink>

      <CustomLink to="/about">
        關於我們
      </CustomLink>
    </nav>

    <hr>

    <!-- 顯示目前路由對應的元件 -->
    <RouterView />
  </div>
</template>