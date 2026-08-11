<!-- src/components/AdminProfile.vue -->

<script setup>
// 建立 Promise，模擬從後端取得管理員資料
function fetchAdmin() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: 'Mitsuri',
                role: 'Admin'
            })
        }, 2000)
    })
}

// 使用頂層 await。
// 因此此元件會成為 Suspense 的非同步依賴。
const admin = await fetchAdmin()
</script>

<template>
    <div>
        <h3>管理員</h3>

        <p>姓名：{{ admin.name }}</p>
        <p>角色：{{ admin.role }}</p>
    </div>
</template>