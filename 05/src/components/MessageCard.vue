<script setup>
import { ref } from 'vue'

const isVisible = ref(false)

function toggleMessage() {
    isVisible.value = !isVisible.value
}
</script>

<template>
    <section class="message-card">
        <button @click="toggleMessage">
            {{ isVisible ? '隱藏訊息' : '顯示訊息' }}
        </button>

        <p v-if="isVisible">
            這是目前卡片自己的訊息。
        </p>
    </section>
</template>

<style scoped>
.message-card {
    padding: 16px;
    margin-bottom: 12px;
    border: 1px solid #cccccc;
    border-radius: 8px;
}

button {
    padding: 8px 14px;
    cursor: pointer;
}
</style>