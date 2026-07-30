<script setup>
// Vue 會將非同步元件載入時產生的錯誤，
// 透過 error prop 傳給錯誤元件。

defineProps({
    error: {
        type: Error,
        default: null
    }
})
</script>

<template>
    <div class="error-box">
        <div class="error-icon">!</div>

        <div>
            <h2>元件載入失敗</h2>

            <p>
                無法載入使用者卡片，請檢查網路或稍後再試。
            </p>

            <!-- 開發階段可以顯示詳細錯誤訊息 -->
            <p v-if="error" class="error-message">
                錯誤訊息：{{ error.message }}
            </p>
        </div>
    </div>
</template>

<style scoped>
.error-box {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    max-width: 520px;
    margin-top: 20px;
    padding: 24px;
    border: 2px solid #f56c6c;
    border-radius: 14px;
    background-color: #fff5f5;
}

.error-icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-color: #f56c6c;
    color: white;
    font-size: 26px;
    font-weight: bold;
}

.error-box h2 {
    margin: 0 0 8px;
    color: #c45656;
}

.error-box p {
    margin: 6px 0;
}

.error-message {
    color: #a33;
    font-family: monospace;
    word-break: break-word;
}
</style>