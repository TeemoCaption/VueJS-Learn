<script setup>
// 接收 Router 透過 Object Mode
// 傳進來的固定 Props
const props = defineProps({
    title: {
        type: String,
        required: true
    },

    version: {
        type: String,
        required: true
    }
})
</script>

<template>
    <main>
        <!-- 顯示 Router 傳入的 title -->
        <h1>
            {{ props.title }}
        </h1>

        <p>
            這是 About 頁面。
        </p>

        <!-- 顯示固定版本資訊 -->
        <p>
            網站版本：{{ props.version }}
        </p>
    </main>
</template>

<style scoped>
main {
    padding: 20px;
}
</style>