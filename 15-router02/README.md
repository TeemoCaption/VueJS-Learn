# 15-router02：Vue Router 導覽守衛學習筆記

本單元延續 Vue Router 的基本路由，學習如何在「導航發生前、導航即將確認時、導航完成後，以及元件進入或離開時」檢查與控制頁面切換。

目前範例以三個頁面示範：

| 頁面 | 路徑 | 用途 |
| --- | --- | --- |
| 首頁 | `/` | 公開頁面，不需要登入 |
| 登入頁面 | `/login` | 使用 `localStorage` 模擬登入 |
| 會員中心 | `/dashboard` | 示範登入、角色與表單離開檢查 |

## 一、先建立核心觀念：守衛是在「頁面切換流程」中檢查

使用者點擊 `<RouterLink>` 或執行 `router.push()` 時，不是立刻顯示新頁面，而是先進入導航流程：

```text
使用者想切換頁面
        ↓
各層級導覽守衛依序檢查
        ↓
允許、取消，或重新導向
        ↓
導航確認
        ↓
更新畫面
```

守衛函式通常會收到兩個重要參數：

| 參數 | 意義 | 範例 |
| --- | --- | --- |
| `to` | 準備前往的路由 | `to.path === '/dashboard'` |
| `from` | 目前所在的路由 | `from.path === '/login'` |

守衛的回傳值決定這次導航如何處理：

| 回傳值 | 行為 | 適用情境 |
| --- | --- | --- |
| 不回傳、`undefined`、`true` | 放行導航 | 條件符合，可以繼續進入頁面 |
| `false` | 取消導航，停留在原頁面 | 表單尚未儲存且使用者取消離開 |
| 路由位置，例如 `{ name: 'login' }` | 取消原導航並建立新的導航 | 未登入者改送到登入頁 |

短例子：

```js
router.beforeEach((to) => {
  // 未登入者準備進入會員中心時，改送往登入頁
  if (to.name === 'dashboard' && !isLoggedIn) {
    return { name: 'login' }
  }
})
```

這段程式不會直接「顯示」登入頁，而是取消原本前往 `/dashboard` 的導航，再請 Vue Router 開始一個前往 `/login` 的新導航。

## 二、全域前置守衛：`router.beforeEach()`

### 核心概念

`beforeEach()` 會在每一次路由切換前執行，適合放置整個網站共同需要的檢查，例如：

| 檢查內容 | 適合的判斷 |
| --- | --- |
| 登入驗證 | 是否可以進入會員頁面 |
| 全域權限 | 是否具有管理員或會員權限 |
| 導航前資料檢查 | 是否符合進入網站功能的基本條件 |

目前範例只限制 `/dashboard`：

```js
router.beforeEach((to) => {
  // 從 provide/inject 取得全域登入狀態
  const auth = inject('auth')

  // 未登入者不能進入會員中心
  if (to.name === 'dashboard' && !auth.isLoggedIn) {
    return { name: 'login' }
  }
})
```

資料流如下：

```text
main.js 建立 auth
        ↓
app.provide('auth', auth)
        ↓
beforeEach() 使用 inject('auth')
        ↓
檢查 auth.isLoggedIn
        ↓
放行或重新導向 /login
```

### 使用時的注意事項

如果規則是「所有未登入者都要送往登入頁」，必須排除登入頁本身，否則可能形成無限重新導向：

```js
router.beforeEach((to) => {
  // 登入頁必須允許未登入者進入
  if (!isLoggedIn && to.name !== 'login') {
    return { name: 'login' }
  }
})
```

## 三、全域解析守衛：`router.beforeResolve()`

`beforeResolve()` 也屬於全域守衛，但執行時間比 `beforeEach()` 更後面，位於導航正式確認之前的最後階段。

| `beforeEach()` | `beforeResolve()` |
| --- | --- |
| 導航前期的基本資格檢查 | 前面守衛通過後的最後確認 |
| 適合登入與基本權限判斷 | 適合取得進入頁面前才需要的資料 |
| 先判斷「能不能往這裡走」 | 再判斷「進入前必要工作是否完成」 |
| 可以取消或重新導向 | 也可以取消或重新導向 |

目前範例進入會員中心時，模擬等待會員資料準備完成：

```js
router.beforeResolve(async (to) => {
  // 只有進入會員中心時才執行等待工作
  if (to.name === 'dashboard') {
    // 模擬請求會員資料或檢查必要權限
    await prepareMemberData()
  }
})
```

實際專案中，`prepareMemberData()` 可以替換成取得使用者資料、檢查相機權限或載入進入頁面所需的資源。Vue Router 會等待非同步守衛完成後，才決定是否正式切換頁面。

## 四、全域後置鉤子：`router.afterEach()`

`afterEach()` 在導航已經確認完成後才執行，因此它不是用來阻止導航的守衛。

