# 15-router03：Vue Router 進階學習筆記

本專案整理 Vue Router 進階內容：

- 導航前／導航後取得資料
- Composition API 中的 Router 與 Route
- Composition API 導航守衛
- 使用 `useLink()` 打造客製化 RouterLink

## 一、專案入口與檔案對照

```text
src/
├── api.js
├── App.vue
├── main.js                  # 明確載入 router/index.ts
├── components/
│   └── CustomLink.vue       # useLink() 客製化連結
├── router/
│   ├── index.ts             # 目前實際使用的 Router 與登入守衛
│   └── index.js             # 簡化的 useLink 示範 Router
└── views/
    ├── UserView.vue         # useRoute、onBeforeRouteUpdate
    ├── EditProfileView.vue  # onBeforeRouteLeave
    └── PostView.vue         # beforeRouteEnter、beforeRouteUpdate
```

`main.js` 使用：

```js
import router from './router/index.ts'
```

所以目前執行時使用的是 `router/index.ts`；`router/index.js` 保留作為簡化的 `useLink()` 範例。

---

## 二、資料取得策略

### 導航完成後取得

```text
前往新網址
  ↓
先進入新頁面
  ↓
顯示 Loading
  ↓
呼叫 API
  ↓
顯示資料或錯誤
```

優點是可以快速顯示新頁面；缺點是頁面剛載入時可能還沒有資料，需要處理 Loading。常見做法是使用 `watch()` 或元件建立時取得資料。

### 導航完成前取得

```text
前往新網址
  ↓
執行導航守衛
  ↓
先呼叫 API
  ↓
資料完成
  ↓
確認導航
  ↓
進入新頁面
```

等待 API 時使用者仍停留在原頁面，通常需要全域進度或錯誤提示。適合「沒有關鍵資料就不應進入頁面」的情境。

兩種策略沒有絕對優劣，應依頁面需求與使用者體驗選擇。

---

## 三、`beforeRouteEnter()`

`beforeRouteEnter()` 是 Options API 的元件內導航守衛，在新元件建立前執行：

```js
export default {
  async beforeRouteEnter(to, from, next) {
    const post = await getPost(to.params.id)

    next(vm => {
      vm.setPost(post)
    })
  }
}
```

### 為什麼使用 `to.params.id`？

現在處理的是「即將前往」的路由，因此從 `to` 取得新參數：

```js
to.params.id
```

此時不應用 `this.$route.params.id` 代表新路由。

### 為什麼不能直接使用 `this`？

元件實例尚未建立，所以以下寫法不可行：

```js
this.post = post // ❌
```

`next(vm => { ... })` 的 callback 會等元件建立後才執行，`vm` 就是該元件實例：

```text
beforeRouteEnter()
  ↓
取得 API
  ↓
next(vm => ...)
  ↓
元件建立
  ↓
vm.setPost(post)
```

本專案的 `PostView.vue` 同時處理成功與失敗：

```js
async beforeRouteEnter(to, from, next) {
  try {
    const post = await getPost(to.params.id)

    next(vm => {
      vm.setPost(post)
    })
  } catch (err) {
    next(vm => {
      vm.setError(err)
    })
  }
}
```

---

## 四、`beforeRouteUpdate()`

例如：

```text
/posts/1  →  /posts/2
```

如果兩個網址都使用 `PostView.vue`，Vue Router 可能重用原本的元件實例，不會重新執行 `beforeRouteEnter()`，此時使用 `beforeRouteUpdate()`：

```js
async beforeRouteUpdate(to, from) {
  this.post = null
  this.error = null

  try {
    const post = await getPost(to.params.id)
    this.setPost(post)
  } catch (err) {
    this.setError(err)
  }
}
```

元件已存在，所以這裡可以直接使用 `this`。

