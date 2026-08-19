# Vue Router 進階 07：效能、型別、連結與導航結果

這個單元整理 Vue Router 的進階能力：路由懶加載、chunk 分組、Typed Routes、擴充 RouterLink，以及 Navigation Failure 與 Redirect。

> 本單元的程式碼會隨教學進度逐步替換。不同章節的元件可能保留在專案中，但不代表目前都註冊在同一份路由設定裡。

## 學習地圖

| 主題 | 核心問題 | 主要工具 |
| --- | --- | --- |
| 路由懶加載 | 如何避免首次進站就下載所有頁面？ | 動態 `import()` |
| Chunk 分組 | 哪些高度相關的頁面應一起下載？ | `manualChunks()` |
| Typed Routes | 如何在開發階段檢查路由名稱與參數？ | `RouteRecordInfo`、`TypesConfig` |
| 擴充 RouterLink | 如何統一內部、外部連結與自訂樣式？ | `custom`、slot、`useLink()` |
| Navigation Failures | 如何知道程式導航成功、中止或被取代？ | `await router.push()`、`isNavigationFailure()` |
| Redirect | 如何判斷最後去了另一個目的地？ | `redirectedFrom` |

---

## 1. 路由懶加載

路由懶加載把「第一次下載全部頁面」改成「進入某個頁面時才下載它」。程式碼沒有消失，而是被拆成不同 chunk，延後到需要時載入。

| 寫法 | 載入時機 | 適合情境 |
| --- | --- | --- |
| `import HomeView from './HomeView.vue'` | 應用程式初始載入 | 首頁、一定會使用的核心頁面 |
| `() => import('./AboutView.vue')` | 第一次進入對應路由 | 後台、報表、設定等非必要頁面 |

```javascript
const routes = [
  {
    path: '/',
    name: 'home',

    // 首頁一開始就載入。
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',

    // 進入 /about 時才執行 import()。
    component: () => import('../views/AboutView.vue')
  }
]
```

這個例子中，`AboutView` 只會在第一次進入 `/about` 時下載。資料流程是：Router 匹配 URL、呼叫載入函式、等待 `import()` 的 Promise、下載 chunk，最後由 `RouterView` 顯示頁面。

路由設定要提供「回傳 Promise 的函式」，不要直接把 Promise 當成元件：

```javascript
// 正確：真正進入路由時才呼叫函式。
component: () => import('../views/AboutView.vue')
```

---

## 2. 將相關頁面放進同一個 Chunk

動態 `import()` 通常會讓路由元件形成獨立 chunk，但切得越細不一定越好。如果使用者常連續進入數個高度相關的頁面，可以把它們放進同一組。

| 適合放在同一組 | 不適合硬放在同一組 |
| --- | --- |
| 同一會員流程的詳細資料、Dashboard、編輯頁 | 使用時機無關的頁面 |
| 常連續造訪的小型頁面 | 合併後體積過大的頁面 |
| 共用大量相同依賴的功能 | 幾乎不會使用的獨立功能 |

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Vite 8 使用函式決定模組所屬的 chunk。
        manualChunks(id) {
          const isUserPage =
            id.includes('/src/views/UserDetails.vue') ||
            id.includes('/src/views/UserDashboard.vue') ||
            id.includes('/src/views/UserProfileEdit.vue')

          if (isUserPage) {
            return 'group-user'
          }
        }
      }
    }
  }
})
```

Vue Router 決定「何時需要某個路由元件」，Vite 決定「元件如何被打包」。在這個 Vite 8 專案中，`manualChunks` 必須使用函式格式；舊式物件設定會造成 `manualChunks is not a function`。

---

## 3. Typed Routes：讓路由參數可被型別檢查

Typed Routes 會建立路由名稱、path 與 params 的型別對照，讓編輯器及 TypeScript 提前發現拼字或參數問題。

| `RouteRecordInfo` 位置 | 代表內容 | `/users/:id` 範例 |
| --- | --- | --- |
| 1 | 路由名稱 | `'user'` |
| 2 | 路由 path | `'/users/:id'` |
| 3 | 導航時可傳入的原始 params | `{ id: string \| number }` |
| 4 | 從 URL 讀到的標準化 params | `{ id: string }` |
| 5 | 子路由名稱 | `never` |

```typescript
import type { RouteRecordInfo } from 'vue-router'

