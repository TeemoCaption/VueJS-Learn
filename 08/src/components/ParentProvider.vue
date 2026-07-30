<script setup>
import { ref, provide, readonly } from 'vue'
import MiddleLayer from './MiddleLayer.vue'

// 匯入共用的注入鍵
import { userContextKey } from '../keys/injectionKeys.js'

// 建立響應式狀態
const username = ref('小明')
const isLoggedIn = ref(true)

// 修改使用者名稱
function changeUsername() {
    username.value = username.value === '小明' ? '小美' : '小明'
}

// 切換登入狀態
function toggleLogin() {
    isLoggedIn.value = !isLoggedIn.value
}

// 將狀態與修改函式包成同一個物件
// 使用 readonly 保護狀態，避免子元件直接修改
provide(userContextKey, {
    username: readonly(username),
    isLoggedIn: readonly(isLoggedIn),
    changeUsername,
    toggleLogin
})
</script>

<template>
    <section class="provider">
        <h2>ParentProvider：提供者</h2>

        <p>目前使用者：{{ username }}</p>
        <p>登入狀態：{{ isLoggedIn ? '已登入' : '未登入' }}</p>

        <MiddleLayer />
    </section>
</template>

<style scoped>
.provider {
    padding: 20px;
    border: 2px solid #42b883;
    border-radius: 10px;
}
</style>