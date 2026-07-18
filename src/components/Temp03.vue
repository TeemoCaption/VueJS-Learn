<template>
    <h1>第三小節-過濾與排序</h1>
    <ul>
        <li v-for="todo in incompleteTodos" :key="todo.id">
            {{ todo.title }}
        </li>
    </ul>
    <br>
    <button @click="shouldShowTodos = !shouldShowTodos">
        {{ shouldShowTodos ? '隱藏列表' : '顯示列表' }}
    </button>

    <ul v-if="shouldShowTodos">
        <li v-for="todo in todos" :key="todo.id">
            {{ todo.title }}
        </li>
    </ul>
</template>

<script setup>
import { computed, ref } from 'vue'

const shouldShowTodos = ref(true)

const todos = ref([
    {
        id: 1,
        title: '學習 Vue',
        isComplete: false
    },
    {
        id: 2,
        title: '完成作業',
        isComplete: true
    },
    {
        id: 3,
        title: '複習 JavaScript',
        isComplete: false
    }
])

// computed 用來計算屬性，會自動追蹤依賴的響應式資料
const incompleteTodos = computed(() => {
    // 篩選出未完成的待辦事項
    return todos.value.filter(todo => !todo.isComplete)
})
</script>

<style scoped></style>