<script setup>
// 個人資料頁本身不用判斷登入狀態。
// 是否能進入這個頁面的判斷，之後交給 Router 處理。
</script>

<template>
    <main>
        <h1>個人資料</h1>

        <p>
            這是一個需要登入才能查看的頁面。
        </p>

        <RouterLink to="/">
            回首頁
        </RouterLink>
    </main>
</template>