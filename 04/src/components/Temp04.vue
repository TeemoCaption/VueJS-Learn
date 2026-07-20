<template>
    <h1>第四小節-取得 Computed 的上一個值</h1>
    <div>
        <h2>取得 Computed 的上一個值</h2>
        <p>目前 count：{{ count }}</p>
        <p>alwaysSmall：{{ alwaysSmall }}</p>

        <button @click="count++">
            count + 1
        </button>

        <button @click="count--">
            count - 1
        </button>
    </div>
    <br>
    <div>
        <h2>搜尋結果限制</h2>

        <p>實際結果數量：{{ resultCount }}</p>
        <p>安全顯示數量：{{ safeResultCount }}</p>

        <button @click="resultCount++">
            增加結果
        </button>

        <button @click="resultCount--">
            減少結果
        </button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const count = ref(2)

// previous 參數是上一次的回傳值
// 雖然這個功能很方便，但它不應拿來取代正常的狀態管理。
// 例如，若你需要明確記錄：歷史紀錄、復原與重做、多次變化、使用者操作紀錄
// 應該使用：ref([])，或 Pinia 等狀態管理方式。
const alwaysSmall = computed((previous) => {
    console.log('目前 count：', count.value)
    console.log('上一個 computed 結果：', previous)

    if (count.value <= 3) {
        return count.value
    }

    return previous
})

const resultCount = ref(3)

const safeResultCount = computed((previous) => {
    if (resultCount.value <= 5) {
        return resultCount.value
    }
    // previous 為 undefined 時，回傳 0
    // 兩個問號是空值合併運算子，如果左邊為 null 或 undefined，就回傳右邊的值
    return previous ?? 0
})
</script>

<style scoped></style>