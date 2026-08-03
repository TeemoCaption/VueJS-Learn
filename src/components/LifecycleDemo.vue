<script setup>
import {
    ref,
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    onBeforeUnmount,
    onUnmounted
} from 'vue'

// 響應式計數器
const count = ref(0)

// 取得畫面中的計數文字 DOM
const countElement = ref(null)

// 取得標題 DOM
const titleElement = ref(null)

// 儲存 setInterval 回傳的計時器編號
let timerId = null

// 儲存生命週期紀錄
const lifecycleLogs = ref([])

// 注意：更新次數不能直接顯示在 template 中
// 否則修改它時，又會引發新的畫面更新
let updateTimes = 0

// 統一加入紀錄的函式
function addLog(message) {
    const currentTime = new Date().toLocaleTimeString()

    lifecycleLogs.value.push(`${currentTime}：${message}`)

    console.log(message)
}

// DOM 掛載前執行
onBeforeMount(() => {
    addLog('onBeforeMount：元件即將掛載')

    // 此時 DOM 通常尚未建立完成，因此是 null
    console.log('onBeforeMount 的 titleElement：', titleElement.value)
})

// DOM 掛載完成後執行
onMounted(() => {
    addLog('onMounted：元件已經掛載完成')

    // 此時可以取得真正的 DOM 元素
    console.log('onMounted 的 titleElement：', titleElement.value)
})

// 資料已改變，但 DOM 還沒有更新完成
onBeforeUpdate(() => {
    console.log('onBeforeUpdate：DOM 更新前')

    console.log(
        '此時 count 的新資料：',
        count.value
    )

    console.log(
        '此時畫面 DOM 的舊文字：',
        countElement.value?.textContent
    )
})

// DOM 更新完成後執行
onUpdated(() => {
    updateTimes++

    console.log('onUpdated：DOM 更新完成')

    console.log(
        '更新後的 DOM 文字：',
        countElement.value?.textContent
    )

    console.log(
        '目前完成更新次數：',
        updateTimes
    )
})

// 元件即將被移除
onBeforeUnmount(() => {
    console.log('onBeforeUnmount：元件即將被移除')

    console.log(
        '此時仍可取得標題 DOM：',
        titleElement.value
    )

    console.log(
        '準備清除計時器：',
        timerId
    )
})

// 元件已經被移除
onUnmounted(() => {
    console.log('onUnmounted：元件已經完全移除')

    // 清除計時器，避免元件消失後仍繼續執行
    if (timerId !== null) {
        clearInterval(timerId)
        timerId = null

        console.log('計時器已成功清除')
    }

    console.log(
        '元件移除後的標題 DOM：',
        titleElement.value
    )
})

// 增加計數器
function increaseCount() {
    count.value++
}
</script>

<template>
    <section class="lifecycle-card">
        <h2 ref="titleElement">
            生命週期示範元件
        </h2>

        <p class="description">
            點擊按鈕後，觀察 onBeforeUpdate 與 onUpdated。
        </p>

        <div class="counter-area">
            <!-- 將這個 p 元素綁定到 countElement -->
            <p ref="countElement">
                目前計數：{{ count }}
            </p>

            <button @click="increaseCount">
                增加計數
            </button>
        </div>

        <div class="log-area">
            <h3>掛載生命週期紀錄</h3>

            <ul>
                <li v-for="(log, index) in lifecycleLogs" :key="index">
                    {{ log }}
                </li>
            </ul>

            <p class="notice">
                更新階段的詳細結果請打開瀏覽器 Console 查看。
            </p>
        </div>
    </section>
</template>

<style scoped>
.lifecycle-card {
    max-width: 650px;
    margin: 20px auto;
    padding: 24px;
    border: 2px solid #42b883;
    border-radius: 12px;
    background-color: #f8fffc;
}

.description {
    color: #555;
}

.counter-area {
    padding: 16px;
    margin-top: 20px;
    background-color: white;
    border-radius: 8px;
}

button {
    padding: 10px 18px;
    border: none;
    border-radius: 6px;
    background-color: #42b883;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #369f70;
}

.log-area {
    margin-top: 20px;
    padding: 16px;
    background-color: #eef8f3;
    border-radius: 8px;
}

li {
    margin-bottom: 8px;
}

.notice {
    color: #b45309;
    font-weight: bold;
}
</style>