export interface RouteNamedMap {
  user: RouteRecordInfo<
    'user',
    '/users/:id',
    { id: string | number },
    { id: string },
    never
  >
}

declare module 'vue-router' {
  interface TypesConfig {
    RouteNamedMap: RouteNamedMap
  }
}
```

```typescript
// 導航時 id 可使用 number；寫入 URL 後會標準化成 string。
router.push({
  name: 'user',
  params: { id: 100 }
})
```

這能提早發現路由名稱拼錯、必要參數遺漏或型別不符。手動宣告必須與真實路由同步；大型專案可考慮使用 `unplugin-vue-router` 自動產生型別。

---

## 4. 擴充 RouterLink

當專案需要統一處理外部網址、active 樣式或設計系統連結時，可以封裝原生 `RouterLink`。

| 輸入內容 | 實際渲染 | 原因 |
| --- | --- | --- |
| `/about`、具名路由物件 | `RouterLink` | 保留 SPA 導航，不重新載入整頁 |
| `https://...` | 原生 `<a>` | 交由瀏覽器前往外部網站 |

封裝時可用 `...RouterLink.props` 繼承 `to`、`replace`、`activeClass` 等 props，再加入自己的 `inactiveClass`。

```vue
<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

defineOptions({
  // Attributes 要由元件決定傳給 a 或 RouterLink。
  inheritAttrs: false
})

const props = defineProps({
  ...RouterLink.props,
  inactiveClass: String
})

// 判斷是否為外部網址。
const isExternal = computed(() => {
  return typeof props.to === 'string' && props.to.startsWith('http')
})
</script>
```

`inheritAttrs: false` 可避免 `class`、`target` 等 Attributes 落到錯誤的根元素，再使用 `v-bind="$attrs"` 明確交給真正的連結。

### `<RouterLink custom>` 提供的能力

| Slot 值 | 用途 |
| --- | --- |
| `href` | Router 解析後的網址 |
| `navigate` | 攔截點擊並執行 SPA 導航 |
| `isActive` | 目前路由包含這個連結時為 `true` |
| `isExactActive` | 目前路由與連結完全相符時為 `true` |

```vue
<RouterLink :to="to" custom v-slot="{ href, navigate, isActive }">
  <!-- 保留正確 href，也交給 Router 處理點擊。 -->
  <a
    :href="href"
    :class="{ active: isActive }"
    @click="navigate"
  >
    <slot />
  </a>
</RouterLink>
```

畫面仍是標準 `<a>`，但點擊時不重新載入整頁，而且可依目前路由自行控制樣式。

### `custom` slot 與 `useLink()` 的選擇

| 選擇 | 適合情境 |
| --- | --- |
| `<RouterLink custom>` | 在 template 中快速改寫連結 DOM 與樣式 |
| `useLink()` | 在 Composition API 中建立更深度的連結元件 |

```javascript
import { reactive } from 'vue'
import { useLink } from 'vue-router'

const props = defineProps({
  to: {
    type: [String, Object],
    required: true
  }
})

// useLink() 接收響應式的 RouterLink props。
const link = reactive({ to: props.to })

const {
  href,
  navigate,
  isActive,
  isExactActive
} = useLink(link)
```

`useLink()` 直接提供 RouterLink 內部的連結解析與導航能力，適合自製按鈕式連結、選單或設計系統元件。

---

## 5. 等待程式導航的結果

`router.push()` 會回傳 Promise。使用 `await` 不只等待 URL 改變，也能取得導航是否被阻止的結果。

```javascript
// 等待 Router 完成這次導航判斷。
const failure = await router.push('/admin')

if (failure) {
  // 使用者仍可能停留在原頁面。
}
```

