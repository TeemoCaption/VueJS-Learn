<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

// Typed Routes 定義了標準化後的 id 為 string
const userId = route.params.id

console.log(userId)
</script>

<template>
    <main>
        <h1>使用者資料</h1>

        <p>
            User ID：{{ userId }}
        </p>

        <RouterLink to="/">
            回首頁
        </RouterLink>
    </main>
</template>

<style scoped>
main {
    padding: 20px;
}
</style>