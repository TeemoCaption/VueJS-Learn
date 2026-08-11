<script setup>
import { ref, computed } from 'vue'
import gsap from 'gsap'

// 儲存搜尋關鍵字
const searchText = ref('')

// 待辦事項列表
const todos = ref([
    { id: 1, text: '學習 Vue' },
    { id: 2, text: '練習 SQL' },
    { id: 3, text: '複習機器學習' },
    { id: 4, text: '練習演算法' },
    { id: 5, text: '閱讀技術文章' }
])

// 下一筆資料使用的唯一編號
let nextId = 6

// 根據搜尋關鍵字篩選待辦事項
const filteredTodos = computed(() => {
    const keyword = searchText.value.trim().toLowerCase()

    // 沒有輸入關鍵字時，顯示全部項目
    if (!keyword) {
        return todos.value
    }

    // 保留文字中包含搜尋關鍵字的項目
    return todos.value.filter(todo =>
        todo.text.toLowerCase().includes(keyword)
    )
})

// 新增待辦事項
function addTodo() {
    todos.value.push({
        id: nextId,
        text: `新的待辦事項 ${nextId}`
    })

    nextId++
}

// 刪除指定的待辦事項
function removeTodo(id) {
    todos.value = todos.value.filter(todo => todo.id !== id)
}

// 隨機改變列表順序
function shuffleTodos() {
    todos.value = [...todos.value].sort(() => Math.random() - 0.5)
}

/*
  項目進入 DOM 前執行。

  先將項目設為透明並稍微向右偏移，
  準備接下來的進場動畫。
*/
function onBeforeEnter(el) {
    gsap.set(el, {
        opacity: 0,
        x: 30,
        height: 0
    })
}

/*
  項目進入 DOM 時執行。

  el.dataset.index 會取得模板中的 data-index。
  每個項目的索引不同，因此延遲時間也不同。
*/
function onEnter(el, done) {
    const index = Number(el.dataset.index)

    gsap.to(el, {
        opacity: 1,
        x: 0,
        height: 'auto',

        // 第 0 項延遲 0 秒
        // 第 1 項延遲 0.15 秒
        // 第 2 項延遲 0.30 秒
        delay: index * 0.15,

        duration: 0.5,

        // 動畫完成後通知 Vue
        onComplete: done
    })
}

/*
  項目離開 DOM 時執行。

  離開動畫完成後必須呼叫 done，
  Vue 才會真正移除這個 DOM 元素。
*/
function onLeave(el, done) {
    gsap.to(el, {
        opacity: 0,
        x: -30,
        height: 0,
        duration: 0.4,
        onComplete: done
    })
}
</script>

<template>
    <section class="todo-container">
        <h2>待辦事項</h2>

        <div class="controls">
            <!--
        搜尋文字改變時，filteredTodos 會重新計算，
        進入或離開篩選結果的項目就會播放動畫。
      -->
            <input v-model="searchText" type="text" placeholder="搜尋待辦事項">

            <div class="button-group">
                <button @click="addTodo">
                    新增待辦事項
                </button>

                <button @click="shuffleTodos">
                    隨機排序
                </button>
            </div>
        </div>

        <!--
      :css="false"：
      告訴 Vue 不要自動偵測 CSS transition，
      這裡的動畫完全交由 JavaScript 與 GSAP 控制。

      @before-enter：
      元素進入前執行。

      @enter：
      元素進入時執行。

      @leave：
      元素離開時執行。
    -->
        <TransitionGroup tag="ul" class="todo-list" :css="false" @before-enter="onBeforeEnter" @enter="onEnter"
            @leave="onLeave">
            <li v-for="(todo, index) in filteredTodos" :key="todo.id" :data-index="index" class="todo-item">
                <span>{{ todo.text }}</span>

                <button @click="removeTodo(todo.id)">
                    刪除
                </button>
            </li>
        </TransitionGroup>
    </section>
</template>

<style scoped>
.todo-container {
    width: 420px;
    margin: 40px auto;
}

.controls {
    display: grid;
    gap: 12px;
}

.controls input {
    padding: 10px;
    border: 1px solid #cccccc;
    border-radius: 6px;
}

.button-group {
    display: flex;
    gap: 12px;
}

.todo-list {
    padding: 0;
    list-style: none;
}

.todo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    box-sizing: border-box;
    margin-top: 12px;
    padding: 12px;

    overflow: hidden;
    border: 1px solid #cccccc;
    border-radius: 8px;
}
</style>