<!-- src/views/UserPage.vue -->

<script setup>
// 建立 Promise，模擬從 API 取得使用者資料
function fetchUser() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: 'Mitsuri',
                age: 20
            })
        }, 2000)
    })
}

// 使用頂層 await
//
// 因此 UserPage 會成為
// Suspense 的非同步依賴
const user = await fetchUser()
</script>

<template>
    <div>
        <h2>使用者頁面</h2>

        <p>姓名：{{ user.name }}</p>
        <p>年齡：{{ user.age }}</p>
    </div>
</template>