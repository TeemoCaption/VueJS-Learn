<script setup>
import { ref, shallowRef, onErrorCaptured } from 'vue'
import Home from './components/Home.vue'
import About from './components/About.vue'
import Product from './components/Product.vue'
import Login from './components/Login.vue'
import MyModal from './components/MyModal.vue'
import UserProfile from './components/UserProfile.vue'
import Dashboard from './components/Dashboard.vue'

// 待辦事項列表
const todos = ref([
  { id: 1, text: '學習 Vue' },
  { id: 2, text: '練習 SQL' },
  { id: 3, text: '複習機器學習' }
])

// 下一筆資料使用的唯一編號
let nextId = 4

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

// 使用 shallowRef 保存目前要顯示的元件，避免元件定義本身被轉成深層響應式物件。
const current = shallowRef(Home)
const cachePages = [
  'Home',
  'Product'
]

// 控制使用者資訊 Modal 是否顯示
const isUserModalOpen = ref(false)

// 控制刪除確認 Modal 是否顯示
const isDeleteModalOpen = ref(false)

/*
  控制是否停用 Teleport。

  false：
    正常使用 Teleport

  true：
    停用 Teleport
*/
const disableTeleport = ref(false)

// 開啟使用者資訊 Modal
function openUserModal() {
  isUserModalOpen.value = true
}

// 關閉使用者資訊 Modal
function closeUserModal() {
  isUserModalOpen.value = false
}

// 開啟刪除確認 Modal
function openDeleteModal() {
  isDeleteModalOpen.value = true
}

// 關閉刪除確認 Modal
function closeDeleteModal() {
  isDeleteModalOpen.value = false
}

// 執行刪除操作
function confirmDelete() {
  console.log('已確認刪除資料')

  // 完成操作後關閉 Modal
  isDeleteModalOpen.value = false
}

// 儲存錯誤訊息
const errorMessage = ref('')

// 捕捉子元件中發生的錯誤
//
// 包含 UserProfile 裡面
// async setup / 頂層 await 發生的錯誤
onErrorCaptured((error) => {
  console.error('捕捉到錯誤：', error)

  // 將錯誤訊息存起來
  errorMessage.value = error.message

  // 回傳 false 可以阻止錯誤繼續向上傳播
  return false
})

// Suspense 進入等待狀態時執行
function handlePending() {
  console.log('Suspense 進入 Pending 狀態')
}

// fallback 真正顯示到畫面時執行
function handleFallback() {
  console.log('開始顯示 fallback')
}

// 所有非同步依賴完成時執行
function handleResolve() {
  console.log('Suspense 已經完成')
}
</script>

