<template>
    <h1>第二小節-Directive</h1>
    <br>
    <p v-if="isVisible">
        這段文字是否顯示，由資料決定
    </p>
    <br>
    <p v-if="score >= 60">
        及格
    </p>
    <br>
    <!-- 未登入或載入中時，按鈕為禁用狀態 -->
    <button :disabled="!isLoggedIn || isLoading">
        送出
    </button>
    <br>
    <p>{{ formatName(userName) }}</p>
    <br>
    <li v-for="item in items">
        {{ item }}
    </li>
    <br>
    <button @click="count++">
        點我
    </button>
    <p>{{ count }}</p>
    <br>
    <!-- 動態属性綁定 -->
    <button :[attributeName]="attributeValue">
        把滑鼠移到我上面
    </button>
    <br>
    <!-- 動態事件綁定 -->
    <button @[eventName]="handleEvent">
        觸發事件
    </button>
    <br>
    <a :[attributeName02]="url">
        網站
    </a>
    <br>
    <!-- 動態屬性名 -->
    <div :[finalAttributeName]="attributeName03">
        這是動態屬性
    </div>
    <br>
    <!-- 事件修飾符(表單送出後不會重新整理頁面) -->
    <form @submit.prevent="handleSubmit"></form>
</template>

<script setup>
// 從 Vue 匯入 ref，建立可以被範本響應式使用的資料
import { ref } from 'vue'

const isVisible = ref(true)
const score = ref(40)
const isLoggedIn = ref(false)
const isLoading = ref(false)
const userName = 'alice'
const items = ['apple', 'banana', 'orange']
const count = ref(0)
const attributeName = 'title'
const attributeValue = '這是提示文字'
const eventName = 'click'
const attributeName02 = 'href'
const url = 'https://www.google.com'

// 動態屬性名
const attributeName03 = 'id'
const finalAttributeName = `data-${attributeName03}`

// 在模板綁定中呼叫的函式，可能會在元件每次更新時重新執行
// 因此不應該在裡面修改狀態、發送請求或產生其他副作用。
// 較好的函式應該只根據輸入產生結果
function formatName(name) {
    return name.toUpperCase()
}

function handleEvent() {
    console.log('事件被觸發')
}

</script>

<style scoped></style>
