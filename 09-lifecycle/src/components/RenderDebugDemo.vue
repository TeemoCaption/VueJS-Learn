<script setup>
import {
    computed,
    reactive,
    ref,
    onRenderTracked,
    onRenderTriggered
} from 'vue'

// 顯示在模板中的計數器
const count = ref(0)

// 顯示在模板中的使用者資料
const user = reactive({
    name: '小明',
    age: 20
})

// 沒有直接顯示在模板中的資料
const hiddenMessage = ref('這是一段隱藏訊息')

// 記錄元件重新計算畫面內容的次數
const renderCalculationCount = ref(0)

// 儲存 onRenderTracked 的紀錄
const trackedLogs = ref([])

// 儲存 onRenderTriggered 的紀錄
const triggeredLogs = ref([])

/*
 * computed 會根據 count 和 user 的資料產生文字。
 *
 * 因為 summary 顯示在模板中，
 * 所以 summary 所讀取的響應式資料也會成為渲染依賴。
 */
const summary = computed(() => {
    renderCalculationCount.value++

    return `${user.name}今年 ${user.age} 歲，目前計數為 ${count.value}`
})

/*
 * 將 key 安全地轉換成字串。
 *
 * 某些 key 可能是 Symbol，
 * 因此不能假設它一定是一般字串。
 */
function formatKey(key) {
    if (typeof key === 'symbol') {
        return key.description || key.toString()
    }

    return String(key)
}

/*
 * 將 target 簡化成比較容易閱讀的名稱。
 *
 * 在實際除錯時，也可以直接 console.log(event.target)
 * 查看完整物件。
 */
function identifyTarget(target) {
    if (target === user) {
        return 'user'
    }

    return 'ref 或其他響應式目標'
}

/*
 * 渲染過程追蹤到響應式依賴時執行。
 *
 * 注意：
 * 這個鉤子可能在一次渲染中執行很多次，
 * 因為模板可能讀取很多響應式資料。
 */
onRenderTracked((event) => {
    const log = {
        id: crypto.randomUUID(),
        type: event.type,
        key: formatKey(event.key),
        target: identifyTarget(event.target)
    }

    trackedLogs.value.push(log)

    console.group('onRenderTracked：追蹤到渲染依賴')
    console.log('操作類型：', event.type)
    console.log('屬性名稱：', event.key)
    console.log('目標物件：', event.target)
    console.log('完整事件：', event)
    console.groupEnd()

    /*
     * 不要在真實專案中長期保存大量事件，
     * 否則紀錄可能越來越多。
     */
    if (trackedLogs.value.length > 30) {
        trackedLogs.value.shift()
    }
})

/*
 * 某個響應式依賴改變並觸發重新渲染時執行。
 */
onRenderTriggered((event) => {
    const log = {
        id: crypto.randomUUID(),
        type: event.type,
        key: formatKey(event.key),
        oldValue: event.oldValue,
        newValue: event.newValue
    }

    triggeredLogs.value.push(log)

    console.group('onRenderTriggered：響應式資料觸發重新渲染')
    console.log('操作類型：', event.type)
    console.log('屬性名稱：', event.key)
    console.log('舊值：', event.oldValue)
    console.log('新值：', event.newValue)
    console.log('目標物件：', event.target)
    console.log('完整事件：', event)
    console.groupEnd()

    if (triggeredLogs.value.length > 20) {
        triggeredLogs.value.shift()
    }
})

// 修改 count
function increaseCount() {
    count.value++
}

// 修改模板中有使用的 user.name
function changeName() {
    user.name = user.name === '小明' ? '小美' : '小明'
}

// 修改模板中有使用的 user.age
function increaseAge() {
    user.age++
}

/*
 * 修改沒有直接顯示在模板中的資料。
 *
 * hiddenMessage 沒有被模板或 summary 使用，
 * 因此它通常不會觸發這個元件重新渲染。
 */
function changeHiddenMessage() {
    hiddenMessage.value = `隱藏訊息更新於 ${new Date().toLocaleTimeString()}`

    console.log('hiddenMessage 已修改：', hiddenMessage.value)
}

// 清除畫面中的偵錯紀錄
function clearLogs() {
    trackedLogs.value = []
    triggeredLogs.value = []
}
</script>

