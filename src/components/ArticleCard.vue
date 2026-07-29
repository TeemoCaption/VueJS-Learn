<script setup>
import { useSlots } from 'vue'

// 父元件會透過具名插槽傳入 header、default、footer 的內容。

// 取得父元件提供的所有插槽
const slots = useSlots()
</script>

<template>
    <article class="article-card">
        <!-- header 具名插槽 -->
        <header class="card-header">
            <slot name="header"></slot>
        </header>

        <!--
      沒有 name 屬性的 slot 是預設插槽。
      它的完整名稱其實是 default。
    -->
        <main class="card-body">
            <slot></slot>
        </main>

        <!-- footer 具名插槽 -->
        <footer class="card-footer">
            <slot name="footer"></slot>
        </footer>
    </article>
    <div class="card">

        <!--
        只有父元件提供 header 插槽時，
        才顯示整個 header 區塊。
    -->
        <header v-if="slots.header" class="card-header">
            <slot name="header"></slot>
        </header>

        <!--
        主內容一定存在，
        因為它是 default slot。
    -->
        <main class="card-body">
            <slot></slot>
        </main>

        <!--
        footer 也是一樣。
    -->
        <footer v-if="slots.footer" class="card-footer">
            <slot name="footer"></slot>
        </footer>

    </div>
</template>

<style scoped>
.article-card {
    width: min(600px, 100%);
    overflow: hidden;

    border: 1px solid #dce3e8;
    border-radius: 14px;

    background-color: white;
    box-shadow: 0 8px 24px rgb(0 0 0 / 8%);
}

.card {

    width: 500px;

    border-radius: 10px;

    border: 1px solid #ccc;

    overflow: hidden;

}

.card-header {
    padding: 22px 24px;
    border-bottom: 1px solid #e8ecef;
    background-color: #f4fbf8;
}

.card-body {
    padding: 24px;
    color: #45525d;
    line-height: 1.8;
}

.card-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    padding: 16px 24px;
    border-top: 1px solid #e8ecef;
    background-color: #fafafa;
}
</style>