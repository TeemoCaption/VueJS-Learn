<script setup>
// 建立的每個元件不會共用同一個 count
import { ref } from 'vue'
import { sharedCount } from '../scripts/sharedCounter.js'

const count = ref(0)

function increase() {
    count.value++
    sharedCount.value++
}
</script>

<template>
    <button @click="increase">
        點擊次數：{{ count }}
        <br>
        {{ sharedCount }}
    </button>
</template>

<style scoped>
button {
    padding: 10px 18px;
    margin: 8px;
    cursor: pointer;
}
</style>