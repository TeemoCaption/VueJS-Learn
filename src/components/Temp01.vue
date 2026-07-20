<template>
    <h1>第一小節-Computed 與 Watch</h1>
    <h2>{{ fullName }}</h2>
    <br>
    <!-- v-model 可以讓 HTML 元素和 Vue 的資料保持同步 -->
    <input v-model="name">
    <br>
    <input v-model="keyword">
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const firstName = ref('ChenYen')
const lastName = ref('Yang')
const name = ref('')
const keyword = ref('')

// computed 用於自動計算屬性，只要依賴資料改變 computed 就重新計算。
const fullName = computed(() => {
    return lastName.value + firstName.value
})

// watch 用於監聽資料變化，當資料改變時執行指定的函數。
watch(name, (newValue, oldValue) => {
    console.log("舊值：", oldValue)
    console.log("新值：", newValue)
})
// 監聽 keyword，當 keyword 改變時執行指定的函數。
watch(keyword, () => {
    fetchProducts()
})

function fetchProducts() {
    console.log("fetchProducts")
}
</script>

<style scoped></style>
