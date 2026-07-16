<script setup>
import { ref } from 'vue'

function showMessage() {
    alert('按鈕被點擊了')
}

function handleSubmit() {
    alert('表單已送出，但頁面不會重新整理')
}

const websiteUrl = 'https://cn.vuejs.org/'
// 滑鼠移入事件
const eventName = 'mouseenter'

</script>

<template>
    <main>
        <h1>第二小節-Directive練習</h1>

        <section>
            <h2>v-bind 指令</h2>

            <a :href="websiteUrl">
                Vue 官方網站
            </a>
        </section>

        <hr>

        <section>
            <h2>v-on 指令</h2>

            <button @click="showMessage">
                點我
            </button>
        </section>

        <hr>

        <section>
            <h2>動態事件參數</h2>

            <button @[eventName]="showMessage">
                滑鼠移到這裡
            </button>
        </section>

        <hr>

        <section>
            <h2>事件修飾符</h2>

            <form @submit.prevent="handleSubmit">
                <input type="text" placeholder="請輸入內容">

                <button type="submit">
                    送出
                </button>
            </form>
        </section>
    </main>
</template>

<style scoped></style>