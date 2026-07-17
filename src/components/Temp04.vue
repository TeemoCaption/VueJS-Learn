<script setup>
import { ref, nextTick } from 'vue'
// 或是 await nextTick()

const count = ref(0)

async function increase() {

    count.value++

    // 等待 Vue 完成 DOM 更新後，再執行後面的程式。
    // Vue 會修改 Reactive Data，先記錄有哪些東西要更新
    // 等目前這段 JavaScript 全部跑完
    // 才一次更新 DOM（Batch Update）
    await nextTick()

    const h1 = document.querySelector("h1")

    console.log(h1.textContent)
}
</script>

<template>
    <h1>第四小節-DOM 更新時機與 nextTick()</h1>
    <h2>{{ count }}</h2>

    <button @click="increase">
        加一
    </button>
</template>

<style scoped></style>