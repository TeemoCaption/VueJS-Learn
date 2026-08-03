<script setup>
import { ref, onErrorCaptured } from 'vue'
import BuggyComponent from './BuggyComponent.vue'

// 是否已經捕捉到錯誤
const hasError = ref(false)

// 顯示給使用者看的錯誤訊息
const errorMessage = ref('')

// 開發者除錯資訊
const errorInfo = ref('')

// 用來重新建立 BuggyComponent
const componentKey = ref(0)

/*
 * 捕捉子孫元件傳遞上來的錯誤。
 *
 * 注意：
 * onErrorCaptured 主要捕捉「子孫元件」的錯誤，
 * 不是捕捉 ErrorBoundary 自己內部的錯誤。
 */
onErrorCaptured((error, instance, info) => {
    console.group('ErrorBoundary 捕捉到錯誤')

    console.error('錯誤物件：', error)
    console.log('發生錯誤的元件實例：', instance)
    console.log('錯誤來源資訊：', info)

    console.groupEnd()

    // 切換成錯誤畫面
    hasError.value = true

    // error 的型別是 unknown，因此先安全判斷
    if (error instanceof Error) {
        errorMessage.value = error.message
    } else {
        errorMessage.value = String(error)
    }

    errorInfo.value = info

    /*
     * 回傳 false 代表：
     * 「這個錯誤已經在這裡處理完畢。」
     *
     * Vue 不會再把同一個錯誤往更上層傳遞，
     * 也不會交給 app.config.errorHandler。
     */
    return false
})

// 清除錯誤並重新建立子元件
function resetComponent() {
    hasError.value = false
    errorMessage.value = ''
    errorInfo.value = ''

    /*
     * key 改變後，Vue 會移除舊的 BuggyComponent，
     * 並建立一個全新的 BuggyComponent。
     */
    componentKey.value++
}
</script>

<template>
    <section class="error-boundary">
        <!--
      沒有錯誤時才渲染原本的子元件。

      這點非常重要：
      捕捉到錯誤後，不可以繼續渲染會造成錯誤的內容，
      否則可能再次發生相同錯誤，形成無限循環。
    -->
        <BuggyComponent v-if="!hasError" :key="componentKey" />

        <!-- 捕捉錯誤後顯示替代畫面 -->
        <div v-else class="fallback-panel">
            <h2>資料顯示失敗</h2>

            <p>
                子元件發生錯誤，但錯誤已經由
                <code>ErrorBoundary</code>
                處理。
            </p>

            <details class="error-details">
                <summary>查看錯誤資訊</summary>

                <p>
                    <strong>錯誤訊息：</strong>
                    {{ errorMessage }}
                </p>

                <p>
                    <strong>錯誤來源：</strong>
                    {{ errorInfo }}
                </p>
            </details>

            <button class="retry-button" @click="resetComponent">
                重新建立元件
            </button>
        </div>
    </section>
</template>

<style scoped>
.error-boundary {
    max-width: 700px;
    margin: 24px auto;
}

.fallback-panel {
    padding: 26px;
    border: 2px solid #ef4444;
    border-radius: 12px;
    background-color: #fef2f2;
}

.fallback-panel h2 {
    margin-top: 0;
    color: #b91c1c;
}

.error-details {
    margin: 20px 0;
    padding: 14px;
    border-radius: 8px;
    background-color: white;
}

.error-details summary {
    font-weight: bold;
    cursor: pointer;
}

.error-details p {
    overflow-wrap: anywhere;
}

code {
    padding: 2px 6px;
    border-radius: 4px;
    background-color: #fee2e2;
}

.retry-button {
    padding: 10px 18px;
    border: none;
    border-radius: 6px;
    background-color: #2563eb;
    color: white;
    cursor: pointer;
}

.retry-button:hover {
    background-color: #1d4ed8;
}
</style>