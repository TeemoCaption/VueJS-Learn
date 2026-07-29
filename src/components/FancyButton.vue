<script setup>
// 目前不需要 JavaScript 邏輯。
// 插槽內容會由父元件 App.vue 傳入。
</script>

<template>
    <button class="fancy-button">
        <!--
      slot 是插槽出口。
      父元件寫在 <FancyButton>...</FancyButton>
      中間的內容，會出現在這個位置。
    -->
        <!-- Vue 允許我們設定 預設內容（Fallback Content）。 -->
        <slot>預設按鈕文字</slot>
    </button>
</template>

<style scoped>
.fancy-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    padding: 10px 18px;
    border: none;
    border-radius: 8px;

    background-color: #42b883;
    color: white;

    font-size: 16px;
    font-weight: 600;
    cursor: pointer;

    transition:
        background-color 0.2s,
        transform 0.2s;
}

.fancy-button:hover {
    background-color: #369f72;
    transform: translateY(-2px);
}

.fancy-button:active {
    transform: translateY(0);
}
</style>