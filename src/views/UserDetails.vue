<script setup>
// 使用者詳細資料頁面
</script>

<template>
    <main>
        <h1>使用者資料</h1>

        <p>這裡顯示使用者的基本資料。</p>

        <!-- 前往同一個使用者的 Dashboard -->
        <RouterLink to="/users/1/dashboard">
            前往 Dashboard
        </RouterLink>
    </main>
</template>

<style scoped>
main {
    padding: 20px;
}
</style>