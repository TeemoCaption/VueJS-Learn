# Vue 依賴注入與非同步元件學習筆記

## 本章要學什麼？

本章有三個主軸：

1. **依賴注入**：讓深層後代元件取得祖先資料，避免屬性逐層傳遞。
2. **非同步元件**：需要時才載入元件，並處理載入中、失敗與逾時。
3. **惰性水合**：在伺服器端渲染情境中，讓 HTML 先出現，稍後才啟用互動。

先記住：

> `provide()` 提供依賴，`inject()` 取得依賴。
>
> `defineAsyncComponent()` 管理非同步載入。
>
> 惰性水合是延後「啟用」，不是延後「顯示」。

---

## 一、依賴注入：解決屬性逐層傳遞

假設元件結構如下：

```text
ParentProvider
└── MiddleLayer
    └── DeepChild
```

如果 `DeepChild` 需要 `ParentProvider` 的資料，使用屬性時必須經過每一層：

```text
ParentProvider → MiddleLayer → DeepChild
```

即使 `MiddleLayer` 完全不使用資料，也必須接收並轉傳，這就是屬性逐層傳遞。

依賴注入則改成：

```text
ParentProvider
      │ provide
      ▼
DeepChild
      │ inject
```

中間元件不需要參與資料傳遞。

### 基本語法

```javascript
// 祖先元件
provide('username', username)

// 任意深層後代
const username = inject('username')
```

`inject()` 只會沿祖先鏈向上尋找，不能取得兄弟元件或子元件的資料。

---

## 二、依賴注入的資料流

祖先元件通常擁有狀態、制定修改規則：

```javascript
const username = ref('小明')

provide('userContext', {
  username,
  changeUsername
})
```

後代元件再取得依賴：

```javascript
const userContext = inject('userContext')
```

資料不是被複製，而是共享同一個響應式參照：

```text
ParentProvider 擁有 username ref
          ↓ provide
DeepChild 取得同一個 ref
          ↓
祖先更新後，後代畫面也更新
```

如果找不到依賴，可以給預設值：

```javascript
const theme = inject('theme', 'light')
```

必要依賴也可以主動檢查，讓錯誤更容易理解：

```javascript
const userContext = inject('userContext')

if (!userContext) {
  throw new Error('找不到 userContext')
}
```

---

## 三、狀態與修改方法一起提供

建議把狀態與修改方法包在同一個物件中：

```javascript
provide('userContext', {
  username: readonly(username),
  isLoggedIn: readonly(isLoggedIn),
  changeUsername,
  toggleLogin
})
```

後代元件只呼叫：

```javascript
changeUsername()
```

不要讓後代元件到處直接修改：

```javascript
username.value = '小美'
```

這樣可以讓：

- 狀態修改集中在提供者。
- 後代只負責使用資料與方法。
- `readonly()` 保護狀態不被直接改寫。
- 資料變更來源比較容易追蹤。

可以記成：

```text
提供者：擁有狀態、制定修改規則
後代元件：讀取狀態、呼叫修改方法
```

---

## 四、使用 `Symbol` 作為注入鍵

字串鍵適合小型範例：

```javascript
provide('userContext', value)
inject('userContext')
```

大型專案建議使用 `Symbol`，避免不同模組使用相同字串：

```javascript
// injectionKeys.js
export const userContextKey = Symbol('userContext')
```

提供與注入必須使用同一個 `Symbol`：

```javascript
provide(userContextKey, userContext)
const userContext = inject(userContextKey)
```

即使兩個 `Symbol` 都寫成 `Symbol('userContext')`，它們仍然是不同的鍵，因此要從共用檔案匯入同一個鍵。

---

## 五、應用程式層級的提供

也可以在 `main.js` 使用 `app.provide()`：

```javascript
const app = createApp(App)

app.provide('appConfig', {
  language: 'zh-TW',
  version: '1.0.0'
})
```

整個應用程式中的元件都能注入，適合全域主題、語系、服務與外掛設定。

但如果只是單一父子元件傳值，使用屬性會更清楚。

---

## 六、屬性、依賴注入與共享狀態的選擇