| 守衛 | 元件實例 | 可使用 `this` | 用途 |
| --- | --- | --- | --- |
| `beforeRouteEnter` | 尚未建立 | 否 | 第一次進入元件前取得資料 |
| `beforeRouteUpdate` | 已存在 | 是 | 同一元件的路由參數改變 |
| `beforeRouteLeave` | 已存在 | 是 | 離開元件前確認 |

---

## 五、`useRouter()` 與 `useRoute()`

在 `<script setup>` 中沒有 Options API 的 `this`，因此使用 Vue Router 的 Composable：

| Options API | Composition API | 用途 |
| --- | --- | --- |
| `this.$router` | `useRouter()` | 操作 Router、進行導航 |
| `this.$route` | `useRoute()` | 讀取目前路由 |

### `useRouter()`：操作導航

```vue
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>
```

常見方法：

```js
router.push('/users')
router.replace('/login')
router.back()
router.go(-1)
```

### `useRoute()`：讀取目前路由

```vue
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

console.log(route.params.id)
console.log(route.query.page)
console.log(route.path)
</script>
```

記憶方式：

```text
useRouter() → 我要控制去哪裡
useRoute()  → 我要知道現在在哪裡
```

在 `<template>` 中仍可直接使用 `$router` 與 `$route`；只有在 JavaScript 邏輯中才需要呼叫 Composable。

---

## 六、監聽響應式 Route

`useRoute()` 取得的 `route` 是響應式物件，例如 `/users/1` 變成 `/users/2` 時，`route.params.id` 會更新。

不要監聽整個 `route`，只監聽真正需要的欄位：

```vue
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userData = ref(null)

async function fetchUser(id) {
  return {
    id,
    name: \`使用者 \${id}\`
  }
}

watch(
  () => route.params.id,
  async newId => {
    userData.value = await fetchUser(newId)
  },
  { immediate: true }
)
</script>
```

`immediate: true` 讓 watcher 在元件第一次建立時先執行一次。本專案的 `UserView.vue` 則示範「第一次直接取得資料，後續用 `onBeforeRouteUpdate()` 更新」的寫法。

---

## 七、Composition API 導航守衛

| Options API | Composition API | 作用 |
| --- | --- | --- |
| `beforeRouteLeave` | `onBeforeRouteLeave()` | 準備離開目前路由 |
| `beforeRouteUpdate` | `onBeforeRouteUpdate()` | 路由改變但元件被重用 |

### `onBeforeRouteLeave()`

適合保護尚未儲存的表單：

```vue
<script setup>
import { ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const hasUnsavedChanges = ref(false)

onBeforeRouteLeave(() => {
  if (!hasUnsavedChanges.value) {
    return
  }

  const answer = window.confirm(
    '資料尚未儲存，確定要離開嗎？'
  )

  if (!answer) {
    return false
  }
})
</script>
```

回傳 `false` 就會取消導航。本專案的 `EditProfileView.vue` 使用這個方式。

### `onBeforeRouteUpdate()`

```vue
<script setup>
import { onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteUpdate((to, from) => {
  if (to.params.id !== from.params.id) {
    // 使用新的 id 重新取得資料
  }
})
</script>
```

`to` 是新路由，`from` 是舊路由；可用 `to.params.id !== from.params.id` 避免 query 或 hash 改變時也重新抓資料。

### `watch()` 和 `onBeforeRouteUpdate()`

| | `watch()` | `onBeforeRouteUpdate()` |
| --- | --- | --- |
| 本質 | Vue 響應式監聽 | Vue Router 導航守衛 |
| 關注 | 某個響應式資料變化 | 路由正在更新 |
| 是否有 `to/from` | 沒有 | 有 |
| 是否適合取消導航 | 不適合 | 可以 `return false` |
| 常見用途 | ID 改變後重新抓資料 | 更新前判斷或攔截 |

Composition API 沒有 `onBeforeRouteEnter()`。若需在元件建立前處理資料，可使用 Options API 的 `beforeRouteEnter()`、路由層級守衛或全域守衛。

