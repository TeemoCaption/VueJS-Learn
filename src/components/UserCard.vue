<script setup>
defineProps({
    user: {
        type: Object,
        // 物件預設值
        default: () => ({
            name: '匿名使用者',
            age: 0
        })
    }
})
</script>

<template>
    <article class="user-card">
        <h2>{{ user.name }}</h2>
        <p>年齡：{{ user.age }}</p>
    </article>
</template>

<style scoped>
.user-card {
    padding: 16px;
    border: 1px solid #cccccc;
    border-radius: 8px;
}
</style>