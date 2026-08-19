<script setup>
import { ref } from 'vue'

import {
    useRouter,
    isNavigationFailure,
    NavigationFailureType
} from 'vue-router'

const router = useRouter()

const message = ref('')

// 再次導航到目前所在的 /profile
async function goToProfileAgain() {
    const failure =
        await router.push('/profile')

    // 判斷是不是 duplicated
    if (
        isNavigationFailure(
            failure,
            NavigationFailureType.duplicated
        )
    ) {
        message.value =
            '你已經在 Profile 頁面，所以不需要再次導航。'

        return
    }

    message.value = '導航成功。'
}
</script>

<template>
    <main>
        <h1>個人資料</h1>

        <p>
            目前位於 Profile 頁面。
        </p>

        <button @click="goToProfileAgain">
            再次前往 Profile
        </button>

        <p v-if="message">
            {{ message }}
        </p>

        <RouterLink to="/">
            回首頁
        </RouterLink>
    </main>
</template>

<style scoped>
main {
    padding: 20px;
}

button {
    display: block;
    margin: 12px 0;
}
</style>