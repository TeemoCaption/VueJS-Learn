<template>
    <h1>第三小節-響應式狀態</h1>

</template>

<script setup>
import { ref } from 'vue'

// 宣告響應式狀態(如果資料屬於同一個使用者物件)
const user = reactive({
    name: 'Alice',
    age: 20,
    email: 'alice@example.com',
    isLoggedIn: true
})

</script>

<style scoped></style>