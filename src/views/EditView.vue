<script setup>
import { ref } from 'vue'

import {
    useRouter,
    isNavigationFailure,
    NavigationFailureType
} from 'vue-router'

const router = useRouter()

// 顯示導航結果
const message = ref('')

// 嘗試回首頁
async function goHome() {
    const failure = await router.push('/')

    // 判斷是不是「被 Navigation Guard 中止」
    if (
        isNavigationFailure(
            failure,
            NavigationFailureType.aborted
        )
    ) {
        message.value = '你還有尚未儲存的修改，無法離開。'
        return
    }

    message.value = '導航成功'
}
</script>

<template>
    <main>
        <h1>文章編輯</h1>

        <p>假設目前文章還沒有儲存。</p>

        <button @click="goHome">
            回首頁
        </button>

        <p v-if="message">
            {{ message }}
        </p>
    </main>
</template>

<style scoped>
main {
    padding: 20px;
}

button {
    margin-top: 12px;
}
</style>