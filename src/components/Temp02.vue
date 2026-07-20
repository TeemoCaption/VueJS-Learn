<template>
    <h1>第二小節-Computed 快取（Caching）與 Methods 的差異</h1>
    <br>
    <p>Computed：{{ total }}</p>
    <p>Computed 再讀一次：{{ total }}</p>

    <p>Method：{{ getTotal() }}</p>
    <p>Method 再呼叫一次：{{ getTotal() }}</p>

    <button @click="unrelatedCount++">
        修改無關資料：{{ unrelatedCount }}
    </button>

    <button @click="quantity++">
        增加商品數量：{{ quantity }}
    </button>
</template>

<script setup>
import { ref, computed } from 'vue'

const price = ref(100)
const quantity = ref(5)
const unrelatedCount = ref(0)

// method 方法每次都會重新計算
function getTotal() {
    console.log('Method 重新計算')
    return price.value * quantity.value
}

// computed 只有在依賴資料變更時才會重新計算
const total = computed(() => {
    console.log('Computed 重新計算')
    return price.value * quantity.value
})
</script>

<style scoped></style>