```js
router.afterEach((to, from) => {
  // 導航完成後記錄使用者從哪裡前往哪裡
  console.log('從：', from.path)
  console.log('前往：', to.path)
})
```

常見用途：

| 用途 | 原因 |
| --- | --- |
| 紀錄頁面瀏覽 | 導航已完成，路由位置已確定 |
| 網站分析 | 可統計使用者實際到達的頁面 |
| 更新頁面標題或麵包屑 | 新路由已確認 |
| 記錄導航失敗 | 可接收第三個 `failure` 參數判斷結果 |

最重要的差異是：

```text
beforeEach / beforeResolve
→ 導航尚未完成，可以取消或重新導向

afterEach
→ 導航已經完成，適合做紀錄與收尾工作
```

## 五、守衛內的全域注入：`provide()` 與 `inject()`

這個範例沒有把登入狀態分散在每個元件，而是在 `main.js` 建立一個共享的響應式物件：

```js
const auth = reactive({
  // 啟動時從瀏覽器保存的資料恢復登入狀態
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',

  // 用於 beforeEnter 的角色判斷
  role: 'member'
})

// 提供給整個 Vue 應用程式使用
app.provide('auth', auth)
```

其他地方可以注入同一份資料：

```js
const auth = inject('auth')

// 登入元件更新狀態
auth.isLoggedIn = true

// 導覽守衛讀取同一份狀態
if (!auth.isLoggedIn) {
  return { name: 'login' }
}
```

資料所有權與資料流：

| 位置 | 責任 |
| --- | --- |
| `main.js` | 建立並提供共享的 `auth` 狀態 |
| `LoginView.vue` | 模擬登入並更新 `auth.isLoggedIn` |
| `router/index.js` | 讀取狀態，決定是否允許導航 |
| `DashboardView.vue` | 顯示通過守衛後的頁面 |

使用 `reactive()` 的好處是登入元件修改後，其他讀取同一個物件的地方會取得最新值。真實專案也可以將登入狀態交給 Pinia、工作階段或後端驗證管理。

## 六、路由獨享守衛：`beforeEnter`

`beforeEnter` 寫在某一條路由的設定中，只會針對該路由執行，適合處理特定頁面的特殊規則。

目前 `/dashboard` 有角色檢查：

```js
{
  path: '/dashboard',
  name: 'dashboard',
  component: DashboardView,

  // 只有進入 dashboard 時才檢查角色
  beforeEnter: () => {
    const auth = inject('auth')

    // 訪客不能進入會員中心，改送回首頁
    if (auth.role === 'guest') {
      return { name: 'home' }
    }
  }
}
```

選擇方式：

| 情境 | 建議使用 |
| --- | --- |
| 多數受保護頁面都需要登入 | `router.beforeEach()` |
| 只有某一條路由需要額外條件 | 該路由的 `beforeEnter` |
| 需要在元件離開前確認資料 | `onBeforeRouteLeave()` |
| 導航快完成前要等待資料 | `router.beforeResolve()` |

注意：`beforeEnter` 只在「進入該路由」時執行。若只是同一條路由的參數改變，且元件被重用，應考慮 `onBeforeRouteUpdate()`。

## 七、元件內守衛與組合式 API

元件內守衛把規則放在最了解自己狀態的元件中。目前 `DashboardView.vue` 使用組合式 API：

### `onBeforeRouteLeave()`：保護未儲存資料

```js
onBeforeRouteLeave(() => {
  // 沒有未儲存資料時，直接放行
  if (!hasUnsavedChanges.value) {
    return
  }

  // 有未儲存資料時，讓使用者決定是否離開
  const answer = window.confirm('資料尚未儲存，確定要離開嗎？')

  // 回傳 false 會取消導航並留在目前頁面
  if (!answer) {
    return false
  }
})
```

資料流是：

```text
使用者輸入 textarea
        ↓
hasUnsavedChanges = true
        ↓
使用者準備離開 Dashboard
        ↓
onBeforeRouteLeave()
        ↓
取消 → 留在 Dashboard
確定 → 繼續導航
```

這個守衛適合編輯表單、草稿、付款流程或尚未完成的操作。

### `onBeforeRouteUpdate()`：Route 改變但元件仍被重用

例如同一個 `UserView.vue` 同時處理：

```text
/users/1  →  /users/2
```

如果元件沒有被銷毀重建，就可以使用：

```js
onBeforeRouteUpdate((to, from) => {
  // Route 改變時重新取得對應使用者資料
  console.log('從：', from.fullPath)
  console.log('前往：', to.fullPath)
})
```

| 守衛 | 觸發時機 | 主要用途 |
| --- | --- | --- |
| `onBeforeRouteLeave()` | 準備離開目前元件 | 保護未儲存資料 |
| `onBeforeRouteUpdate()` | Route 改變但元件被重用 | 依新參數重新載入資料 |
| `beforeRouteEnter` | 準備進入新元件 | Options API 進入前處理 |

