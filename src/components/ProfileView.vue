<script setup>
import {
    ref,
    onMounted,
    onActivated,
    onDeactivated,
    onUnmounted
} from 'vue'

// 使用者輸入的姓名
const name = ref('')

// 使用者輸入的自我介紹
const introduction = ref('')

// 記錄元件被啟用幾次
const activatedCount = ref(0)

// 記錄生命週期訊息
const lifecycleLogs = ref([])

/**
 * 將生命週期訊息加入畫面與 Console。
 */
function addLog(message) {
    const time = new Date().toLocaleTimeString()

    lifecycleLogs.value.push(`${time}：${message}`)

    console.log(`[ProfileView] ${message}`)
}

/**
 * 元件第一次掛載完成後執行。
 *
 * 注意：
 * onMounted 通常只會在元件第一次建立時執行一次。
 */
onMounted(() => {
    addLog('onMounted：ProfileView 第一次掛載完成')
})

/**
 * 元件首次掛載，以及每次從 KeepAlive 快取中
 * 重新插回 DOM 時執行。
 */
onActivated(() => {
    activatedCount.value++

    addLog(
        `onActivated：ProfileView 已啟用，第 ${activatedCount.value} 次`
    )
})

/**
 * 元件離開 DOM、進入 KeepAlive 快取時執行。
 *
 * 此時元件並沒有真正被卸載，
 * 所以 name 與 introduction 的資料仍然保留。
 */
onDeactivated(() => {
    addLog('onDeactivated：ProfileView 已進入快取')
})

/**
 * 元件真正卸載時執行。
 *
 * 只是在 KeepAlive 元件之間切換時，
 * 通常不會立即觸發 onUnmounted。
 */
onUnmounted(() => {
    console.log('[ProfileView] onUnmounted：元件已真正卸載')
})

/**
 * 清空表單內容。
 */
function clearForm() {
    name.value = ''
    introduction.value = ''
}
</script>

<template>
    <section class="profile-view">
        <header class="page-header">
            <h2>個人資料頁</h2>

            <p>
                請輸入一些內容，再切換到計數器頁，
                然後切回來觀察資料是否保留。
            </p>
        </header>

        <div class="status-panel">
            <p>
                元件啟用次數：
                <strong>{{ activatedCount }}</strong>
            </p>
        </div>

        <form class="profile-form" @submit.prevent>
            <label>
                姓名

                <input v-model="name" type="text" placeholder="請輸入姓名" />
            </label>

            <label>
                自我介紹

                <textarea v-model="introduction" rows="5" placeholder="請輸入自我介紹" />
            </label>

            <button type="button" class="clear-button" @click="clearForm">
                清空內容
            </button>
        </form>

        <div class="preview-panel">
            <h3>即時預覽</h3>

            <p>
                <strong>姓名：</strong>
                {{ name || '尚未輸入' }}
            </p>

            <p>
                <strong>自我介紹：</strong>
                {{ introduction || '尚未輸入' }}
            </p>
        </div>

        <div class="log-panel">
            <h3>ProfileView 生命週期紀錄</h3>

            <ul>
                <li v-for="(log, index) in lifecycleLogs" :key="index">
                    {{ log }}
                </li>
            </ul>
        </div>
    </section>
</template>

<style scoped>
.profile-view {
    padding: 24px;
    border: 2px solid #ec4899;
    border-radius: 14px;
    background-color: #fdf2f8;
}

.page-header h2 {
    margin-top: 0;
    color: #be185d;
}

.page-header p {
    line-height: 1.7;
    color: #555;
}

.status-panel {
    margin-top: 18px;
    padding: 14px;
    border-radius: 8px;
    background-color: white;
}

.profile-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-top: 20px;
}

.profile-form label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-weight: bold;
    color: #444;
}

.profile-form input,
.profile-form textarea {
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font: inherit;
}

.profile-form textarea {
    resize: vertical;
}

.clear-button {
    align-self: flex-start;
    padding: 10px 18px;
    border: none;
    border-radius: 7px;
    background-color: #db2777;
    color: white;
    cursor: pointer;
}

.clear-button:hover {
    background-color: #be185d;
}

.preview-panel,
.log-panel {
    margin-top: 20px;
    padding: 18px;
    border-radius: 10px;
    background-color: white;
}

.preview-panel p {
    overflow-wrap: anywhere;
}

.log-panel ul {
    padding-left: 22px;
}

.log-panel li {
    margin-bottom: 8px;
    line-height: 1.5;
}
</style>