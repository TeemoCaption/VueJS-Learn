<script setup>
// ref：控制是否顯示非同步元件
// defineAsyncComponent：建立非同步元件
import { ref, defineAsyncComponent, hydrateOnIdle, hydrateOnMediaQuery } from 'vue'

import ParentProvider from './components/ParentProvider.vue'

// 匯入載入中元件
import LoadingComponent from './components/LoadingComponent.vue'

// 匯入載入錯誤元件
import ErrorComponent from './components/ErrorComponent.vue'

// 控制 UserCard 是否要出現在畫面上
const showUserCard = ref(false)

// 要傳入 UserCard 的使用者資料
const user = ref({
  name: '小明',
  job: '前端工程師',
  department: '資訊部',
  email: 'ming@example.com'
})

// 不會立刻下載 UserCard.vue (延遲載入)
// 使用進階選項建立非同步元件
const AsyncUserCard = defineAsyncComponent({
  // loader 必須是一個回傳 Promise 的函式
  // 為了讓我們看見 LoadingComponent，
  // 刻意等待 2 秒後才載入 UserCard。
  loader: async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000)
    })

    return import('./components/UserCard.vue')
  },

  // 等瀏覽器進入空閒狀態後再進行 Hydration
  //hydrate: hydrateOnIdle(),

  // 最多等待 3000 毫秒
  hydrate: hydrateOnIdle(3000),

  // 元件進入使用者的可視範圍時，才進行 Hydration
  // rootMargin: '200px' 表示在元件進入可視範圍前 200px 時就開始載入
  // hydrate: hydrateOnVisible(rootMargin: '200px'),

  // 會在指定的 CSS Media Query 成立時才進行 Hydration
  // 例如：只有螢幕寬度小於或等於 500px 時才啟用。
  // hydrateOnMediaQuery('(max-width: 500px)')

  // 這個 loader 刻意在 1.5 秒後失敗
  // loader: () =>
  //   new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       reject(
  //         new Error('模擬錯誤：UserCard 元件載入失敗')
  //       )
  //     }, 1500)
  //   }),

  // 故意等待 8 秒
  // loader: async () => {
  //   await new Promise((resolve) => {
  //     setTimeout(resolve, 8000)
  //   })

  //   return import('./components/UserCard.vue')
  // },

  // 立刻顯示 LoadingComponent，方便觀察
  loadingComponent: LoadingComponent,

  // 經過 200 毫秒後才顯示 LoadingComponent
  delay: 0,

  // 元件載入失敗時顯示
  errorComponent: ErrorComponent,

  // 超過 5000 毫秒仍未完成，就視為逾時
  timeout: 5000
})

// 顯示或隱藏使用者卡片
function toggleUserCard() {
  showUserCard.value = !showUserCard.value
}

const AsyncMobileMenu = defineAsyncComponent({
  loader: () =>
    import('./components/MobileMenu.vue'),

  // 只有當畫面寬度不超過 500px 時才 Hydrate
  hydrate: hydrateOnMediaQuery(
    '(max-width: 500px)'
  )
})

const AsyncFaqPanel = defineAsyncComponent({
  loader: () =>
    import('./components/FaqPanel.vue'),

  // 使用者第一次點擊元件時才 Hydrate
  hydrate: hydrateOnInteraction([
    'click',
    'mouseover'
  ])
})
</script>

<template>
  <main class="app">
    <div>
      <h1>Vue Provide / Inject 練習</h1>

      <!--
      ParentProvider 會提供資料，
      讓其內部的後代元件使用 inject() 取得。
    -->
      <ParentProvider />
    </div>
    <div>
      <h1>非同步元件狀態處理</h1>

      <p class="description">
        按下按鈕後，Vue 才會真正載入 UserCard 元件。
      </p>

      <button class="toggle-button" @click="toggleUserCard">
        {{ showUserCard ? '隱藏使用者卡片' : '顯示使用者卡片' }}
      </button>

      <!--
      v-if 為 false 時，AsyncUserCard 不會被渲染，
      loader 也不會執行。

      v-if 變成 true 時，Vue 才會：
      1. 執行 loader
      2. 下載 UserCard.vue
      3. 顯示 LoadingComponent
      4. 載入完成後顯示 UserCard
    -->
      <AsyncUserCard v-if="showUserCard" :user="user" />
    </div>
    <div>
      <h1>空閒時 Hydration</h1>

      <p>
        這張卡片的 HTML 可以先由伺服器顯示，
        但 Vue 會等瀏覽器空閒時才啟用它。
      </p>

      <AsyncInteractiveCard />
    </div>
    <div>
      <h1>媒體查詢 Hydration</h1>

      <p>
        將瀏覽器寬度縮小到 500px 以下，
        手機選單才會進行 Hydration。
      </p>

      <AsyncMobileMenu />
    </div>
    <div>
      <h1>互動時 Hydration</h1>
      <p>
        FAQ 的 HTML 會先顯示，
        但直到使用者點擊時才由 Vue 啟用。
      </p>
      <AsyncFaqPanel />
    </div>
    <div>
      <h1>多事件 Hydration</h1>

      <p>
        點擊或滑鼠移入 FAQ 時，
        都可以觸發 Hydration。
      </p>

      <AsyncFaqPanel />
    </div>
  </main>
</template>

<style scoped>
.app {
  width: 700px;
  margin: 40px auto;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
}

.description {
  color: #666;
}

.toggle-button {
  margin-top: 12px;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background-color: #42b883;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.toggle-button:hover {
  background-color: #369b70;
}
</style>
