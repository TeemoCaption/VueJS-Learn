<script setup>
import { ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

// 表單內容
const username = ref('')

// 記錄資料是否被修改
const hasUnsavedChanges = ref(false)

// 當使用者修改輸入框時
function handleInput() {
    hasUnsavedChanges.value = true
}

// 準備離開目前路由之前執行
onBeforeRouteLeave((to, from) => {
    // 如果沒有未儲存資料，就直接允許離開
    if (!hasUnsavedChanges.value) {
        return
    }

    const answer = window.confirm(
        '資料尚未儲存，確定要離開嗎？'
    )

    // return false 代表取消這次導航
    if (!answer) {
        return false
    }
})
</script>

<template>
    <div>
        <h1>編輯個人資料</h1>

        <input v-model="username" @input="handleInput" placeholder="輸入使用者名稱">
    </div>
</template>