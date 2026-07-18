<template>
    <h1>第一小節-條件判斷</h1>
    <button @click="hasProducts = !hasProducts">
        切換購物車狀態
    </button>

    <template v-if="hasProducts">
        <h2>購物車</h2>
        <p>目前共有 3 件商品</p>
        <button>前往結帳</button>
    </template>

    <template v-else>
        <h2>購物車是空的</h2>
        <p>快去挑選喜歡的商品吧！</p>
    </template>
    <br>
    <button @click="isVisible = !isVisible">
        顯示／隱藏
    </button>
    <!-- 和 v-if 不同，v-show 只是切換 CSS 的 display 屬性，適合用於頻繁切換的場景 -->
    <!-- 但 v-show 不支援 template -->
    <h2 v-show="isVisible">
        我是由 v-show 控制的文字
    </h2>
    <br>
    <section v-if="isAdmin">
        <h2>管理員後台</h2>
        <button>管理使用者</button>
        <button>管理文章</button>
    </section>
</template>

<script setup>
import { ref } from 'vue'

const hasProducts = ref(true)
const isVisible = ref(true)
const isAdmin = ref(false)
</script>

<style scoped>
h2 {
    padding: 12px;
    border: 1px solid #999;
}
</style>