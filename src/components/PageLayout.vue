<script setup>

</script>

<template>
    <div class="page-layout">
        <header class="page-header">
            <slot name="header">
                <!-- 父元件沒有提供 header 時顯示 -->
                <h2>預設頁面標題</h2>
            </slot>
        </header>

        <main class="page-main">
            <slot>
                <!-- 父元件沒有提供 default 時顯示 -->
                <p>目前沒有頁面內容。</p>
            </slot>
        </main>

        <footer class="page-footer">
            <slot name="footer">
                <!-- 父元件沒有提供 footer 時顯示 -->
                <p>版權所有 © 2026</p>
            </slot>
        </footer>
    </div>
</template>

<style scoped>
.page-layout {
    width: min(700px, 100%);
    overflow: hidden;

    border: 1px solid #dce2e6;
    border-radius: 12px;
    background-color: white;
}

.page-header,
.page-main,
.page-footer {
    padding: 20px;
}

.page-header {
    border-bottom: 1px solid #e7ebee;
}

.page-main {
    min-height: 160px;
}

.page-footer {
    border-top: 1px solid #e7ebee;
    color: #76828a;
    font-size: 14px;
}
</style>