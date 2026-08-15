<script setup lang="ts">
// AdminView 不需要自己再次判斷權限。
// 是否允許進入頁面，已經交給 Router Navigation Guard 處理。
</script>

<template>
    <main>
        <h1>管理員後台</h1>

        <p>
            只有已登入並具有管理員權限的使用者才能進入。
        </p>

        <RouterLink to="/">
            回首頁
        </RouterLink>
    </main>
</template>