<script setup>

</script>

<template>
    <article class="dynamic-card">
        <!-- header 具名插槽 -->
        <header class="card-header">
            <slot name="header">
                <!-- 沒有提供 header 時顯示的預設內容 -->
                <span class="empty-text">目前沒有 Header 內容</span>
            </slot>
        </header>

        <!-- default 預設插槽 -->
        <main class="card-body">
            <slot>
                <p>目前沒有主要內容。</p>
            </slot>
        </main>

        <!-- footer 具名插槽 -->
        <footer class="card-footer">
            <slot name="footer">
                <!-- 沒有提供 footer 時顯示的預設內容 -->
                <span class="empty-text">目前沒有 Footer 內容</span>
            </slot>
        </footer>
    </article>
</template>

<style scoped>
.dynamic-card {
    width: min(600px, 100%);
    overflow: hidden;

    border: 1px solid #dce3e8;
    border-radius: 14px;

    background-color: white;
    box-shadow: 0 8px 24px rgb(0 0 0 / 8%);
}

.card-header {
    min-height: 90px;
    padding: 20px 24px;

    border-bottom: 1px solid #e5e9ec;
    background-color: #eaf8f2;
}

.card-body {
    min-height: 150px;
    padding: 24px;

    color: #45525d;
    line-height: 1.8;
}

.card-footer {
    min-height: 80px;
    padding: 18px 24px;

    border-top: 1px solid #e5e9ec;
    background-color: #f7f8f9;
}

.empty-text {
    color: #8a979f;
    font-size: 14px;
}
</style>