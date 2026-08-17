<script setup>
import AppLink from './components/AppLink.vue'
</script>

<template>
  <header>
    <nav>
      <!--
        內部路由：
        AppLink 會使用 RouterLink
      -->
      <AppLink to="/" active-class="active" inactive-class="inactive">
        首頁
      </AppLink>

      <AppLink to="/about" active-class="active" inactive-class="inactive">
        關於我們
      </AppLink>

      <!--
        外部網址：
        AppLink 會自動使用 <a>
      -->
      <AppLink to="https://vuejs.org" class="external-link">
        Vue 官方網站
      </AppLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  display: flex;
  gap: 16px;
  padding: 20px;
}

.active {
  font-weight: bold;
  text-decoration: underline;
}

.inactive {
  opacity: 0.6;
}

.external-link {
  text-decoration: none;
}
</style>