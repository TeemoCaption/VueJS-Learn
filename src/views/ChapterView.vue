<script setup>
// useRoute 可以取得目前路由資訊
import { useRoute } from 'vue-router'

// 取得目前 Route
const route = useRoute()

// 當使用 + 或 * 這類可重複參數時，
// params 取得的資料會是陣列。
</script>

<template>
    <main>
        <!-- 章節頁面 -->
        <h1>Vue 學習章節</h1>

        <!--
      例如：
      /chapters/vue/router/basic

      chapters 會得到：
      ['vue', 'router', 'basic']
    -->
        <p>
            {{ route.params.chapters }}
        </p>
    </main>
</template>

<style scoped>
main {
    padding: 20px;
}
</style>