<template>
    <section class="debug-demo">
        <header class="page-header">
            <h2>渲染偵錯示範</h2>

            <p>
                使用按鈕修改不同資料，並觀察哪些資料會觸發元件重新渲染。
            </p>
        </header>

        <div class="data-panel">
            <h3>目前畫面資料</h3>

            <!-- count 會成為渲染依賴 -->
            <p>
                計數：
                <strong>{{ count }}</strong>
            </p>

            <!-- user.name 會成為渲染依賴 -->
            <p>
                姓名：
                <strong>{{ user.name }}</strong>
            </p>

            <!-- user.age 會成為渲染依賴 -->
            <p>
                年齡：
                <strong>{{ user.age }}</strong>
            </p>

            <!--
        summary 是 computed。
        summary 內部讀取了 count、user.name、user.age。
      -->
            <p>
                摘要：
                <strong>{{ summary }}</strong>
            </p>

            <p>
                computed 計算次數：
                <strong>{{ renderCalculationCount }}</strong>
            </p>
        </div>

        <div class="button-panel">
            <button @click="increaseCount">
                count +1
            </button>

            <button @click="changeName">
                切換姓名
            </button>

            <button @click="increaseAge">
                年齡 +1
            </button>

            <button class="hidden-button" @click="changeHiddenMessage">
                修改隱藏資料
            </button>

            <button class="clear-button" @click="clearLogs">
                清除紀錄
            </button>
        </div>

        <div class="explanation-panel">
            <h3>隱藏資料說明</h3>

            <p>
                <code>hiddenMessage</code>
                雖然是響應式資料，但它沒有出現在模板或
                <code>summary</code>
                中。
            </p>

            <p>
                因此修改它時，通常不會觸發這個元件重新渲染。
                請開啟瀏覽器 Console 觀察它的更新訊息。
            </p>
        </div>

        <div class="log-grid">
            <section class="log-panel">
                <h3>onRenderTracked 紀錄</h3>

                <p class="hint">
                    顯示元件渲染時讀取了哪些依賴。
                </p>

                <p v-if="trackedLogs.length === 0">
                    目前沒有紀錄。
                </p>

                <ul v-else>
                    <li v-for="log in trackedLogs" :key="log.id">
                        <span>類型：{{ log.type }}</span>
                        <span>Key：{{ log.key }}</span>
                        <span>目標：{{ log.target }}</span>
                    </li>
                </ul>
            </section>

            <section class="log-panel triggered-panel">
                <h3>onRenderTriggered 紀錄</h3>

                <p class="hint">
                    顯示哪個資料變更造成重新渲染。
                </p>

                <p v-if="triggeredLogs.length === 0">
                    尚未有資料觸發重新渲染。
                </p>

                <ul v-else>
                    <li v-for="log in triggeredLogs" :key="log.id">
                        <span>類型：{{ log.type }}</span>
                        <span>Key：{{ log.key }}</span>
                        <span>
                            舊值：{{ String(log.oldValue) }}
                        </span>
                        <span>
                            新值：{{ String(log.newValue) }}
                        </span>
                    </li>
                </ul>
            </section>
        </div>
    </section>
</template>

<style scoped>
.debug-demo {
    padding: 24px;
    border: 2px solid #7c3aed;
    border-radius: 14px;
    background-color: #f5f3ff;
}

.page-header h2 {
    margin-top: 0;
    color: #6d28d9;
}

.page-header p {
    line-height: 1.7;
    color: #555;
}

.data-panel,
.explanation-panel,
.log-panel {
    margin-top: 20px;
    padding: 18px;
    border-radius: 10px;
    background-color: white;
}

.data-panel h3,
.explanation-panel h3,
.log-panel h3 {
    margin-top: 0;
}

.data-panel p {
    margin: 10px 0;
}

.button-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 20px;
}

button {
    padding: 10px 16px;
    border: none;
    border-radius: 7px;
    background-color: #7c3aed;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #6d28d9;
}

.hidden-button {
    background-color: #2563eb;
}

.hidden-button:hover {
    background-color: #1d4ed8;
}

.clear-button {
    background-color: #64748b;
}

.clear-button:hover {
    background-color: #475569;
}

.explanation-panel {
    border-left: 5px solid #2563eb;
}

.explanation-panel p {
    line-height: 1.7;
}

code {
    padding: 2px 6px;
    border-radius: 4px;
    background-color: #ede9fe;
}

.log-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.log-panel {
    min-width: 0;
}

.triggered-panel {
    border-top: 4px solid #ef4444;
}

.hint {
    color: #666;
    line-height: 1.6;
}

.log-panel ul {
    max-height: 350px;
    padding-left: 22px;
    overflow-y: auto;
}

.log-panel li {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 12px;
    padding: 10px;
    border-radius: 6px;
    background-color: #f8fafc;
    overflow-wrap: anywhere;
}

@media (max-width: 700px) {
    .log-grid {
        grid-template-columns: 1fr;
    }
}
</style>