| 情境 | 建議方式 | 原因 |
| --- | --- | --- |
| 直接父子傳值 | 屬性 | 資料來源最清楚 |
| 子元件通知父元件 | 事件 | 清楚表達事情發生 |
| 深層祖先與後代共享依賴 | `provide/inject` | 中間層不必轉傳 |
| 沒有祖先後代關係的元件共享狀態 | Pinia | 狀態集中且可跨元件樹使用 |
| 只想重用純邏輯 | 組合式函式 | 不需要建立依賴關係 |

不要把 `provide/inject` 當成所有屬性的替代品；它適合處理深層元件樹的依賴，但資料來源也比較隱藏。

---

## 七、依賴注入常見錯誤

### 1. 注入鍵不一致

`username` 與 `userName` 不相同，注入結果會是 `undefined`。

### 2. 把 `ref.value` 提供出去

不建議：

```javascript
provide('username', username.value)
```

這只提供當下的普通值，後續更新不會保持響應式。應該提供整個 `ref`：

```javascript
provide('username', username)
```

### 3. 以為兄弟元件也能注入

```text
Parent
├── ComponentA
└── ComponentB
```

`ComponentA` 提供的資料不能被 `ComponentB` 直接注入，因為兩者不是祖先與後代關係。

### 4. 沒有確認提供者存在

後代元件必須位於提供者的元件樹下；必要依賴應加上明確錯誤檢查，不要等到模板讀取 `undefined.name` 才爆錯。

---

## 八、非同步元件：需要時才載入

一般匯入：

```javascript
import UserCard from './UserCard.vue'
```

非同步元件：

```javascript
const AsyncUserCard = defineAsyncComponent(() =>
  import('./UserCard.vue')
)
```

非同步元件只有在真正需要渲染時，才會執行動態匯入：

```text
需要元件
   ↓
執行 loader
   ↓
下載元件程式碼
   ↓
載入完成後渲染
```

適合大型圖表、地圖、編輯器、管理後台等低頻使用元件；首頁主要內容與導覽列通常不必延遲載入。

---

## 九、非同步元件的載入狀態

```javascript
const AsyncUserCard = defineAsyncComponent({
  loader: () => import('./UserCard.vue'),
  loadingComponent: LoadingComponent,
  delay: 200,
  errorComponent: ErrorComponent,
  timeout: 5000
})
```

| 設定 | 用途 |
| --- | --- |
| `loader` | 回傳元件載入 Promise 的函式 |
| `loadingComponent` | 載入期間顯示的元件 |
| `delay` | 延遲多久才顯示載入畫面 |
| `errorComponent` | 載入失敗或逾時時顯示的元件 |
| `timeout` | 最多允許等待多久 |

流程如下：

```text
開始渲染
   ↓
執行 loader()
   ↓
等待載入
   ├─ 成功 → 顯示真正元件
   ├─ 失敗 → 顯示錯誤元件
   └─ 超過 timeout → 顯示錯誤元件
```

### `delay` 不是延遲下載

`delay: 200` 代表載入開始後，等 200 毫秒才顯示 Loading；不是等 200 毫秒才開始下載。元件若很快完成，Loading 可能完全不會出現，可避免畫面閃爍。

### `timeout` 是最大等待時間

`timeout: 5000` 代表超過 5 秒仍未完成就視為失敗。數值不宜設得過短，否則一般網路延遲也可能被誤判。

---

## 十、`v-if` 與 `v-show` 的差別

若希望非同步元件需要時才建立，使用：

```vue
<AsyncUserCard v-if="showUserCard" />
```

`v-if="false"` 時元件不會建立，`loader` 也不會執行。

`v-show` 只是切換 CSS，元件仍可能已經建立：

```text
v-if   → 控制是否建立元件
v-show → 控制既有元件是否顯示
```

---

## 十一、惰性水合：只適用於 SSR

惰性水合的前提是使用伺服器端渲染或預先產生 HTML 的環境，例如支援 SSR 的框架。

目前 `08` 使用：

```javascript
createApp(App).mount('#app')
```

這是一般前端掛載，不是 SSR，因此不能完整展示惰性水合的實際效果。

### 先理解水合

