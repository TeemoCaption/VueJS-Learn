<script setup>
// 這個元件只有進入 /about 時才會被載入
</script>

<template>
    <main>
        <h1>About 頁面</h1>

        <p>
            我是透過路由懶加載載入的元件。
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