組合式 API 沒有對應的 `onBeforeRouteEnter()`，因為進入守衛執行時元件實例尚未建立，無法直接使用元件內的 `this`。若要在進入前取得資料，可使用全域守衛、路由獨享守衛或在元件建立後依需求載入。

## 八、完整的導航解析順序

不必先死背全部步驟，可以先掌握「舊元件 → 全域檢查 → 新路由 → 新元件 → 最後確認」的方向。

```text
導航被觸發
    ↓
失活元件的 beforeRouteLeave
    ↓
全域 beforeEach
    ↓
重用元件的 beforeRouteUpdate
    ↓
路由的 beforeEnter
    ↓
解析非同步路由元件
    ↓
新元件的 beforeRouteEnter
    ↓
全域 beforeResolve
    ↓
導航確認
    ↓
全域 afterEach
    ↓
DOM 更新
```

在目前的範例中，從首頁進入會員中心的大致流程是：

```text
點擊「會員中心」
    ↓
beforeEach：檢查 isLoggedIn
    ↓
beforeEnter：檢查 role
    ↓
beforeResolve：模擬準備會員資料並等待 1 秒
    ↓
導航確認
    ↓
afterEach：記錄 / → /dashboard
    ↓
顯示 DashboardView
```

如果從會員中心離開，則會先經過 `onBeforeRouteLeave()`；使用者取消時，後續正常導航不會完成。

## 九、目前範例的登入狀態與學習邊界

目前登入只是教學用模擬，不是完整的身分驗證系統：

| 項目 | 目前作法 | 真實專案可能的作法 |
| --- | --- | --- |
| 登入狀態 | `localStorage` + `reactive()` | 後端工作階段、權杖、Cookie 或 Pinia |
| 登入成功 | 將 `auth.isLoggedIn` 設為 `true` | 呼叫登入 API，取得並保存伺服器結果 |
| 角色 | `role: 'member'` 寫死 | 由後端回傳並驗證 |
| 會員資料 | `beforeResolve()` 用等待函式模擬 | 實際請求會員資料 |

目前 `App.vue` 的登入連結固定是：

```vue
<RouterLink to="/login">登入</RouterLink>
```

因此即使使用者已登入，點擊它仍然會前往 `/login`；因為目前 `/login` 沒有「已登入就重新導向 `/dashboard`」的規則。這不是 `auth.isLoggedIn` 失效，而是登入路由目前允許所有人進入。若要改善，可以在登入路由的 `beforeEnter` 或全域 `beforeEach` 中加入已登入者的重新導向規則。

## 十、快速選擇表

| 我想處理的問題 | 適合的 API |
| --- | --- |
| 每次導航前檢查登入 | `router.beforeEach()` |
| 進入某一條路由前檢查角色 | `beforeEnter` |
| 進入頁面前等待必要資料 | `router.beforeResolve()` |
| 導航完成後記錄頁面瀏覽 | `router.afterEach()` |
| 離開表單前確認是否儲存 | `onBeforeRouteLeave()` |
| 同一元件因 Route 參數改變而更新 | `onBeforeRouteUpdate()` |
| 控制導航結果 | `return`、`return false` 或回傳路由位置 |

最簡單的判斷方式是：

```text
整個網站都需要的規則 → 全域守衛
只有某條路由需要的規則 → beforeEnter
只有某個元件知道的狀態 → 元件內守衛
導航快完成前才需要的非同步工作 → beforeResolve
導航完成後的紀錄與收尾 → afterEach
```

## 十一、執行專案

在 `15-router02` 目錄執行：

```sh
npm install
npm run dev
```

建置檢查：

```sh
npm run build
```

建議操作順序：

1. 先直接點擊「會員中心」，觀察未登入時被送往 `/login`。
2. 點擊登入按鈕，觀察登入狀態寫入 `localStorage`，並導向 `/dashboard`。
3. 在個人簡介輸入文字後點擊「首頁」，觀察離開確認視窗。
4. 開啟瀏覽器主控台，觀察 `beforeEnter`、`beforeResolve` 與 `afterEach` 的執行紀錄。

## 重點總結

- 導覽守衛是在頁面真正切換前後，控制導航流程的機制。
- `beforeEach()` 適合全域登入與基本權限檢查。
- `beforeEnter` 適合單一路由的特殊條件。
- `beforeResolve()` 適合導航快確認前才需要等待的非同步工作。
- `afterEach()` 只能做導航完成後的紀錄與收尾，不能阻止導航。
- `onBeforeRouteLeave()` 適合保護未儲存的表單資料。
- `onBeforeRouteUpdate()` 適合處理 Route 改變但元件被重用的情況。
- 守衛不只是「攔截頁面」，也能透過回傳值放行、取消或重新導向導航。
