<script setup>
</script>

<template>
    <section class="message-box">
        <header class="message-header">
            <slot name="title"></slot>
        </header>

        <div class="message-body">
            <!-- 預設插槽也可以明確寫成 name="default" -->
            <slot name="default"></slot>
        </div>

        <footer class="message-footer">
            <slot name="actions"></slot>
        </footer>
    </section>
</template>

<style scoped>
.message-box {
    width: min(500px, 100%);
    overflow: hidden;

    border: 1px solid #d8dee3;
    border-radius: 12px;
    background-color: white;
}

.message-header {
    padding: 18px 20px;
    border-bottom: 1px solid #e6eaed;
}

.message-body {
    padding: 20px;
    color: #4d5961;
    line-height: 1.7;
}

.message-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;

    padding: 14px 20px;
    background-color: #f7f8f9;
}
</style>