SSR 會先產生 HTML，瀏覽器先顯示畫面，再由 Vue 接管既有 DOM、綁定事件與響應式狀態：

```text
伺服器產生 HTML
       ↓
瀏覽器先顯示 HTML
       ↓
Vue 接管 DOM
       ↓
畫面變得可以互動
```

### 惰性水合做什麼？

它不是延後顯示 HTML，而是：

```text
HTML 先顯示
互動功能稍後才啟用
```

這能減少頁面初始階段同時啟用大量元件的工作量。

---

## 十二、四種惰性水合策略

| 策略 | 啟用時機 | 適合情境 |
| --- | --- | --- |
| `hydrateOnIdle()` | 瀏覽器空閒時 | 頁尾、次要資訊 |
| `hydrateOnVisible()` | 元件進入可視範圍 | 圖表、地圖、評論 |
| `hydrateOnMediaQuery()` | 媒體條件成立 | 手機版或桌面版專屬元件 |
| `hydrateOnInteraction()` | 使用者互動時 | 問答、彈窗、展開面板 |

範例：

```javascript
const AsyncPanel = defineAsyncComponent({
  loader: () => import('./Panel.vue'),
  hydrate: hydrateOnVisible()
})
```

請分清楚：

```text
惰性載入 → 延後下載元件程式碼
惰性水合 → HTML 已存在，延後讓它具備互動能力
```

`loader` 控制載入；`hydrate` 控制啟用。

---

## 十三、目前實作的閱讀重點

目前 `08/src/App.vue` 主要展示：

- 以 2 秒延遲模擬非同步載入。
- 載入中、錯誤與逾時狀態。
- `delay: 0`，方便觀察 Loading 畫面。
- `timeout: 5000`。
- `hydrateOnIdle(3000)`。
- 媒體條件與互動事件的惰性水合範例。

閱讀資料流時，先抓住這條線：

```text
showUserCard
      ↓ v-if
AsyncUserCard
      ↓ loader
UserCard.vue
      ↓ props
顯示 user 資料
```

### 目前程式碼需要留意的地方

這些是目前實作的檢查點，不是概念本身的規則：

1. `App.vue` 使用了 `AsyncInteractiveCard`，但目前程式碼中沒有看到它的宣告或匯入。
2. `App.vue` 使用了 `hydrateOnInteraction()`，但目前匯入列表需要確認是否包含這個 API。
3. 目前專案是一般前端掛載，不是 SSR；惰性水合應視為概念示範，不能在這個環境完整觀察 SSR 水合效果。

這也提醒我們：**建置成功不代表瀏覽器執行時所有元件都已正確定義。**

---

## 十四、選擇順序

遇到元件設計問題時，可以依序判斷：

1. 直接父子傳值嗎？使用屬性。
2. 要跨越多層祖先後代嗎？考慮 `provide/inject`。
3. 元件很大且低頻使用嗎？考慮非同步載入。
4. 使用 SSR 且元件不必一開始互動嗎？考慮惰性水合。
5. 多個沒有祖先後代關係的頁面要共享狀態嗎？考慮 Pinia。

---

## 十五、本章重點總表

| 概念 | 解決的問題 | 一句話記憶 |
| --- | --- | --- |
| `provide/inject` | 屬性逐層傳遞 | 祖先提供，後代取得 |
| `readonly` | 防止後代直接改狀態 | 讀取可以，修改交給方法 |
| `Symbol` 注入鍵 | 避免名稱衝突 | 提供與注入使用同一把鍵 |
| `defineAsyncComponent` | 延後載入大型元件 | 需要時才下載 |
| `loadingComponent` | 載入期間沒有畫面 | 顯示等待狀態 |
| `errorComponent` | 載入失敗或逾時 | 顯示錯誤狀態 |
| `delay` | Loading 畫面閃爍 | 延後顯示，不延後下載 |
| `timeout` | 等待時間過長 | 超時視為失敗 |
| 惰性水合 | SSR 初始啟用成本 | HTML 先顯示，互動稍後啟用 |

最後記住：

> **依賴注入處理「資料要從哪裡取得」；非同步元件處理「元件何時載入」；惰性水合處理「SSR 元件何時啟用」。**
