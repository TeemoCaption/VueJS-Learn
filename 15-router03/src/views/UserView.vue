<script setup>
import { ref } from 'vue'
import {
    useRoute,
    onBeforeRouteUpdate
} from 'vue-router'

// 取得目前路由
const route = useRoute()

// 儲存使用者資料
const userData = ref(null)

// 模擬向後端取得使用者資料
async function fetchUser(id) {
    return {
        id,
        name: `使用者 ${id}`
    }
}

// 第一次進入頁面時取得資料
userData.value = await fetchUser(route.params.id)

// 當目前元件被重複使用，而且路由改變時執行
onBeforeRouteUpdate(async (to, from) => {
    // 只有使用者 ID 改變才重新取得資料
    if (to.params.id !== from.params.id) {
        userData.value = await fetchUser(to.params.id)
    }
})
</script>

<template>
    <div v-if="userData">
        <h1>使用者資料</h1>

        <p>ID：{{ userData.id }}</p>
        <p>名稱：{{ userData.name }}</p>
    </div>
</template>