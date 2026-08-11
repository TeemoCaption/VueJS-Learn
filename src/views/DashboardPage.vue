<!-- src/views/DashboardPage.vue -->

<script setup>
// 模擬取得 Dashboard 資料
function fetchDashboard() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                users: 120,
                orders: 35
            })
        }, 2000)
    })
}

// 使用頂層 await
//
// 因此 DashboardPage
// 也會被 Suspense 等待
const dashboard = await fetchDashboard()
</script>

<template>
    <div>
        <h2>Dashboard</h2>

        <p>使用者數量：{{ dashboard.users }}</p>
        <p>訂單數量：{{ dashboard.orders }}</p>
    </div>
</template>