<script setup>
// useRouter 用來取得 Router 實例
import { useRouter } from 'vue-router'

// 建立 Router 實例
const router = useRouter()

// 返回上一頁
function goBack() {
    // -1 代表往 History 的上一筆紀錄
    router.go(-1)
}
</script>

<template>
    <section>
        <!-- 會員個人資料頁 -->
        <h2>個人資料</h2>

        <p>
            這裡顯示會員的個人資料。
        </p>

        <!-- 返回瀏覽器上一頁 -->
        <button @click="goBack">
            返回上一頁
        </button>
    </section>
</template>

<style scoped>
section {
    padding: 20px;
}

button {
    margin-top: 10px;
}
</style>