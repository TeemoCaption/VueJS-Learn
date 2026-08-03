<script setup>
import LifecycleDemo from './components/LifecycleDemo.vue'
import UserList from './components/UserList.vue'

import ErrorBoundary from './components/ErrorBoundary.vue'

import ProfileView from './components/ProfileView.vue'
import CounterView from './components/CounterView.vue'

import RenderDebugDemo from './components/RenderDebugDemo.vue'

import { ref, computed } from 'vue'

// 控制子元件是否存在
const showComponent = ref(true)

// 切換元件顯示狀態
function toggleComponent() {
  showComponent.value = !showComponent.value
}

// 控制 UserList 元件是否存在
const showUserList = ref(true)

function toggleUserList() {
  showUserList.value = !showUserList.value
}

// App 本身的計數器
const appCount = ref(0)

function increaseAppCount() {
  appCount.value++
}

// 記錄目前要顯示哪一個頁面
const currentView = ref('profile')

// 將字串對應到真正的 Vue 元件
const currentComponent = computed(() => {
  if (currentView.value === 'profile') {
    return ProfileView
  }

  return CounterView
})

/**
 * 切換目前顯示的元件。
 */
function switchView(viewName) {
  currentView.value = viewName
}
</script>

<template>
  <main class="app-container">
    <div>
      <h1>Vue.js 生命週期教學</h1>

      <div class="control-panel">
        <p>
          子元件狀態：
          <strong>
            {{ showComponent ? '存在' : '已移除' }}
          </strong>
        </p>

        <button @click="toggleComponent">
          {{ showComponent ? '移除元件' : '重新建立元件' }}
        </button>
      </div>

      <!--
      v-if 為 true 時，建立 LifecycleDemo 元件。
      v-if 為 false 時，真正移除 LifecycleDemo 元件。
    -->
      <LifecycleDemo v-if="showComponent" />

      <div v-else class="removed-message">
        LifecycleDemo 元件目前已經被移除。
      </div>
    </div>
    <div>
      <h1>onMounted 呼叫 API</h1>

      <div class="control-panel">
        <button @click="toggleUserList">
          {{ showUserList ? '移除使用者列表' : '重新載入使用者列表' }}
        </button>
      </div>

      <UserList v-if="showUserList" />

      <p v-else class="removed-message">
        使用者列表元件已移除。
      </p>
    </div>
    <div>
      <header class="page-header">
        <h1>Vue `onErrorCaptured()` 教學</h1>

        <p>
          觀察父元件如何捕捉子元件錯誤，
          並顯示替代畫面。
        </p>
      </header>

      <!--
      App 自己的功能不在 ErrorBoundary 內。
      即使 BuggyComponent 發生錯誤，
      這個計數器仍然可以繼續操作。
    -->
      <section class="app-counter">
        <h2>App 元件功能</h2>

        <p>App 計數：{{ appCount }}</p>

        <button @click="increaseAppCount">
          增加 App 計數
        </button>
      </section>

      <!-- 錯誤邊界 -->
      <ErrorBoundary />
    </div>
    <div>
      <header class="app-header">
        <h1>Vue KeepAlive 生命週期教學</h1>

        <p>
          觀察元件在切換時如何進入快取，
          並保留原本的資料狀態。
        </p>
      </header>

      <nav class="navigation">
        <button :class="{ active: currentView === 'profile' }" @click="switchView('profile')">
          個人資料
        </button>

        <button :class="{ active: currentView === 'counter' }" @click="switchView('counter')">
          計數器
        </button>
      </nav>

      <section class="content-container">
        <!--
        KeepAlive 會快取其中的動態元件。

        當 currentComponent 改變時：
        1. 原本的元件不會立即卸載
        2. 原本的元件會進入快取
        3. 新元件顯示在畫面中
        4. 切回時，取出原來的元件實例
      -->
        <KeepAlive>
          <component :is="currentComponent" />
        </KeepAlive>
      </section>
    </div>
    <div>
      <header class="app-header">
        <h1>Vue 渲染偵錯生命週期</h1>

        <p>
          練習使用 onRenderTracked() 與 onRenderTriggered()
          找出元件的渲染依賴。
        </p>
      </header>

      <RenderDebugDemo />
    </div>
  </main>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: 30px;
  font-family: Arial, sans-serif;
  background-color: #f3f4f6;
}

h1 {
  text-align: center;
  color: #2c3e50;
}

.control-panel {
  max-width: 650px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
  background-color: white;
  border-radius: 12px;
}

button {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  background-color: #ef4444;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #dc2626;
}

.removed-message {
  max-width: 650px;
  margin: 20px auto;
  padding: 30px;
  text-align: center;
  border: 2px dashed #999;
  border-radius: 12px;
  color: #666;
}

.page-header {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.page-header h1 {
  color: #2c3e50;
}

.page-header p {
  color: #555;
  line-height: 1.7;
}

.app-counter {
  max-width: 700px;
  margin: 24px auto;
  padding: 20px;
  border-radius: 12px;
  background-color: white;
}

.app-counter h2 {
  margin-top: 0;
}

.app-counter button {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  background-color: #42b883;
  color: white;
  cursor: pointer;
}

.app-counter button:hover {
  background-color: #369f70;
}

.navigation {
  display: flex;
  justify-content: center;
  gap: 12px;
  max-width: 760px;
  margin: 24px auto;
}

.navigation button {
  padding: 11px 22px;
  border: 2px solid #42b883;
  border-radius: 8px;
  background-color: white;
  color: #166534;
  cursor: pointer;
}

.navigation button:hover {
  background-color: #ecfdf5;
}

.navigation button.active {
  background-color: #42b883;
  color: white;
}

.content-container {
  max-width: 760px;
  margin: 0 auto;
}

.app-container> :last-child {
  max-width: 900px;
  margin-right: auto;
  margin-left: auto;
}
</style>
