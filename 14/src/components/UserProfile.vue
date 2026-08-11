<script setup>
// 建立 Promise，模擬從後端取得使用者資料
function fetchUser() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 故意模擬 API 請求失敗
            reject(new Error('無法取得使用者資料'))
        }, 2000)
    })
}

// 使用頂層 await 等待資料
// 因為使用了頂層 await，
// 這個元件會成為 Suspense 的非同步依賴
//
// 如果 fetchUser() 發生錯誤，
// Suspense 本身不會負責處理錯誤
const user = await fetchUser()
</script>

<template>
    <div>
        <h2>使用者資料</h2>

        <p>姓名：{{ user.name }}</p>
        <p>年齡：{{ user.age }}</p>
    </div>
</template>