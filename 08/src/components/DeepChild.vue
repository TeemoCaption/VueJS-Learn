<script setup>
// 匯入 inject
import { inject } from 'vue'

// 匯入與提供者相同的 Symbol
import { userContextKey } from '../keys/injectionKeys.js'

// 取得祖先提供的整個 userContext 物件
// inject() 是 Vue 3 的 API，用於從父組件注入資料
// 使用與 provide() 相同的 key 取得資料
const userContext = inject(userContextKey)

// 防止找不到 provider 時直接發生難以理解的錯誤
if (!userContext) {
    throw new Error('找不到 userContext，請確認祖先元件是否呼叫 provide()')
}

// 從物件中取出資料與函式
const {
    username,
    isLoggedIn,
    changeUsername,
    toggleLogin
} = userContext


</script>

<template>
    <section class="deep-child">
        <h4>DeepChild：注入資料的元件</h4>

        <p>使用者：{{ username }}</p>
        <p>登入狀態：{{ isLoggedIn ? '已登入' : '未登入' }}</p>

        <!--
      子元件呼叫祖先提供的函式，
      不直接修改祖先狀態。
    -->
        <button @click="changeUsername">
            在深層子元件切換名稱
        </button>

        <button @click="toggleLogin">
            在深層子元件切換登入狀態
        </button>
    </section>
</template>

<style scoped>
.deep-child {
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #e6a23c;
    border-radius: 10px;
}

button {
    margin-right: 10px;
    padding: 8px 14px;
    cursor: pointer;
}
</style>