| `router.push()` 結果 | 意義 |
| --- | --- |
| Falsy 值 | 導航成功，或成功重定向到其他位置 |
| Navigation Failure 物件 | 導航未依原要求完成 |

若要知道具體原因，應繼續使用 `isNavigationFailure()` 判斷。

---

## 6. Navigation Failure 的分類與判斷

| 類型 | 發生情境 | 常見處理 |
| --- | --- | --- |
| `aborted` | Guard 回傳 `false`，主動中止導航 | 顯示權限不足或尚未儲存 |
| `cancelled` | 新導航取代尚未完成的舊導航 | 停止舊流程，通常不用顯示錯誤 |
| `duplicated` | 再次前往目前所在位置 | 忽略或提示已在該頁 |

```javascript
import {
  isNavigationFailure,
  NavigationFailureType
} from 'vue-router'

const failure = await router.push('/admin')

// 確認它是 aborted 類型的 Navigation Failure。
if (
  isNavigationFailure(
    failure,
    NavigationFailureType.aborted
  )
) {
  message.value = '目前沒有進入 Admin 的權限。'
}
```

不傳第二個參數時，只判斷它是不是 Navigation Failure；傳入 `NavigationFailureType` 才會比對指定類型。這比直接比較內部的 `failure.type` 更符合 Router 的公開 API。

### 失敗導航的起點與目標

| 屬性 | 代表內容 |
| --- | --- |
| `failure.from` | 導航開始時所在的 Route |
| `failure.to` | 原本想前往但沒有完成的 Route |

```javascript
if (isNavigationFailure(failure)) {
  // 顯示這次失敗導航的起點與目標。
  console.log(failure.from.fullPath)
  console.log(failure.to.fullPath)
}
```

`from` 與 `to` 都是 Route Location，也能取得 `name`、`params`、`query` 與 `fullPath`。適合用於提示訊息、紀錄分析或復原未完成操作。

---

## 7. Redirect 不是 Navigation Failure

| Guard 回傳值 | Router 行為 | 結果分類 |
| --- | --- | --- |
| 沒有回傳或回傳 `true` | 繼續原導航 | 成功 |
| `false` | 停在原頁面 | `aborted` failure |
| `'/login'` | 改為前往登入頁 | Redirect |
| `{ name: 'login' }` | 改為前往登入頁 | Redirect |

```javascript
router.beforeEach((to) => {
  // 未登入者進入 Admin 時，改為前往 Login。
  if (to.name === 'admin' && !isLoggedIn) {
    return { name: 'login' }
  }
})
```

Redirect 代表 Router 成功完成了另一個導航，因此不應用 `isNavigationFailure()` 判斷。可改查目前 Route 的 `redirectedFrom`：

```javascript
await router.push({ name: 'admin' })

const redirectedFrom =
  router.currentRoute.value.redirectedFrom

if (redirectedFrom) {
  // redirectedFrom 是原本嘗試前往的 Route。
  console.log(redirectedFrom.fullPath)
}
```

一句話區分：Navigation Failure 是「這次導航沒有完成」；Redirect 是「導航有完成，但最後抵達另一個目的地」。

---

## 8. API 選擇速查

| 想解決的問題 | 使用方式 |
| --- | --- |
| 頁面使用時才下載 | `component: () => import(...)` |
| 將相關頁面打包成同一組 | `manualChunks(id)` |
| 檢查路由名稱與 params 型別 | Typed Routes |
| 自訂 RouterLink 的 HTML 與樣式 | `<RouterLink custom>` |
| 在 Composition API 取得連結能力 | `useLink()` |
| 等待程式導航完成 | `await router.push()` |
| 判斷是否為導航故障 | `isNavigationFailure()` |
| 判斷導航故障類型 | `NavigationFailureType` |
| 取得失敗導航的起點與目標 | `failure.from`、`failure.to` |
| 判斷是否曾重定向 | `currentRoute.value.redirectedFrom` |

## 執行專案

```sh
# 安裝相依套件。
npm install

# 啟動開發伺服器。
npm run dev

# 建立正式環境版本並檢查能否成功編譯。
npm run build
```
