<script setup>
// 從 Vue 引入響應式參考和生命週期鉤子
import {
    ref,
    onMounted,
    onUnmounted
} from 'vue'

// 使用者資料
const users = ref([])

// 是否正在載入
const isLoading = ref(false)

// 錯誤訊息
const errorMessage = ref('')

// AbortController 可在元件移除時取消尚未完成的請求
const controller = new AbortController()

// 取得使用者資料的非同步函數
async function fetchUsers() {
    isLoading.value = true
    errorMessage.value = ''

    try {
        // 發送 API 請求，並帶入 signal 以支援取消請求
        const response = await fetch(
            'https://jsonplaceholder.typicode.com/users',
            {
                signal: controller.signal
            }
        )

        // 檢查回應狀態是否成功
        if (!response.ok) {
            throw new Error(`HTTP 錯誤：${response.status}`)
        }

        // 將回應的 JSON 資料解析並存入 users
        users.value = await response.json()
    } catch (error) {
        // 如果是主動取消請求，不顯示成一般錯誤
        if (error.name === 'AbortError') {
            console.log('API 請求已取消')
            return
        }

        // 顯示錯誤訊息
        errorMessage.value = error.message
    } finally {
        // 無論成功或失敗，都將載入狀態設為 false
        // 當請求被取消時，fetch 會拋出一個 AbortError 例外
        isLoading.value = false
    }
}

// 元件掛載後取得資料
onMounted(() => {
    console.log('UserList 已掛載，開始取得使用者資料')

    fetchUsers()
})

// 元件被移除時取消尚未完成的 API 請求
onUnmounted(() => {
    console.log('UserList 已移除，取消尚未完成的 API 請求')

    // AbortController 是瀏覽器提供的 API，用來取消 fetch 請求
    controller.abort()
})
</script>

<template>
    <section class="user-list">
        <h2>使用者列表</h2>

        <p v-if="isLoading">
            資料載入中……
        </p>

        <p v-else-if="errorMessage" class="error">
            載入失敗：{{ errorMessage }}
        </p>

        <ul v-else>
            <li v-for="user in users" :key="user.id">
                <strong>{{ user.name }}</strong>
                <span>{{ user.email }}</span>
            </li>
        </ul>
    </section>
</template>

<style scoped>
.user-list {
    max-width: 650px;
    margin: 20px auto;
    padding: 24px;
    background-color: white;
    border-radius: 12px;
}

ul {
    padding: 0;
    list-style: none;
}

li {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 12px;
    margin-bottom: 8px;
    background-color: #f3f4f6;
    border-radius: 8px;
}

.error {
    color: #dc2626;
}
</style>