<template>
  <section class="todo-container">
    <h2>待辦事項</h2>

    <div class="button-group">
      <button @click="addTodo">
        新增待辦事項
      </button>

      <button @click="shuffleTodos">
        隨機排序
      </button>
    </div>

    <TransitionGroup name="list" tag="ul" move-class="todo-moving" class="todo-list">
      <li v-for="todo in todos" :key="todo.id" class="todo-item">
        <span>{{ todo.text }}</span>

        <button @click="removeTodo(todo.id)">
          刪除
        </button>
      </li>
    </TransitionGroup>
  </section>
  <div>
    <!-- 切換元件 -->
    <button @click="current = Home">
      Home
    </button>

    <button @click="current = About">
      About
    </button>

    <button @click="current = Product">
      Product
    </button>

    <button @click="current = Login">
      Login
    </button>

    <!-- KeepAlive 會快取目前顯示過的元件 -->
    <!-- include：只有符合名稱的元件才會被快取。可以指定多個元件 -->
    <!-- max 用來限制 最多可以快取幾個元件 -->
    <KeepAlive :include="cachePages" :max="3">
      <component :is="current" />
    </KeepAlive>
  </div>
  <div class="page">
    <h1>多個 Teleport 共享目標</h1>

    <p>
      以下兩個 Modal 都會被傳送到相同的
      <code>#modals</code>
      容器。
    </p>

    <div class="button-group">
      <!-- 開啟第一個 Modal -->
      <button class="open-button" type="button" @click="openUserModal">
        顯示使用者資訊
      </button>

      <!-- 開啟第二個 Modal -->
      <button class="delete-button" type="button" @click="openDeleteModal">
        刪除資料
      </button>
    </div>

    <label class="teleport-setting">
      <!--
        勾選後，兩個 Modal 都不再傳送到 #modals，
        而是留在 App.vue 原本的 DOM 位置。
      -->
      <input v-model="disableTeleport" type="checkbox" />

      停用 Teleport
    </label>

    <!--
      第一個 MyModal 實例。

      :is-open 將父元件的狀態傳給子元件。
      @close 接收子元件發出的 close 事件。
    -->
    <MyModal :is-open="isUserModalOpen" :disabled="disableTeleport" title="使用者資訊" modal-type="user"
      @close="closeUserModal">
      <!-- 透過預設插槽傳入 Modal 內容 -->
      <p>姓名：小明</p>
      <p>身分：Vue.js 學習者</p>
    </MyModal>

    <!--
      第二個 MyModal 實例。

      它與第一個 Modal 都會 Teleport 到 #modals。
      因為它寫在第一個 MyModal 後面，
      掛載後也會位於 #modals 中較後面的位置。
    -->
    <MyModal :is-open="isDeleteModalOpen" :disabled="disableTeleport" title="刪除確認" modal-type="delete"
      @close="closeDeleteModal" @confirm="confirmDelete">
      <!-- 透過預設插槽傳入不同內容 -->
      <p>確定要刪除這筆資料嗎？</p>
      <p>刪除後將無法復原。</p>
    </MyModal>
  </div>
  <div>
    <h1>會員中心</h1>

    <!--
      如果發生錯誤，
      顯示我們自己準備的錯誤畫面
    -->
    <div v-if="errorMessage">
      <h2>載入失敗</h2>
      <p>{{ errorMessage }}</p>
    </div>

    <!--
      沒有錯誤時，
      才顯示 Suspense
    -->
    <Suspense v-else @pending="handlePending" @fallback="handleFallback" @resolve="handleResolve">
      <!--
        #default：
        真正要顯示的內容

        UserProfile 裡面包含頂層 await，
        因此屬於 Suspense 的非同步依賴
      -->
      <template #default>
        <UserProfile />
      </template>

      <!--
        #fallback：
        只代表「仍在等待」
        並不是錯誤處理畫面
      -->
      <template #fallback>
        <div>
          <p>使用者資料載入中...</p>
        </div>
      </template>
    </Suspense>
  </div>
  <div>
    <h1>Vue Suspense Demo</h1>

    <!--
      RouterLink：
      用來切換不同路由，
      不需要重新整理整個網頁。
    -->
    <nav>
      <RouterLink to="/user">
        使用者
      </RouterLink>

      |

      <RouterLink to="/dashboard">
        Dashboard
      </RouterLink>
    </nav>

    <hr />

    <!--
      RouterView：
      取得目前 URL 對應的頁面元件。

      v-slot="{ Component }"
      讓我們可以自己控制
      這個路由元件要如何渲染。
    -->
    <RouterView v-slot="{ Component }">

      <!--
        確認目前確實有路由元件
      -->
      <template v-if="Component">

        <!--
          Transition：
          負責頁面切換動畫。

          mode="out-in"：
          舊頁面先離開，
          新頁面再出現。
        -->
        <Transition name="fade" mode="out-in">

          <!--
            KeepAlive：
            保留切換出去的頁面狀態。
          -->
          <KeepAlive>
            <Suspense>

              <!--
                顯示 RouterView
                提供的目前頁面元件。
              -->
              <component :is="Component" />

              <!--
                頁面中的頂層 await
                尚未完成時，
                顯示 fallback。
              -->
              <template #fallback>
                <div>
                  <p>頁面載入中...</p>
                </div>
              </template>

            </Suspense>
          </KeepAlive>

        </Transition>

      </template>

    </RouterView>
  </div>
  <div>
    <h1>會員中心</h1>

    <!--
      外層 Suspense：
      統一管理 Dashboard 元件樹中的
      非同步依賴。
    -->
    <Suspense @pending="handlePending" @fallback="handleFallback" @resolve="handleResolve">
      <!--
        Dashboard 裡面還有一個
        suspensible 的內層 Suspense。
      -->
      <Dashboard />

      <!--
        外層 Suspense 統一提供
        loading 狀態。
      -->
      <template #fallback>
        <div>
          <p>會員資料載入中...</p>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
.todo-container {
  width: 420px;
  margin: 40px auto;
}

.todo-list {
  position: relative;
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

  border: 1px solid #cccccc;
  border-radius: 8px;
}

/*
  這是自訂的移動 class。

  因為 TransitionGroup 設定了：
  move-class="todo-moving"

  所以不再使用預設的 .list-move。
*/
.todo-moving {
  transition: transform 0.5s ease;
}

/* 元素進入與離開期間的動畫 */
.list-enter-active,
.list-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

/* 元素進入前的初始狀態 */
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

/* 元素離開後的結束狀態 */
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/*
  讓離開中的元素脫離正常排版流程，
  使其他項目可以立即開始移動。
*/
.list-leave-active {
  position: absolute;
}

.page {
  min-height: 100vh;
  padding: 40px;
  text-align: center;
  background-color: #f6f6f6;
}

/* 按鈕容器 */
.button-group {
  display: flex;
  justify-content: center;
  gap: 12px;

  margin-top: 20px;
}

/* 共用按鈕樣式 */
.open-button,
.delete-button {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;

  color: white;
  cursor: pointer;
}

/* 開啟使用者資訊按鈕 */
.open-button {
  background-color: #42b883;
}

/* 刪除按鈕 */
.delete-button {
  background-color: #d33;
}

/* Teleport 設定區域 */
.teleport-setting {
  display: block;
  margin-top: 24px;
}

/*
  Transition 的進入與離開動畫。
*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

/*
  進入動畫開始與離開動畫結束時，
  將透明度設為 0。
*/
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
