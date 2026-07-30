<script setup>
import { ref, onMounted } from 'vue'

// 控制答案是否展開
const isOpen = ref(false)

onMounted(() => {
    console.log('FaqPanel 已完成 Hydration')
})

// 切換答案
function toggleAnswer() {
    isOpen.value = !isOpen.value
}
</script>

<template>
    <section class="faq">
        <h2>常見問題</h2>

        <button @click="toggleAnswer">
            Vue 的 Hydration 是什麼？
        </button>

        <p v-if="isOpen" class="answer">
            Hydration 是 Vue 在瀏覽器端接管
            伺服器產生 HTML 的過程。
        </p>
    </section>
</template>

<style scoped>
.faq {
    max-width: 560px;
    padding: 24px;
    border: 2px solid #e6a23c;
    border-radius: 12px;
    background-color: #fffaf0;
}

button {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 8px;
    background-color: #e6a23c;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

.answer {
    margin-bottom: 0;
    padding: 14px;
    background-color: white;
    border-radius: 8px;
}
</style>