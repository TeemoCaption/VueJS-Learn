<script setup>
import CustomLink from './components/CustomLink.vue'
</script>

<template>
  <header>
    <nav>
      <!-- 使用我們自己封裝的 CustomLink -->
      <CustomLink to="/">
        首頁
      </CustomLink>

      <CustomLink to="/about">
        關於我們
      </CustomLink>
    </nav>
  </header>

  <!-- 顯示目前路由元件 -->
  <RouterView />
</template>

<style scoped>
nav {
  display: flex;
  gap: 16px;
  padding: 20px;
}
</style>