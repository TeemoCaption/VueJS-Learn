<script setup>
import { ref, onMounted } from 'vue'

// 記錄按鈕被點擊的次數
const count = ref(0)

// 記錄元件是否已在瀏覽器端完成掛載
const isMounted = ref(false)

// onMounted 不會在伺服器端 SSR 階段執行，
// 只會在瀏覽器端元件完成啟用後執行。
onMounted(() => {
    isMounted.value = true

    console.log('InteractiveCard 已完成 Hydration')
})

// 增加計數
function increaseCount() {
    count.value++
}
</script>

<template>
    <section class="card">
        <h2>互動式使用者卡片</h2>

        <p>
            Hydration 狀態：
            <strong>
                {{ isMounted ? '已完成，可以互動' : '尚未完成' }}
            </strong>
        </p>

        <p>目前點擊次數：{{ count }}</p>

        <button @click="increaseCount">
            增加次數
        </button>
    </section>
</template>

<style scoped>
.card {
    max-width: 520px;
    margin: 30px 0;
    padding: 24px;
    border: 2px solid #42b883;
    border-radius: 14px;
    background-color: #f4fff9;
}

.card h2 {
    margin-top: 0;
    color: #2c3e50;
}

.card button {
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    background-color: #42b883;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

.card button:hover {
    background-color: #369b70;
}
</style>