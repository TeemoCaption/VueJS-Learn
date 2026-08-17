<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 前往使用者頁面
function goToUser() {
  router.push({
    name: 'user',

    // user 路由要求 id
    // Typed Routes 可以協助檢查參數型別
    params: {
      id: 100
    }
  })
}
</script>

<template>
  <main>
    <h1>首頁</h1>

    <button @click="goToUser">
      查看使用者 100
    </button>

    <!-- RouterLink 同樣可以取得路由型別資訊 -->
    <RouterLink :to="{
      name: 'user',
      params: {
        id: 200
      }
    }">
      查看使用者 200
    </RouterLink>
  </main>
</template>

<style scoped>
main {
  padding: 20px;
}

button {
  margin-right: 16px;
}
</style>