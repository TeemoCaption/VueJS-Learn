<script setup>
// 使用者 Dashboard 頁面
</script>

<template>
    <main>
        <h1>使用者 Dashboard</h1>

        <p>這裡顯示使用者的 Dashboard。</p>

        <!-- 前往編輯頁面 -->
        <RouterLink to="/users/1/edit">
            編輯個人資料
        </RouterLink>
    </main>
</template>

<style scoped>
main {
    padding: 20px;
}
</style>