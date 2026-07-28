<script setup>
defineProps({
    tags: {
        type: Array,
        // 陣列預設值
        default: () => []
    }
})

</script>

<template>
    <section>
        <h2>標籤列表</h2>

        <ul v-if="tags.length > 0">
            <li v-for="tag in tags" :key="tag">
                {{ tag }}
            </li>
        </ul>

        <p v-else>
            目前沒有標籤
        </p>
    </section>
</template>

<style scoped></style>