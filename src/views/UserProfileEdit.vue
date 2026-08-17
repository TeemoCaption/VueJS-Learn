<script setup>
// 使用者資料編輯頁面
</script>

<template>
    <main>
        <h1>編輯個人資料</h1>

        <p>這裡可以修改使用者資料。</p>

        <!-- 回到使用者資料頁 -->
        <RouterLink to="/users/1">
            回到個人資料
        </RouterLink>
    </main>
</template>

<style scoped>
main {
    padding: 20px;
}
</style>