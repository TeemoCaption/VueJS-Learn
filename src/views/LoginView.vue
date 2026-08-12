<script setup>
// ref 用來建立響應式資料
import { ref } from 'vue'

// useRouter 用來取得 Router 實例
import { useRouter } from 'vue-router'

// 建立 Router 實例
const router = useRouter()

// 使用者輸入的帳號
const username = ref('')

// 模擬登入
function login() {
    // 假設登入成功
    const userId = 10

    console.log('登入使用者：', username.value)

    // replace 不會新增一筆新的 History，
    // 而是取代目前的歷史紀錄
    router.replace({
        name: 'user-profile',

        params: {
            id: userId
        }
    })
}
</script>

<template>
    <main>
        <h1>登入</h1>

        <!-- 帳號輸入 -->
        <input v-model="username" placeholder="請輸入帳號" />

        <!-- 登入 -->
        <button @click="login">
            登入
        </button>
    </main>
</template>

<style scoped>
main {
    padding: 20px;
}

input,
button {
    margin: 5px;
}
</style>