---

## 八、`useLink()`：自行打造 RouterLink

一般情況使用：

```vue
<RouterLink to="/about">
  關於我們
</RouterLink>
```

就已經足夠。只有在需要統一包裝圖示、樣式、權限或 Analytics 時，才適合用 `useLink()` 自訂連結元件。

```text
useLink() = 取出 RouterLink 的核心路由與導航能力，交給自己組裝
```

### 回傳值

```js
const {
  route,
  href,
  isActive,
  isExactActive,
  navigate
} = useLink(props)
```

| 回傳值 | 用途 |
| --- | --- |
| `route` | 解析完成的目標 Route |
| `href` | 給 HTML 連結使用的 URL |
| `isActive` | 是否與目前路由匹配 |
| `isExactActive` | 是否完全等於目前路由 |
| `navigate` | 執行 Vue Router 導航 |

### 本專案的 `CustomLink.vue`

先沿用 `RouterLink` 的 props，讓自訂元件也能接收 `to`、`replace` 等設定：

```js
import { RouterLink, useLink } from 'vue-router'

const props = defineProps({
  ...RouterLink.props,
  inactiveClass: {
    type: String,
    default: 'inactive'
  }
})
```

再傳入 `useLink()`：

```js
const {
  route,
  href,
  isActive,
  isExactActive,
  navigate
} = useLink(props)
```

模板中同時使用 `href` 與 `navigate`：

```vue
<a
  :href="href"
  :class="isActive ? 'active' : props.inactiveClass"
  @click="navigate"
>
  <slot />

  <span v-if="isExactActive">
    （目前頁面）
  </span>
</a>
```

兩者職責不同：

```text
href     → 保留正常 HTML 超連結的 URL
navigate → 交給 Vue Router 執行 SPA 導航，避免整頁重新載入
```

記憶方式：

```text
isActive       → 有沒有匹配到目前路由
isExactActive  → 是不是完全就是目前路由
```

---

## 九、目前專案中的登入守衛補充

實際入口 `src/router/index.ts` 另外示範路由 meta 與全域 `beforeEach()`：

```js
router.beforeEach(to => {
  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath
      }
    }
  }

  if (to.meta.isAdmin && !currentUserIsAdmin) {
    return {
      name: 'home'
    }
  }
})
```

重點：

- `to.meta.requiresAuth` 表示路由需要登入。
- 未登入時回傳新位置，導向登入頁。
- `redirect: to.fullPath` 記住使用者原本想前往的網址。
- `to.meta.isAdmin` 可額外檢查管理員權限。

這是全域守衛，和元件內的 `onBeforeRouteLeave()`、`onBeforeRouteUpdate()` 屬於不同層級。

---

## 十、整章快速對照表

| 需求 | 建議 API |
| --- | --- |
| JavaScript 中程式化導航 | `useRouter()` |
| 讀取 path、params、query | `useRoute()` |
| 路由資料改變後重新處理 | `watch(() => route.params.id, ...)` |
| 第一次進入元件前取得資料 | `beforeRouteEnter()` |
| 同一元件的 params 改變 | `beforeRouteUpdate()` 或 `onBeforeRouteUpdate()` |
| 離開前確認未儲存資料 | `onBeforeRouteLeave()` |
| 全站登入或權限檢查 | `router.beforeEach()` |
| 自訂 RouterLink | `useLink()` |

## 十一、最重要的記憶方式

```text
Router 負責「去哪裡」
Route  負責「現在在哪裡」

Leave  管「我要離開了」
Update 管「我還在同一個元件，但路由變了」

導航後取得資料：先換頁，再 Loading
導航前取得資料：先取得資料，再完成換頁

一般連結使用 <RouterLink>
需要自行封裝連結元件時使用 useLink()
```

## 十二、執行專案

```sh
npm install
npm run dev
```

建置確認：

```sh
npm run build
```

