<script setup>
import {
    ref,
    onMounted,
    onActivated,
    onDeactivated,
    onUnmounted
} from 'vue'

// 手動計數
const count = ref(0)

// 自動計時秒數
const seconds = ref(0)

// 是否正在執行計時器
const isTimerRunning = ref(false)

// 生命週期紀錄
const lifecycleLogs = ref([])

// setInterval 回傳的計時器編號
let timerId = null

function addLog(message) {
    const time = new Date().toLocaleTimeString()

    lifecycleLogs.value.push(`${time}：${message}`)

    console.log(`[CounterView] ${message}`)
}

/**
 * 啟動計時器。
 *
 * 先檢查 timerId，避免重複啟動多個計時器。
 */
function startTimer() {
    if (timerId !== null) {
        return
    }

    timerId = setInterval(() => {
        seconds.value++
    }, 1000)

    isTimerRunning.value = true

    addLog('計時器已啟動')
}

/**
 * 暫停計時器。
 */
function stopTimer() {
    if (timerId === null) {
        return
    }

    clearInterval(timerId)

    timerId = null
    isTimerRunning.value = false

    addLog('計時器已暫停')
}

onMounted(() => {
    addLog('onMounted：CounterView 第一次掛載完成')
})

onActivated(() => {
    addLog('onActivated：CounterView 已進入畫面')

    // 每次元件重新顯示時，恢復計時器
    startTimer()
})

onDeactivated(() => {
    addLog('onDeactivated：CounterView 已進入快取')

    // 元件離開畫面時，暫停計時器
    stopTimer()
})

onUnmounted(() => {
    console.log('[CounterView] onUnmounted：元件已真正卸載')

    // 最後一道保險，真正卸載時再次確認清除計時器
    stopTimer()
})

function increase() {
    count.value++
}

function decrease() {
    count.value--
}

function reset() {
    count.value = 0
    seconds.value = 0
}
</script>

<template>
    <section class="counter-view">
        <header>
            <h2>計數器與計時器頁</h2>

            <p>
                此元件顯示時，計時器會運作；
                進入 KeepAlive 快取後，計時器會暫停。
            </p>
        </header>

        <div class="timer-status">
            <p>
                計時器狀態：
                <strong>
                    {{ isTimerRunning ? '執行中' : '已暫停' }}
                </strong>
            </p>

            <p>
                已累計：
                <strong>{{ seconds }} 秒</strong>
            </p>
        </div>

        <div class="counter-panel">
            <p class="count-number">
                {{ count }}
            </p>

            <div class="button-group">
                <button @click="decrease">
                    -1
                </button>

                <button @click="increase">
                    +1
                </button>

                <button class="reset-button" @click="reset">
                    全部歸零
                </button>
            </div>
        </div>

        <div class="log-panel">
            <h3>生命週期紀錄</h3>

            <ul>
                <li v-for="(log, index) in lifecycleLogs" :key="index">
                    {{ log }}
                </li>
            </ul>
        </div>
    </section>
</template>

<style scoped>
.counter-view {
    padding: 24px;
    border: 2px solid #3b82f6;
    border-radius: 14px;
    background-color: #eff6ff;
}

header h2 {
    margin-top: 0;
    color: #1d4ed8;
}

header p {
    line-height: 1.7;
    color: #555;
}

.timer-status {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 20px;
    padding: 16px;
    border-radius: 10px;
    background-color: #dbeafe;
}

.counter-panel {
    margin-top: 20px;
    padding: 30px;
    text-align: center;
    border-radius: 12px;
    background-color: white;
}

.count-number {
    margin: 0 0 24px;
    font-size: 56px;
    font-weight: bold;
    color: #1d4ed8;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 12px;
}

button {
    min-width: 80px;
    padding: 10px 18px;
    border: none;
    border-radius: 7px;
    background-color: #2563eb;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #1d4ed8;
}

.reset-button {
    background-color: #64748b;
}

.reset-button:hover {
    background-color: #475569;
}

.log-panel {
    margin-top: 20px;
    padding: 18px;
    border-radius: 10px;
    background-color: white;
}

.log-panel ul {
    padding-left: 22px;
}

.log-panel li {
    margin-bottom: 8px;
}

@media (max-width: 600px) {
    .timer-status {
        flex-direction: column;
    }

    .button-group {
        flex-wrap: wrap;
    }
}
</style>